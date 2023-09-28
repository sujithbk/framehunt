const express = require("express")
const app = express()
const dotenv = require('dotenv')
const path = require('path')
const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken')



app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '../Frontend')))
app.use(express.static('../Frontend/css'))


dotenv.config({path:'./config/config.env'});



const users = []
   



app.get('/', (req, res) => {
    res.sendFile( path.join(__dirname,'../Frontend/signup.html'));
});

app.post('/',  (req, res) => {
    // console.log(req.body," true" , req);
    const { username , email, password } = req.body;
    console.log(username, email, password);
        const newuser = {
            username : req.body.username,
            password : req.body.password,
            email : req.body.email,
        }
        users.push(newuser);
        console.log(users);
        res.status(200).redirect('/login.html'); 
});

app.get('/login.html', (req, res ) => {
    res.sendFile(path.join(__dirname, '../Frontend/login.html'));
} );

app.post('/login', (req, res) => {
    console.log(req.body);
    const loginuser = {
        username : req.body.username,
        password : req.body.password,
    }

    const user = users.find((data) => loginuser.username === data.username  && loginuser.password  === data.password );
    if(user) {
        console.log('VALID USER');
        const data = {
            username:loginuser.username,
            date:Date(),
        };

        const token = jwt.sign(data, process.env.JWT_SECRET_KEY, ({expiresIn:'1h'}));
        // console.log(token);
        res.cookie('token', token).redirect('index.html');
    } else {
        res.sendFile(path.join(__dirname,'../Frontend/notAUser.html'))
        console.log('INVALID USER');
    }
})
app.get('/index.html', (req, res) => {
    res.redirect(path.join(__dirname,'../Frontend/index.html'));
});




app.listen(process.env.PORT,()=>{
    console.log(`sever is running${process.env.PORT}`)
});