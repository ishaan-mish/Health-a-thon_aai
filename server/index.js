import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './Routes/auth.js';
import Doctor from './models/Doctor.js';
import Patient from './models/Patient.js';
import Vitals from './models/Vitals.js';
import Appointment from './models/Appointment.js';
import Prescription from './models/Prescription.js';

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in .env file');
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => { console.error('MongoDB Connection Error:', err); process.exit(1); });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/auth', authRoutes);

// Doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, 'name email _id');
    res.json(doctors);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// All Patients
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find().populate('assignedDoctor', 'name');
    res.json(patients);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// Single Patient by email
app.get('/api/patient/:email', async (req, res) => {
  try {
    const patient = await Patient.findOne({ email: req.params.email }).populate('assignedDoctor', 'name');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// Update patient (for postpartum toggle, child details, personal notes)
app.patch('/api/patient/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) { res.status(500).json({ message: 'Server error updating patient' }); }
});

// Add child to patient
app.post('/api/patient/:id/child', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    patient.children.push(req.body);
    await patient.save();
    res.status(201).json({ message: 'Child added', patient });
  } catch (error) { res.status(500).json({ message: 'Server error adding child' }); }
});

// Update child diet plan
app.patch('/api/patient/:id/child/:childIndex', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    const idx = parseInt(req.params.childIndex);
    if (!patient.children[idx]) return res.status(404).json({ message: 'Child not found' });
    Object.assign(patient.children[idx], req.body);
    await patient.save();
    res.json({ message: 'Child updated', patient });
  } catch (error) { res.status(500).json({ message: 'Server error updating child' }); }
});

// Vitals
app.get('/api/vitals/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(patientId)) return res.status(400).json({ message: 'Invalid patient ID' });
    const vitals = await Vitals.find({ patientId }).sort({ date: -1 });
    res.json(vitals);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

app.post('/api/vitals', async (req, res) => {
  try {
    const { patientId, date, temperature, heartRate, pulseRate, bloodPressure, bloodGlucose, ecg, eeg, oxygenSaturation, respiratoryRate, fetalHeartRate, contractionFrequency, weight, bloodGroup, hemoglobin, urineProtein, notes } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patientId)) return res.status(400).json({ message: 'Invalid patient ID' });
    const newVital = new Vitals({
      patientId, date: date ? new Date(date) : new Date(),
      temperature, heartRate, pulseRate, bloodPressure, bloodGlucose, ecg, eeg, oxygenSaturation, respiratoryRate, fetalHeartRate, contractionFrequency, weight, bloodGroup, hemoglobin, urineProtein, notes
    });
    await newVital.save();
    res.status(201).json({ message: 'Vitals recorded', vital: newVital });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// Appointments
app.get('/api/appointments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ $or: [{ doctorId: userId }, { patientId: userId }] })
      .populate('doctorId', 'name')
      .populate('patientId', 'name')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { doctorId, patientId, date, notes, agenda } = req.body;
    const appointment = new Appointment({ doctorId, patientId, date, notes, agenda });
    await appointment.save();
    res.status(201).json({ message: 'Appointment scheduled', appointment });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

// Prescriptions
app.get('/api/prescriptions/:patientId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name')
      .sort({ date: -1 });
    res.json(prescriptions);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

app.post('/api/prescriptions', async (req, res) => {
  try {
    const { doctorId, patientId, medications, reports } = req.body;
    const prescription = new Prescription({ doctorId, patientId, medications, reports });
    await prescription.save();
    res.status(201).json({ message: 'Prescription added', prescription });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

app.use((req, res) => { res.status(404).json({ message: 'Route not found' }); });

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
