  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const app = express();
  const {v4:uuidv4} = require("uuid");
  
  mongoose.connect('mongodb+srv://sasikalam21it:Gd4CeQAoYntoLIBi@cluster0.2tw6imi.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.use(bodyParser.json());
  const cors = require('cors');
  const corsOptions = {
    origin: 'http://localhost:3001', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.use(cors(corsOptions));

  const User = mongoose.model('User', {
    username: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
  });
  
  


  app.post('/signup', async (req, res) => {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
    } = req.body;

    try {
      if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: 'Please fill in all fields' });
      }

      const newUser = new User({
        username,
        email,
        password, 
        firstName,
        lastName,
      });

      await newUser.save();
      res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  /*app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }

  });*/
  /*app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });*/
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      if (password !== user.password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
        expiresIn: '1h',
      });

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  const Billing = mongoose.model('Billing', {
    name: String,
    email: String,
    phonenumber: String,
    street: String,
    city: String,
    pincode: String,
    country: String,
   
  });

  app.post('/submit-billing', async (req, res) => {
    const {
      name,
      email,
      phonenumber,
      street,
      city,
      pincode,
      country,
      
    } = req.body;

    try {
      const billing = new Billing({
        name,
        email,
        phonenumber,
        street,
        city,
        pincode,
        country,
        
      });

      await billing.save();
      res.status(201).json({ message: 'Billing data saved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.get('/getprofile', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'your-secret-key');
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  });
 
  app.post("/Payment",(req,res)=>{
    const{product,token} = req.body;
     const transactionKey = uuidv4();
     return stripe.customer.create({
      email:token.email,
      source:token.id
     }).then((customer)=>{
      stripe.charges.create({
        amount:product.price,
        currency:"INR",
        customer:customer.id,
        receipt_email:token.email,
        description:product.name
      })
      .then((result)=>{
        res.json(result);
      })
      .catch((err)=>{
        console.log(err);
      });
     });
    
  });
  const Review = mongoose.model('Review', {
    name: String, 
   
    text: String,
    msg:String,
  });
  app.post('/submit-review', async (req, res) => {
    const { name,  text, msg } = req.body;
  
    try {
      const review = new Review({
    
        name,
        text,
        msg,
      });
  
      await review.save();
      res.status(201).json({ message: 'Review submitted ' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  app.get('/', (req, res) => {
    
  });
  app.get('/Lhome', (req, res) => {
    
  });

  app.get('/login', (req, res) => {
  
  });
  app.get('/signup', (req, res) => {

  });
  app.get('/shop', (req, res) => {
  
  });

  app.get('/blog', (req, res) => {
    
  });
  app.get('/cart', (req, res) => {
  
  });
  app.get('/Lshop', (req, res) => {
    
  });

  app.get('/Lblog', (req, res) => {
   
  });
  app.get('/Lcart', (req, res) => {
   
  });
  app.get('/profile', (req, res) => {
    
  });
  app.get('/checkout',(req,res)=>{

  });
  app.get('/Payment',(req,res)=>{

  });
  




  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
