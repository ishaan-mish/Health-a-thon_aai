import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  name: { type: String },
  dob: { type: Date },
  birthWeight: { type: Number },
  gender: { type: String },
  notes: { type: String },
  dietPlan: { type: String }
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Patient' },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  specialCondition: { type: String },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  pregnancyWeek: { type: Number },
  dueDate: { type: Date },
  isPostPartum: { type: Boolean, default: false },
  children: [childSchema],
  personalNotes: { type: String }
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
