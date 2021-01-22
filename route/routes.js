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

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'login.html'))
})

router.get('/data', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'data.html'))
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
        return res.json({ status: "ok", token: token })
    }

    return res.json({ status: "error", data: 'invalid username or password' });
})

router.post('/api/token', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.json({ status: 'error', error: 'no token' });
    }

    try {
        let user = jwt.verify(token, JWT_SECRET);
        //console.log(user);
        return res.json({ status: 'ok', user: user.user });
    } catch(err) {
        return res.json({ status: 'error', error: 'wrong token' });
    }
})




module.exports = router;