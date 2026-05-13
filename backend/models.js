import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  userId: String,
  exercises: [{ id: Number, name: String, completed: Boolean, points: Number }],
  totalPoints: Number,
  achievements: [{ name: String, icon: String }],
  dailyProgress: mongoose.Schema.Types.Mixed,
  completedByDate: mongoose.Schema.Types.Mixed,
  waterIntake: mongoose.Schema.Types.Mixed,
  waterIntakeGoal: Number,
  sleepHours: mongoose.Schema.Types.Mixed,
  moodTracker: mongoose.Schema.Types.Mixed,
  quizAnswers: mongoose.Schema.Types.Mixed,
  leaderboardVisible: { type: Boolean, default: true },
});

const healthSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true },
  medicines: [
    {
      id: String,
      name: String,
      purpose: String,
      reminderTime: String,
      timesPerDay: Number,
      times: [String],
      logs: mongoose.Schema.Types.Mixed,
    }
  ]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = mongoose.model('User', userSchema);
export const Feature = mongoose.model('Feature', featureSchema);
export const Health = mongoose.model('Health', healthSchema);