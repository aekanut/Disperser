const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const URI = 'mongodb://localhost:27017/dispense';
const URI = 'mongodb+srv://root:root@cluster0.jk4w7.mongodb.net/dispense'
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).
    catch(error => handleError(error));
const admin = require('../model/admin');
const bcrypt = require('bcrypt');
const session = require('express-session');
const CookieParser = require('cookie-parser')

router.use(CookieParser())
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.username) {
        next()
    } else {
        res.status(401);
        return res.send("Don't hack please")
    }
}

const ifLoggedIn = (req, res, next) => {
    if (req.session.username) {
        next()
    } else {
        res.status(401);
        return res.send("Don't hack please")
    }
}
router.post('/register', async (req, res) => {
    const { username, password: pass } = req.body;
    console.log(username, pass)
    const password = await bcrypt.hash(pass, 10);
    try {
        const response = await admin.create({
            username,
            password
        }, (err, data) => {
            if (err) return console.log(err)
            console.log(data)
        })
        console.log('success :', response);
    } catch (err) {
        res.json({ status: 'error' });
    }
    res.json({ status: 'ok' });
})

router.post('/login', ifNotLoggedIn, async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await admin.findOne({ username }).lean();
        let sess = req.session
        sess.username = user.username
        sess._id = user._id
        if (await bcrypt.compare(password, user.password)) {
            return res.json({ status: "ok" })
        }
    } catch (err) {
        return res.json({ status: "error", data: 'invalid username or password' });
    }
})

router.post('/logout', ifLoggedIn, (req, res) => {
    let sess = req.session
    sess.username = null
    sess._id = null
    return res.json({ status: "ok" })
})

module.exports = router;