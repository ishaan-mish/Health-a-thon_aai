import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Doctor from './models/Doctor.js';
import Patient from './models/Patient.js';
import Vitals from './models/Vitals.js';
import Appointment from './models/Appointment.js';
import Prescription from './models/Prescription.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Vitals.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});

    const hash = await bcrypt.hash('password123', 10);

    const doc1 = await Doctor.create({ name: 'Dr. Priya Sharma', email: 'priya.sharma@mitra.com', password: hash, role: 'Doctor' });
    const doc2 = await Doctor.create({ name: 'Dr. Anita Gupta', email: 'anita.gupta@mitra.com', password: hash, role: 'Doctor' });

    const dueDate1 = new Date();
    dueDate1.setDate(dueDate1.getDate() + 42);
    const dueDate2 = new Date();
    dueDate2.setDate(dueDate2.getDate() - 14);

    const p1 = await Patient.create({
      name: 'Meera Kapoor', email: 'meera@example.com', password: hash, role: 'Patient',
      age: 28, gender: 'Female', height: '162', weight: '65',
      specialCondition: 'Gestational Diabetes', assignedDoctor: doc1._id,
      pregnancyWeek: 34, dueDate: dueDate1, isPostPartum: false, children: []
    });

    const p2 = await Patient.create({
      name: 'Sunita Devi', email: 'sunita@example.com', password: hash, role: 'Patient',
      age: 32, gender: 'Female', height: '155', weight: '70',
      specialCondition: 'Pre-eclampsia history', assignedDoctor: doc1._id,
      pregnancyWeek: 42, dueDate: dueDate2, isPostPartum: true,
      children: [{ name: 'Baby Aarav', dob: dueDate2, birthWeight: 2.9, gender: 'Male', notes: 'Healthy delivery', dietPlan: 'Breastfeeding + Vitamin D drops' }]
    });

    const p3 = await Patient.create({
      name: 'Kavita Rao', email: 'kavita@example.com', password: hash, role: 'Patient',
      age: 25, gender: 'Female', height: '160', weight: '58',
      specialCondition: 'None', assignedDoctor: doc2._id,
      pregnancyWeek: 20, dueDate: new Date(Date.now() + 140 * 86400000), isPostPartum: false, children: []
    });

    // Vitals for Meera (prenatal)
    await Vitals.create({ patientId: p1._id, date: new Date(), temperature: 98.4, heartRate: 82, bloodPressure: '110/70', bloodGlucose: 135, oxygenSaturation: 98, fetalHeartRate: 145, weight: 65, hemoglobin: 11.2, notes: 'Routine 34-week checkup' });
    await Vitals.create({ patientId: p1._id, date: new Date(Date.now() - 7 * 86400000), temperature: 98.6, heartRate: 78, bloodPressure: '115/75', bloodGlucose: 142, oxygenSaturation: 97, fetalHeartRate: 148, weight: 64.5, hemoglobin: 11.0, notes: '33-week checkup — glucose slightly elevated' });

    // Vitals for Sunita (postpartum)
    await Vitals.create({ patientId: p2._id, date: new Date(), temperature: 98.8, heartRate: 75, bloodPressure: '120/80', oxygenSaturation: 99, weight: 68, hemoglobin: 10.8, notes: 'Postpartum day 14 — recovery on track' });

    // Vitals for Kavita
    await Vitals.create({ patientId: p3._id, date: new Date(), temperature: 98.2, heartRate: 80, bloodPressure: '108/68', oxygenSaturation: 99, fetalHeartRate: 155, weight: 59, hemoglobin: 12.1, notes: '20-week anatomy scan normal' });

    // Appointments
    const apptDate = new Date();
    apptDate.setDate(apptDate.getDate() + 3);
    await Appointment.create({ doctorId: doc1._id, patientId: p1._id, date: apptDate, notes: 'Routine prenatal visit', agenda: 'Review glucose levels, fetal growth scan, diet plan update' });
    const apptDate2 = new Date();
    apptDate2.setDate(apptDate2.getDate() + 5);
    await Appointment.create({ doctorId: doc1._id, patientId: p2._id, date: apptDate2, notes: 'Postpartum follow-up', agenda: 'Check recovery, breastfeeding support, baby weight check' });

    // Prescriptions
    await Prescription.create({ doctorId: doc1._id, patientId: p1._id, medications: 'Folic Acid 5mg, Iron supplement, Insulin as per sliding scale', reports: 'Glucose tolerance test report attached' });
    await Prescription.create({ doctorId: doc1._id, patientId: p2._id, medications: 'Calcium 500mg, Vitamin D3 1000IU, Paracetamol SOS', reports: 'Postpartum blood work — all within normal limits' });

    console.log('Database seeded successfully for Maternal & Child Care!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
