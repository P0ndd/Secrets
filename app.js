const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require('dotenv').config();

const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jefiljc.mongodb.net/?retryWrites=true&w=majority`);


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "ThisisSecret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/secrets", (req, res) => {
    res.render("secrets");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save();
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
        if (err) console.log(err);
        else {
            if (foundUser) {
                if (foundUser.password === password) res.render("secrets");
            }
        }
    });
});

app.get("/logout", (req, res) => {
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(3000, () => {
    console.log("Server opened on port 3000");
});
