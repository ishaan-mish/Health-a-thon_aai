import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, default: Date.now },
  medications: { type: String, required: true },
  reports: { type: String } // Doctor can add notes or links to reports here
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
