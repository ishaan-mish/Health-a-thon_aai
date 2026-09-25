import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, required: true },
  notes: { type: String },
  agenda: { type: String }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
