const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// @route   GET /api/appointments
// @desc    Get appointments (patient: own, doctor: their schedule, admin: all)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query;

    if (req.user.role === 'patient') {
      query = Appointment.find({ patient: req.user._id });
    } else if (req.user.role === 'doctor') {
      const Doctor = require('../models/Doctor');
      const doctor = await Doctor.findOne({ user: req.user._id });
      query = Appointment.find({ doctor: doctor?._id });
    } else {
      query = Appointment.find();
    }

    const appointments = await query
      .populate('patient', 'name email phone')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/appointments
// @desc    Book an appointment
// @access  Private (patient)
router.post('/', protect, authorize('patient', 'admin'), async (req, res) => {
  try {
    const { doctor, date, time, reason, notes, type } = req.body;

    // Check for conflicts
    const conflict = await Appointment.findOne({
      doctor,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      time,
      reason,
      notes,
      type,
    });

    const populated = await appointment.populate([
      { path: 'patient', select: 'name email' },
      { path: 'doctor', populate: { path: 'user', select: 'name' } },
    ]);

    res.status(201).json({ success: true, appointment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Patients can only cancel their own
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('patient', 'name email').populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Delete appointment
// @access  Private (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
