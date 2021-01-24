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

let currentToken;

const ifNotLogin = (req, res, next) => {
    if (!currentToken) {
        next()
    } else {
        res.redirect('/main')
    }
}

const ifLogin = (req, res, next) => {
    if (!currentToken) {
        res.redirect('/')
    } else {
        next()
    }
}

router.get('/', ifNotLogin, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'login.html'))
})

router.get('/main', ifLogin, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'main.html'))
})

router.get('/main/idcard', ifLogin, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'idCard.html'))
})

router.get('/main/student', ifLogin, async (req, res) => {
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
        currentToken = token
        return res.json({ status: "ok", token: token })
    }

    return res.json({ status: "error", data: 'invalid username or password' });
})

router.post('/api/logout', (req, res) => {
    currentToken = null;
    return res.json({ status: "ok" })
})

module.exports = router;