const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/dispense';
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
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

const ifLoggedIn = (req, res, next) => {
    if (req.session.username) {
        return res.redirect('/main')
    } else {
        next()
    }
}

const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.username) {
        return res.redirect('/')
    } else {
        next()
    }
}

router.get('/', ifLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'login.html'))
})

router.get('/main', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'main.html'))
})

router.get('/main/idcard', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'idCard.html'))
})

router.get('/main/student', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'student.html'))
})

router.post('/api/register', async (req, res) => {
    const { username, password: pass } = req.body;
    const password = await bcrypt.hash(pass, 10);
    try {
        const response = await admin.create({
            username,
            password
        })
        console.log('success :', response);
    } catch (err) {
        res.json({ status: 'error' });
    }
    res.json({ status: 'ok' });
})

router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await admin.findOne({ username }).lean();
    let sess = req.session
    sess.username = user.username
    sess._id = user._id
    if (!user) {
        return res.json({ status: "error", data: "invalid username or password" });
    }

    if (await bcrypt.compare(password, user.password)) {
        return res.json({ status: "ok" })
    }

    return res.json({ status: "error", data: 'invalid username or password' });
})

router.post('/api/logout', (req, res) => {
    let sess = req.session
    sess.username = null
    sess._id = null
    return res.json({ status: "ok" })
})

module.exports = router;