import { useState } from 'react';

const TOPICS = [
  {
    id: 1,
    title: 'Heart Health',
    subtitle: 'Keep your heart strong and healthy',
    icon: '🫀',
    color: '#ef476f',
    bgColor: '#fef0f3',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&q=80',
    readTime: '5 min read',
    category: 'Cardiology',
    intro: 'Your heart beats about 100,000 times a day. Taking care of it is one of the most important things you can do for your long-term health.',
    sections: [
      {
        heading: '🏃 Exercise Regularly',
        content: 'Aim for at least 150 minutes of moderate aerobic activity per week — like brisk walking, cycling, or swimming. Exercise strengthens your heart muscle, lowers blood pressure, and improves circulation. Even a 30-minute daily walk can significantly reduce your risk of heart disease.',
      },
      {
        heading: '🥗 Eat a Heart-Healthy Diet',
        content: 'Focus on fruits, vegetables, whole grains, lean proteins, and healthy fats like those found in olive oil, nuts, and avocados. Limit saturated fats, trans fats, sodium, and added sugars. The Mediterranean diet is widely regarded as one of the best for heart health.',
      },
      {
        heading: '🚭 Quit Smoking',
        content: 'Smoking is one of the biggest risk factors for heart disease. It damages blood vessels, reduces oxygen in the blood, and raises blood pressure. Quitting smoking — even after years — can dramatically improve your cardiovascular health within months.',
      },
      {
        heading: '😴 Get Enough Sleep',
        content: 'Adults need 7–9 hours of quality sleep per night. Poor sleep is linked to high blood pressure, obesity, and increased risk of heart attack. Establish a consistent sleep schedule and create a relaxing bedtime routine.',
      },
      {
        heading: '🧘 Manage Stress',
        content: 'Chronic stress raises cortisol levels, which can increase blood pressure and cholesterol. Try meditation, deep breathing, yoga, or spending time in nature. Talking to a therapist or counselor can also be incredibly beneficial.',
      },
    ],
    tips: ['Check your blood pressure regularly', 'Know your cholesterol numbers', 'Limit alcohol to 1-2 drinks per day', 'Stay hydrated — drink 8 glasses of water daily'],
  },
  {
    id: 2,
    title: 'Mental Wellness',
    subtitle: 'Nurture your mind and emotional health',
    icon: '🧠',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    readTime: '6 min read',
    category: 'Psychiatry',
    intro: 'Mental health is just as important as physical health. It affects how we think, feel, and act — and influences every part of our daily lives.',
    sections: [
      {
        heading: '🤝 Stay Connected',
        content: 'Strong social connections are one of the most powerful predictors of happiness and longevity. Make time for friends and family, join community groups, or volunteer. Even brief positive interactions with strangers can boost your mood and sense of wellbeing.',
      },
      {
        heading: '📵 Take Digital Breaks',
        content: 'Excessive screen time — especially on social media — is linked to anxiety, depression, and poor sleep. Set daily limits on your phone use, take regular breaks from screens, and avoid devices for at least an hour before bed.',
      },
      {
        heading: '📓 Practice Gratitude',
        content: 'Keeping a daily gratitude journal — writing down 3 things you are grateful for — has been scientifically shown to increase happiness, reduce depression, and improve overall wellbeing. It shifts your focus from what is missing to what you already have.',
      },
      {
        heading: '🎯 Set Meaningful Goals',
        content: 'Having purpose and direction in life is a major contributor to mental health. Set small, achievable goals and celebrate progress. This builds confidence, motivation, and a sense of control over your life.',
      },
      {
        heading: '🆘 Seek Help When Needed',
        content: 'There is no shame in asking for help. If you are experiencing persistent sadness, anxiety, or emotional distress, talk to a mental health professional. Therapy, counseling, and medication are all effective treatments that can transform your quality of life.',
      },
    ],
    tips: ['Meditate for 10 minutes daily', 'Limit news consumption', 'Spend time outdoors every day', 'Practice deep breathing exercises'],
  },
  {
    id: 3,
    title: 'Healthy Eating',
    subtitle: 'Fuel your body with the right nutrition',
    icon: '🥗',
    color: '#06d6a0',
    bgColor: '#f0fdf9',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    readTime: '7 min read',
    category: 'General Health',
    intro: 'Food is medicine. What you eat directly impacts your energy levels, immune system, weight, mood, and long-term disease risk. Good nutrition does not have to be complicated.',
    sections: [
      {
        heading: '🌈 Eat the Rainbow',
        content: 'Different colored fruits and vegetables contain different vitamins, minerals, and antioxidants. Aim to include a variety of colors in every meal — red tomatoes, orange carrots, yellow peppers, green spinach, blueberries, and purple cabbage. The more colorful your plate, the more nutrients you get.',
      },
      {
        heading: '💧 Stay Hydrated',
        content: 'Water is involved in nearly every bodily function — digestion, circulation, temperature regulation, and waste removal. Aim for 8–10 glasses of water per day. Herbal teas and water-rich foods like cucumbers and watermelon also count. Limit sugary drinks and excessive caffeine.',
      },
      {
        heading: '⚖️ Watch Portion Sizes',
        content: 'Overeating — even healthy foods — can lead to weight gain. Use smaller plates, eat slowly, and stop when you feel 80% full. Meal prepping helps you control portions and avoid impulse eating. Avoid eating while distracted by TV or your phone.',
      },
      {
        heading: '🚫 Limit Processed Foods',
        content: 'Ultra-processed foods — chips, fast food, sugary cereals, packaged snacks — are high in salt, sugar, and unhealthy fats while being low in nutrients. They are designed to be addictive and easy to overeat. Replace them with whole, minimally processed alternatives whenever possible.',
      },
      {
        heading: '🍽️ Plan Your Meals',
        content: 'Meal planning is one of the most effective strategies for eating healthily. When you plan ahead, you are less likely to grab unhealthy convenience food. Dedicate one day a week to planning and prepping meals. Keep healthy snacks like nuts, fruit, and yogurt readily available.',
      },
    ],
    tips: ['Eat breakfast within 1 hour of waking', 'Include protein in every meal', 'Avoid eating 2 hours before bed', 'Read nutrition labels carefully'],
  },
  {
    id: 4,
    title: 'Better Sleep',
    subtitle: 'Rest well, live better',
    icon: '😴',
    color: '#1a6bcc',
    bgColor: '#eff6ff',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&q=80',
    readTime: '5 min read',
    category: 'General Health',
    intro: 'Sleep is not a luxury — it is a biological necessity. Quality sleep repairs your body, consolidates memories, regulates emotions, and supports immune function. Most adults need 7–9 hours per night.',
    sections: [
      {
        heading: '🕙 Keep a Consistent Schedule',
        content: 'Go to bed and wake up at the same time every day — even on weekends. This regulates your circadian rhythm (internal body clock), making it easier to fall asleep and wake up naturally. Irregular sleep schedules confuse your body and lead to chronic fatigue.',
      },
      {
        heading: '🌙 Create a Sleep-Friendly Environment',
        content: 'Your bedroom should be cool (65–68°F / 18–20°C), dark, and quiet. Use blackout curtains, earplugs, or a white noise machine if needed. Invest in a comfortable mattress and pillows. Reserve your bed only for sleep — avoid working or watching TV in bed.',
      },
      {
        heading: '📱 Avoid Screens Before Bed',
        content: 'The blue light from phones, tablets, and computers suppresses melatonin production — the hormone that makes you sleepy. Avoid screens for at least 1 hour before bed. Use night mode on devices if you must use them, and consider blue-light-blocking glasses.',
      },
      {
        heading: '☕ Limit Caffeine and Alcohol',
        content: 'Caffeine has a half-life of 5–6 hours, meaning half of a 3pm coffee is still in your system at 9pm. Avoid caffeine after 2pm. While alcohol may help you fall asleep, it disrupts sleep cycles and reduces sleep quality — especially deep, restorative sleep.',
      },
      {
        heading: '🛁 Build a Relaxing Bedtime Routine',
        content: 'Signal to your body that it is time to wind down. Take a warm bath, read a physical book, practice gentle stretching, or listen to calming music. Avoid stimulating activities like intense exercise, stressful conversations, or action-packed TV shows close to bedtime.',
      },
    ],
    tips: ['Avoid naps longer than 20 minutes', 'Exercise regularly but not too late', 'Try magnesium supplements', 'Use relaxation apps like Calm or Headspace'],
  },
  {
    id: 5,
    title: 'Skin Care',
    subtitle: 'Protect and nourish your skin',
    icon: '✨',
    color: '#f59e0b',
    bgColor: '#fffbeb',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    readTime: '4 min read',
    category: 'Dermatology',
    intro: 'Your skin is your largest organ and your first line of defense against the environment. Good skincare habits protect you from sun damage, premature aging, infections, and skin cancer.',
    sections: [
      {
        heading: '☀️ Always Use Sunscreen',
        content: 'UV radiation is the number one cause of premature aging and skin cancer. Apply a broad-spectrum SPF 30+ sunscreen every day — even on cloudy days and in winter. Reapply every 2 hours when outdoors. Wear protective clothing, hats, and seek shade during peak sun hours (10am–4pm).',
      },
      {
        heading: '💦 Moisturize Daily',
        content: 'Keeping skin hydrated prevents dryness, flaking, and irritation. Apply moisturizer while your skin is still slightly damp after washing to lock in moisture. Choose products suited to your skin type — lightweight gels for oily skin, richer creams for dry skin.',
      },
      {
        heading: '🧼 Cleanse Gently',
        content: 'Wash your face twice daily with a gentle, pH-balanced cleanser. Avoid harsh soaps that strip natural oils. Remove makeup before bed — sleeping with makeup clogs pores and accelerates aging. Use lukewarm water — hot water damages the skin barrier.',
      },
      {
        heading: '🥤 Hydrate from Within',
        content: 'Drinking enough water keeps skin plump, elastic, and glowing. Foods rich in antioxidants — berries, leafy greens, nuts — protect against free radical damage. Omega-3 fatty acids in salmon and flaxseeds support the skin barrier and reduce inflammation.',
      },
      {
        heading: '🔍 Check Your Skin Regularly',
        content: 'Perform monthly self-exams to check for new or changing moles, spots, or lesions. See a dermatologist annually for a professional skin check. Early detection of skin cancer has a 99% survival rate when caught early. Know the ABCDE rule: Asymmetry, Border, Color, Diameter, Evolution.',
      },
    ],
    tips: ['Never go to bed with makeup on', 'Change pillowcases weekly', 'Avoid touching your face', 'Stay out of tanning beds entirely'],
  },
  {
    id: 6,
    title: 'Fitness & Exercise',
    subtitle: 'Move your body, transform your life',
    icon: '💪',
    color: '#ef476f',
    bgColor: '#fef0f3',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    readTime: '6 min read',
    category: 'General Health',
    intro: 'Regular physical activity is one of the most powerful things you can do for your health. It reduces the risk of over 35 chronic diseases, improves mood, boosts energy, and extends lifespan.',
    sections: [
      {
        heading: '🎯 Find Activities You Enjoy',
        content: 'The best exercise is the one you will actually do consistently. Experiment with different activities — swimming, dancing, hiking, cycling, martial arts, team sports — until you find what you love. Enjoyment is the biggest predictor of long-term exercise adherence.',
      },
      {
        heading: '💪 Include Strength Training',
        content: 'Lifting weights or doing bodyweight exercises 2–3 times per week preserves muscle mass, increases metabolism, strengthens bones, and improves posture. You do not need a gym — push-ups, squats, lunges, and planks can be done anywhere with no equipment.',
      },
      {
        heading: '🧘 Do not Skip Flexibility Work',
        content: 'Stretching and mobility work improves range of motion, reduces injury risk, and relieves muscle tension. Incorporate yoga, Pilates, or dedicated stretching sessions into your routine. Even 10 minutes of stretching daily can make a noticeable difference.',
      },
      {
        heading: '📈 Progress Gradually',
        content: 'Avoid the temptation to do too much too soon — this leads to injury and burnout. Follow the 10% rule: increase your training volume or intensity by no more than 10% per week. Rest days are just as important as training days — muscles grow during recovery, not during exercise.',
      },
      {
        heading: '⏰ Be Consistent Over Intense',
        content: 'Three moderate 30-minute workouts per week, done consistently for a year, will produce far better results than intense daily training for 2 weeks followed by burnout. Build exercise into your daily routine like brushing your teeth — make it non-negotiable.',
      },
    ],
    tips: ['Warm up before and cool down after every workout', 'Track your progress in a fitness journal', 'Get a workout buddy for accountability', 'Replace elevator with stairs whenever possible'],
  },
];

