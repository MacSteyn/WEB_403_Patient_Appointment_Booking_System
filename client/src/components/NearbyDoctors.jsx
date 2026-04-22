import { useState, useEffect, useRef } from 'react';

export default function NearbyDoctors({ onSelectDoctor }) {
  const [nearbyDoctors, setNearbyDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Load Google Maps script dynamically
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to client/.env');
      return;
    }

    if (window.google) { setMapLoaded(true); return; }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    script.onerror = () => setError('Failed to load Google Maps. Check your API key.');
    document.head.appendChild(script);
  }, []);

  // Get user location and search nearby doctors
  const findNearbyDoctors = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        searchDoctors(location);
      },
      () => {
        setError('Unable to get your location. Please allow location access.');
        setLoading(false);
      }
    );
  };

  const searchDoctors = (location) => {
    if (!window.google || !mapRef.current) return;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 14,
      styles: [
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
      ],
    });
    mapInstanceRef.current = map;

    // Add user marker
    new window.google.maps.Marker({
      position: location,
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#1a6bcc',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      title: 'Your Location',
    });

    // Search for nearby doctors/hospitals
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location,
      radius: 5000, // 5km radius
      type: 'doctor',
      keyword: 'doctor medical clinic hospital',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const doctors = results.slice(0, 10).map((place) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          rating: place.rating || 'N/A',
          totalRatings: place.user_ratings_total || 0,
          isOpen: place.opening_hours?.isOpen?.() ?? null,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          photo: place.photos?.[0]?.getUrl({ maxWidth: 100 }) || null,
          types: place.types || [],
        }));

        setNearbyDoctors(doctors);

        // Add markers for each doctor
        doctors.forEach((doc, index) => {
          const marker = new window.google.maps.Marker({
            position: doc.location,
            map,
            title: doc.name,
            label: {
              text: `${index + 1}`,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px',
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 16,
              fillColor: '#ef476f',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          // Info window on click
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding:8px;max-width:200px">
                <strong style="font-size:14px">${doc.name}</strong><br/>
                <span style="color:#666;font-size:12px">${doc.address}</span><br/>
                ${doc.rating !== 'N/A' ? `<span style="color:#f59e0b">⭐ ${doc.rating}</span>` : ''}
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
      } else {
        setError('No doctors found nearby. Try a different location.');
      }
      setLoading(false);
    });
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>📍 Find Nearby Doctors</h3>
          <p style={{ fontSize: '0.82rem', color: '#8796a9' }}>Real clinics and hospitals near your location</p>
        </div>
        <button
          onClick={findNearbyDoctors}
          className="btn btn--primary btn--sm"
          disabled={loading || !mapLoaded}
        >
          {loading ? '🔍 Searching...' : '📍 Find Near Me'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Map */}
      {userLocation && (
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            border: '1.5px solid #e9eef5',
            marginBottom: '1rem',
            overflow: 'hidden',
          }}
        />
      )}

      {/* Doctor List */}
      {nearbyDoctors.length > 0 && (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#8796a9', marginBottom: '0.75rem' }}>
            Found {nearbyDoctors.length} doctors nearby — click to pre-fill booking
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {nearbyDoctors.map((doc, index) => (
              <div
                key={doc.id}
                onClick={() => onSelectDoctor(doc)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: '#f8fafc',
                  border: '1.5px solid #e9eef5',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1a6bcc'; e.currentTarget.style.background = '#e8f0fb'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9eef5'; e.currentTarget.style.background = '#f8fafc'; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: '#1a6bcc', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0d1b2a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#8796a9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📍 {doc.address}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
                  {doc.rating !== 'N/A' && <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>⭐ {doc.rating}</span>}
                  {doc.isOpen !== null && (
                    <span style={{ fontSize: '0.72rem', color: doc.isOpen ? '#06d6a0' : '#ef476f', fontWeight: 600 }}>
                      {doc.isOpen ? '● Open' : '● Closed'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
