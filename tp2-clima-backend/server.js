const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());

console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Connection error:', error));

const searchSchema = new mongoose.Schema({
  city: String,
  country: String,
  temp: String,
  condition: String,
  icon: String,
  conditionText: String,
  date: { type: Date, default: Date.now },
}, { collection: 'historial' });

const Search = mongoose.model('Search', searchSchema);

app.post('/api/search', async (req, res) => {
  try {
    const { city, country, temp, condition, icon, conditionText } = req.body;
    const newSearch = new Search({
      city,
      country,
      temp,
      condition,
      icon,
      conditionText,
    });
    const savedSearch = await newSearch.save();
    res.status(201).json(savedSearch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/searches', async (req, res) => {
  try {
    const searches = await Search.find().sort({ date: -1 });
    res.status(200).json(searches);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
