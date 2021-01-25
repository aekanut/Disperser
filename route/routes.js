const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/dispense';
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const admin = require('../model/admin');
const studentCard = require('../model/memberbystudentcard');
const idCard = require('../model/memberbyidcard');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'asdfokoasdf48f43847/41*4832585f*8549fr3*12e*t5io96880/90789/5/67i77/68';
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

router.get('/api/allidcard', async (req, res) => {
    try {
        const allIdCard = await idCard.find({}).sort('_id')
        return res.json(allIdCard)
    } catch (err) {
        return res.json({status: 'error'})
    }
})

router.get('/api/allstudentcard', async (req, res) => {
    try {
        const allIdCard = await studentCard.find({})
        
        return res.json(allIdCard)
    } catch (err) {
        return res.json({status: 'error'})
    }
})

router.post('/api/addidcard', async (req, res) => {
    let { firstname, lastname, idcard, dateofbirth } = req.body;
    console.log(firstname,lastname,idcard,dateofbirth)
    try {
        const response = await idCard.create({
            firstname,
            lastname,
            idcard,
            dateofbirth,
            Date: new Date()
        })
        
    } catch (err) {
        return res.json({ status: 'error', have: err })
    }
    return res.json({ status: 'ok' })
})

router.post('/api/addstudentcard', async (req, res) => {
    let { firstname, lastname, studentcard, faculty } = req.body;

    try {
        const response = await studentCard.create({
            firstname,
            lastname,
            studentcard,
            faculty,
            Date: new Date()
        })
        
    } catch (err) {
        return res.json({ status: 'error', have: err })
    }
    return res.json({ status: 'ok' })
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
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            JWT_SECRET
        )

        return res.json({ status: "ok", token: token })
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