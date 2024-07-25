import mongoose from 'mongoose';

const timerDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timers: {
    Production: { type: Number, default: 0 },
    Meeting: { type: Number, default: 0 },
    Coaching: { type: Number, default: 0 },
    Lunch: { type: Number, default: 0 },
    Break: { type: Number, default: 0 },
    Unavailable: { type: Number, default: 0 }
  },
  currentStatus: { type: String, default: 'Unavailable' },
  updatedAt: { type: Date, default: Date.now }
});

export const TimerData = mongoose.model('TimerData', timerDataSchema);