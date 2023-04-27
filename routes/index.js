var express = require('express');
var router = express.Router();

const User = require("../models/userSchema");
// const Uber = require("../models/userSchema");
const nodemailer = require("nodemailer");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home page' });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

/* GET signin page. */
router.get('/signin', function(req, res, next) {
  res.render('signin');
});

/* GET signout page. */
router.get('/signout', function(req, res, next) {
  res.redirect('/signin');
});

/* GET profile page. */
router.get('/profile/:id',async function(req, res, next) {
  const user = await User.findById(req.params.id);
   res.render('profile', { title: 'Profile', user });
});

/* GET forgetpassword page. */
router.get('/forgetpassword', function(req, res, next) {
  res.render('forget', {title: "forget password"});
});

/* post signin page. */
router.post('/usersignin',async function(req, res, next) {
  try{
  const user = await User.findOne({username: req.body.username});
  if (!user) return res.send("user not found.");
  const matchPassword = user.password === req.body.password;
  if (!matchPassword)return res.send("wrong credientials");
  // user.password = undefined;
  // Uber.create(req.body)
  // res.json(user);
  res.redirect("/profile/" + user._id);
}catch(error){
  res.send(err);
} 

  // res.json(req.body);
});

/* GET signup page. */
router.post('/usersignup',async function(req, res, next) {

  const user = await User.findOne({username: req.body.username});
  if (user) return res.send("user already exists.");
  User.create(req.body)
  .then(()=> {
    res.redirect("/signin");
  })
  .catch((err)=>{
    res.send(err)
  });
  // res.json(req.body);
});

// post update/:id page
router.post("/updateuser/:id", function(req,res,next){
   User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/signin");
});

// post send-mail page
router.post("/send-mail", async function (req,res,next){
  const user = await User.findOne({email: req.body.email});
  if (!user) return res.send("user not found");

  const code = Math.floor(Math.random() * 9000 + 1000);






  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "patidardharmendra1994@gmail.com",
        pass: "bzfsikasilfvkmic",
    },
});

const mailOptions = {
    from: "Dharmendra temp Pvt. Ltd.<dharmendratemp@gmail.com>",
    to: req.body.email,
    subject: "Password Reset Link",
    text: "Do not share this link to anyone.",
    html: `<p>Do not share this code to anyone.</p><h1>${code}</h1>`,
};

transport.sendMail(mailOptions,async (err, info) => {
    if (err) return res.send(err);
    console.log(info);

    await User.findByIdAndUpdate(user._id, { code });
    // user.passwordResetToken = 1;
    // user.save();
    // return res.send(
        // "<h1 style='text-align:center;color: tomato; margin-top:10%'><span style='font-size:60px;'>✔️</span> <br />Email Sent! Check your inbox , <br/>check spam in case not found in inbox.</h1>"
    // );
    res.redirect("/code/" + user._id);
});
});

/* GET code/id page. */
router.get("/code/:id",async function(req, res, next) {
  res.render("getcode", {title: "code", id: req.params.id});
});

// post code/id page
router.post("/code/:id",async function (req, res, next){
  const user = await User.findById(req.params.id);
  if (user.code == req.body.code) {
    await User.findByIdAndUpdate(user._id, { code: ""});
    res.redirect("/forgetpassword/" + user._id);
  }else {
    res.send("invalid code.");
  }
});

// get forgetpassword page.
router.get("/forgetpassword/:id", async function(req,res,next){
  res.render("getpassword", { title: "forget password", id: req.params.id})
});

// post forgetpassword page
router.post("/forgetpassword/:id", async function (req ,res ,next){
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/signin");
});

/* GET reset page. */
router.get("/resetpassword/:id",function(req, res, next) {
  res.render("reset", {id: req.params.id});
});

/* GET delete account page. */
router.get("/deleteaccount/:id", async function(req, res, next) {
  const user = await User.findOneAndDelete(req.params.id)
  res.redirect("/signin");
});

// post reset password page
router.post("/reset/:id",async function(req,res,next){
  try{
    const user = await User.findById(req.params.id);
  const matchPassword = user.password === req.body.password;
  if (!matchPassword)return res.send("wrong credientials");
  // console.log(user,req.body)
  const usr = await User.findByIdAndUpdate(req.params.id ,{password:req.body.newpassword});
    await usr.save()
    res.redirect(`/profile/${user._id}`);
  }catch(error){
    res.send(err);
  } 
  
});







module.exports = router;
