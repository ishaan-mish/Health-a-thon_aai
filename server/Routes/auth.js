import express from 'express';
import bcrypt from 'bcryptjs';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

const router = express.Router();

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    const patient = await Patient.findOne({ email });
    if (!doctor && !patient) return res.status(401).json({ message: 'Invalid credentials' });
    const user = doctor || patient;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });
    return res.status(200).json({ message: 'Login successful', user: { _id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password, role, age, gender, height, weight, specialCondition, assignedDoctor, pregnancyWeek, dueDate } = req.body;
  try {
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Name, email, password, and role are required' });
    if (role === 'Patient' && (!age || !gender || !height || !weight)) return res.status(400).json({ message: 'All maternal details are required' });
    const existingUser = await Doctor.findOne({ email }) || await Patient.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (role === 'Doctor') {
      const doctor = new Doctor({ name, email, password: hashedPassword, role });
      await doctor.save();
      return res.status(201).json({ message: 'Obstetrician registered successfully', id: doctor._id });
    } else if (role === 'Patient') {
      if (!assignedDoctor) return res.status(400).json({ message: 'Assigned obstetrician is required' });
      const doctorExists = await Doctor.findById(assignedDoctor);
      if (!doctorExists) return res.status(404).json({ message: 'Assigned obstetrician not found' });
      const patient = new Patient({ name, email, password: hashedPassword, role, age, gender, height, weight, specialCondition, assignedDoctor, pregnancyWeek: pregnancyWeek || null, dueDate: dueDate || null });
      await patient.save();
      return res.status(201).json({ message: 'Mother registered successfully', id: patient._id });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