export default function StayHealthy() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  if (selectedTopic) {
    return <ArticleView topic={selectedTopic} onBack={() => setSelectedTopic(null)} />;
  }

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1a6bcc 100%)',
        padding: '3.5rem 0',
        color: '#fff',
        textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', marginBottom: '1rem' }}>
            Stay Healthy
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Expert health tips and guides to help you live your best life.
            Click any topic below to read the full article.
          </p>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Health Topics</h2>
            <p className="text-muted">Select a topic to read the full guide</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {TOPICS.map(topic => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1.5px solid #e9eef5',
                  cursor: 'pointer',
                  transition: 'all 250ms ease',
                  boxShadow: '0 2px 12px rgba(26,107,204,0.06)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,107,204,0.15)'; e.currentTarget.style.borderColor = topic.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,107,204,0.06)'; e.currentTarget.style.borderColor = '#e9eef5'; }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={topic.image}
                    alt={topic.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 400ms ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: topic.bgColor, color: topic.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {topic.category}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{topic.icon}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0d1b2a' }}>{topic.title}</h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#8796a9', marginBottom: '1rem', lineHeight: 1.5 }}>{topic.subtitle}</p>
                  <p style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {topic.intro.slice(0, 100)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#8796a9' }}>⏱ {topic.readTime}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: topic.color }}>Read more →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ARTICLE VIEW ──
function ArticleView({ topic, onBack }) {
  return (
    <div>
      {/* Article Hero */}
      <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
        <img src={topic.image} alt={topic.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none'; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }} />
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '800px', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ background: topic.bgColor, color: topic.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{topic.category}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>⏱ {topic.readTime}</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: '0.5rem' }}>
            {topic.icon} {topic.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>{topic.subtitle}</p>
        </div>
      </div>

      {/* Article Content */}
      <div className="section" style={{ paddingTop: '2.5rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* Back Button */}
          <button onClick={onBack} className="btn btn--ghost btn--sm" style={{ marginBottom: '2rem' }}>
            ← Back to Health Topics
          </button>

          {/* Intro */}
          <div style={{ background: topic.bgColor, border: `1.5px solid ${topic.color}22`, borderLeft: `4px solid ${topic.color}`, borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '1.05rem', color: '#0d1b2a', lineHeight: 1.7, margin: 0 }}>{topic.intro}</p>
          </div>

          {/* Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2.5rem' }}>
            {topic.sections.map((section, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1.5px solid #e9eef5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0d1b2a' }}>{section.heading}</h3>
                <p style={{ color: '#4a5568', lineHeight: 1.75, fontSize: '0.95rem', margin: 0 }}>{section.content}</p>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div style={{ background: '#0d1b2a', borderRadius: '16px', padding: '2rem', marginBottom: '2.5rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.25rem' }}>💡 Quick Tips</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {topic.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '0.75rem' }}>
                  <span style={{ color: topic.color, fontSize: '1rem', flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: 1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Topics */}
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>📚 Explore More Topics</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {TOPICS.filter(t => t.id !== topic.id).slice(0, 3).map(t => (
                <button
                  key={t.id}
                  onClick={() => { window.scrollTo(0, 0); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '999px', border: '1.5px solid #e9eef5', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, color: '#0d1b2a', transition: 'all 200ms', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.color = t.color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e9eef5'; e.currentTarget.style.color = '#0d1b2a'; }}
                  onClick={() => { window.scrollTo(0, 0); onBack(); setTimeout(() => document.getElementById(`topic-${t.id}`)?.click(), 100); }}
                >
                  {t.icon} {t.title}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

