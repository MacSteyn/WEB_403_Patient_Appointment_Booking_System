require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const seedData = async () => {
  await connectDB();

  console.log('🗑️  Clearing existing data...');
  await Appointment.deleteMany();
  await Doctor.deleteMany();
  await User.deleteMany();

  console.log('👤 Creating users...');

  // Create Admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@medibook.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 555-000-0000',
  });

  // Create a test patient
  const patient = await User.create({
    name: 'John Patient',
    email: 'patient@medibook.com',
    password: 'patient123',
    role: 'patient',
    phone: '+1 555-111-2222',
    address: '123 Main St, New York',
    dateOfBirth: new Date('1990-05-15'),
  });

  // Create Doctor Users
  const doctorUsers = await User.insertMany([
    { name: 'Sarah Johnson',   email: 'sarah@medibook.com',   password: 'doctor123', role: 'doctor', phone: '+1 555-201-0001' },
    { name: 'Michael Chen',    email: 'michael@medibook.com',  password: 'doctor123', role: 'doctor', phone: '+1 555-201-0002' },
    { name: 'Emily Rodriguez', email: 'emily@medibook.com',    password: 'doctor123', role: 'doctor', phone: '+1 555-201-0003' },
    { name: 'James Wilson',    email: 'james@medibook.com',    password: 'doctor123', role: 'doctor', phone: '+1 555-201-0004' },
    { name: 'Aisha Patel',     email: 'aisha@medibook.com',    password: 'doctor123', role: 'doctor', phone: '+1 555-201-0005' },
    { name: 'Robert Kim',      email: 'robert@medibook.com',   password: 'doctor123', role: 'doctor', phone: '+1 555-201-0006' },
    { name: 'Lisa Thompson',   email: 'lisa@medibook.com',     password: 'doctor123', role: 'doctor', phone: '+1 555-201-0007' },
    { name: 'David Martinez',  email: 'david@medibook.com',    password: 'doctor123', role: 'doctor', phone: '+1 555-201-0008' },
  ]);

  console.log('👨‍⚕️ Creating doctor profiles...');

  const doctorProfiles = [
    {
      user: doctorUsers[0]._id,
      specialty: 'Cardiology',
      bio: 'Board-certified cardiologist with 15 years of experience in treating heart conditions and cardiovascular diseases.',
      experience: 15,
      consultationFee: 200,
      rating: 4.9,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: { start: '09:00', end: '17:00' },
    },
    {
      user: doctorUsers[1]._id,
      specialty: 'Neurology',
      bio: 'Specialist in neurological disorders including migraines, epilepsy, and stroke management with 12 years of practice.',
      experience: 12,
      consultationFee: 180,
      rating: 4.8,
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableHours: { start: '10:00', end: '18:00' },
    },
    {
      user: doctorUsers[2]._id,
      specialty: 'Dermatology',
      bio: 'Expert in skin conditions, cosmetic dermatology, and skin cancer screening with a patient-first approach.',
      experience: 10,
      consultationFee: 150,
      rating: 4.7,
      availableDays: ['Tuesday', 'Thursday', 'Saturday'],
      availableHours: { start: '09:00', end: '15:00' },
    },
    {
      user: doctorUsers[3]._id,
      specialty: 'Orthopedics',
      bio: 'Orthopedic surgeon specializing in joint replacement, sports injuries, and spine disorders.',
      experience: 18,
      consultationFee: 220,
      rating: 4.9,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      availableHours: { start: '08:00', end: '16:00' },
    },
    {
      user: doctorUsers[4]._id,
      specialty: 'Pediatrics',
      bio: 'Dedicated pediatrician providing comprehensive care for children from newborns to teenagers.',
      experience: 8,
      consultationFee: 120,
      rating: 4.8,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: { start: '09:00', end: '17:00' },
    },
    {
      user: doctorUsers[5]._id,
      specialty: 'General Practice',
      bio: 'Family medicine physician offering preventive care, routine checkups, and management of chronic conditions.',
      experience: 20,
      consultationFee: 100,
      rating: 4.6,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      availableHours: { start: '08:00', end: '18:00' },
    },
    {
      user: doctorUsers[6]._id,
      specialty: 'Psychiatry',
      bio: 'Compassionate psychiatrist specializing in anxiety, depression, PTSD, and other mental health conditions.',
      experience: 14,
      consultationFee: 190,
      rating: 4.9,
      availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: { start: '10:00', end: '19:00' },
    },
    {
      user: doctorUsers[7]._id,
      specialty: 'Ophthalmology',
      bio: 'Eye specialist offering comprehensive eye exams, cataract surgery, and treatment of retinal disorders.',
      experience: 11,
      consultationFee: 160,
      rating: 4.7,
      availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableHours: { start: '09:00', end: '16:00' },
    },
  ];

  const doctors = await Doctor.insertMany(doctorProfiles);

  console.log('📅 Creating sample appointments...');

  await Appointment.insertMany([
    {
      patient: patient._id,
      doctor: doctors[0]._id,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      time: '10:00',
      reason: 'Regular heart checkup and ECG review',
      status: 'confirmed',
      type: 'in-person',
    },
    {
      patient: patient._id,
      doctor: doctors[4]._id,
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      time: '14:00',
      reason: 'Annual physical examination',
      status: 'pending',
      type: 'in-person',
    },
    {
      patient: patient._id,
      doctor: doctors[6]._id,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      time: '11:00',
      reason: 'Follow-up consultation for anxiety management',
      status: 'completed',
      type: 'virtual',
    },
  ]);

  console.log('\n✅ Database seeded successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 TEST LOGIN CREDENTIALS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 Admin:');
  console.log('   Email:    admin@medibook.com');
  console.log('   Password: admin123');
  console.log('');
  console.log('🧑 Patient:');
  console.log('   Email:    patient@medibook.com');
  console.log('   Password: patient123');
  console.log('');
  console.log('👨‍⚕️ Doctor (any of these):');
  console.log('   Email:    sarah@medibook.com');
  console.log('   Password: doctor123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
