const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 5000; // Change the port as needed
const SECRET_KEY = 'your-secret-key'; // Secret key for JWT

// Connect to MongoDB (Make sure you have MongoDB installed and running)
mongoose.connect('mongodb+srv://sasikalam21it:Gd4CeQAoYntoLIBi@cluster0.2tw6imi.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// Create a user schema and model (assuming you have a 'User' collection in your MongoDB)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// CORS headers (you may need to adjust this based on your needs)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Serve your static frontend files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate a JWT token and send it in the response
  const token = jwt.sign({ username: user.username }, SECRET_KEY, {
    expiresIn: '1h', // Token expiration time
  });

  res.status(200).json({ token });
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  // Check if the username or email is already registered
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    return res.status(400).json({ message: 'Username or email is already in use' });
  }

  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Registration Successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});

// ... (previous code)

// Create a billing schema and model
const billingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    streetAddress: String,
    city: String,
    postalCode: String,
    country: String,
  });
  
  const Billing = mongoose.model('Billing', billingSchema);
  
  // Endpoint for submitting billing information
  app.post('/submit-billing', async (req, res) => {
    const formData = req.body;
  
    // Create a new Billing document in the database
    const newBilling = new Billing(formData);
  
    try {
      await newBilling.save();
      res.status(201).json({ message: 'Billing Information Saved Successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while saving billing information' });
    }
  });
  
  // Endpoint for submitting reviews
  app.post('/submit-review', (req, res) => {
    const formData = req.body;
  
    // Here, you can save the review data to a database or perform any other necessary actions.
    // In this example, we'll simply log the review data.
    console.log(formData);
  
    res.status(201).json({ message: 'Review Submitted!' });
  });
  
  // ... (rest of the code)
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
