const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/dispense';
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const studentCard = require('../model/memberbystudentcard');
const idCard = require('../model/memberbyidcard');

router.post('/api/addidcard', async (req, res) => {
    let { firstname, lastname, idcard, dateofbirth } = req.body;
    try {
        const response = await idCard.create({
            firstname,
            lastname,
            idcard,
            dateofbirth
        })
        console.log(response)
    } catch (err) {
        return res.json({ status: 'error', err })
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
            faculty
        })
        console.log(response)
    } catch (err) {
        return res.json({ status: 'error', err })
    }
    return res.json({ status: 'ok' })
})

module.exports = router;