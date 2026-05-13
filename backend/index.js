import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { User, Feature, Health } from './models.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(express.json());

mongoose.connect('mongodb+srv://kartik_18:cibBipm3Q4en8hyt@thekartikkaushal.hvf9hgn.mongodb.net/fitness?appName=theKartikKaushal');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/api/feature/:userId', async (req, res) => {
  try {
    const feature = await Feature.findOne({ userId: req.params.userId });
    res.json(feature || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/feature/:userId', async (req, res) => {
  try {
    let feature = await Feature.findOne({ userId: req.params.userId });
    if (feature) {
      await Feature.findOneAndUpdate(
        { userId: req.params.userId },
        { $set: req.body },
        { new: true }
      );
      feature = await Feature.findOne({ userId: req.params.userId });
    } else {
      feature = new Feature({
        userId: req.params.userId,
        leaderboardVisible: true,
        ...req.body
      });
      await feature.save();
    }
    res.json(feature);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/health/:userId', async (req, res) => {
  try {
    const health = await Health.findOne({ userId: req.params.userId });
    res.json(health || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/health/:userId', async (req, res) => {
  try {
    let health = await Health.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: { medicines: req.body.medicines } },
      { new: true, upsert: true }
    );
    res.json(health);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ name: username });
  if (user) {
    if (user.password === password) {
      res.status(200).send({ msg: 'user exists and password is correct' });
    } else {
      res.status(401).send({ msg: 'user exists but password is incorrect' });
    }
  } else {
    res.status(404).send({ msg: 'user does not exist' });
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ name: username });
  if (user) {
    res.status(409).send({ msg: 'user already exists' });
  } else {
    await User.create({
      name: username,
      password: password,
    });
    res.status(201).send({ msg: 'user created' });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const allUsers = await Feature.find({ leaderboardVisible: { $ne: false } });
    const board = allUsers
      .filter(u => u.totalPoints > 0)
      .map(u => ({ username: u.userId, points: u.totalPoints }))
      .sort((a, b) => b.points - a.points);
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/leaderboard/:userId', async (req, res) => {
  try {
    const { visible } = req.body;
    await Feature.findOneAndUpdate(
      { userId: req.params.userId },
      { leaderboardVisible: visible },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});