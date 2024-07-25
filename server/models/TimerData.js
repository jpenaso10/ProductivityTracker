import mongoose from 'mongoose';

const timerDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Production', 'Meeting', 'Coaching', 'Lunch', 'Break', 'Unavailable']
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true
  }
});

export const TimerData = mongoose.model('TimerData', timerDataSchema);