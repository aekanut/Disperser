const express = require('express');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/dispense';
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const studentCard = require('../model/memberbystudentcard');
const idCard = require('../model/memberbyidcard');

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
        return res.json({ status: 'error', error: err })
    }
    return res.json({ status: 'ok' })
})

router.post('/api/addstudentcard', async (req, res) => {
    let { firstname, lastname, studentcard, faculty } = req.body;
    console.log(firstname)
    try {
        const response = await studentCard.create({
            firstname,
            lastname,
            studentcard,
            faculty,
            Date: new Date()
        })
        
    } catch (err) {
        return res.json({ status: 'error', 'error': err })
    }
    return res.json({ status: 'ok' })
})

module.exports = router;