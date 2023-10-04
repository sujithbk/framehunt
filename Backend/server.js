const express = require("express");
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(cookieParser());

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.Mongoodb_Url , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(error => console.log(`Database NOT-Connected ${error.message}`));

const postSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const Post = mongoose.model('posts', postSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/signup.html'));
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newPost = new Post({
      username: username,
      email: email,
      password: password
    });

    await newPost.save();
 
    console.log('User registered:', newPost);
    res.status(200).redirect('/login.html');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error during registration');
  }
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/login.html'));
});

app.post('/login', async (req, res) => {
  const loginuser = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const user = await Post.findOne(loginuser);

    if (user) {
      console.log('VALID USER');
      const data = {
        username: loginuser.username,
        date: Date(),
      };

      const token = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
      res.cookie('token', token).redirect('index.html');
    } else {
      res.sendFile(path.join(__dirname, '../Frontend/notAUser.html'));
      console.log('INVALID USER');
    }
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).send('Error during login');
  }
});

app.get('/index.html', (req, res) => {
  res.redirect(path.join(__dirname, '../Frontend/index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
