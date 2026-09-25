import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, required: true },
  temperature: { type: Number },
  heartRate: { type: Number },
  pulseRate: { type: Number },
  bloodPressure: { type: String },
  bloodGlucose: { type: Number },
  ecg: { type: String },
  eeg: { type: String },
  oxygenSaturation: { type: Number },
  respiratoryRate: { type: Number },
  fetalHeartRate: { type: Number },
  contractionFrequency: { type: String },
  weight: { type: Number },
  bloodGroup: { type: String },
  hemoglobin: { type: Number },
  urineProtein: { type: String },
  notes: { type: String }
});

const Vitals = mongoose.model('Vitals', vitalsSchema);
export default Vitals;
