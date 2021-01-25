const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/dispense';
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const studentCard = require('../model/memberbystudentcard');
const idCard = require('../model/memberbyidcard');

router.get('/allidcard', async (req, res) => {
    try {
        const allIdCard = await idCard.find({}).sort('_id')
        return res.json(allIdCard)
    } catch (err) {
        return res.json({status: 'error'})
    }
})

router.get('/allstudentcard', async (req, res) => {
    try {
        const allIdCard = await studentCard.find({})
        
        return res.json(allIdCard)
    } catch (err) {
        return res.json({status: 'error'})
    }
})

router.post('/addidcard', async (req, res) => {
    let { firstname, lastname, idcard, dateofbirth } = req.body;
    
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

router.post('/addstudentcard', async (req, res) => {
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

router.post('/deletestudentcard', async (req, res) => {
    let { studentcard } = req.body;

    try {
        await studentCard.deleteOne({ studentcard })
    } catch (err) {
        return res.json({ status: 'error', have: err })
    }
    return res.json({ status: 'ok' })
})

router.post('/deleteidcard', async (req, res) => {
    let { idcard } = req.body;
    
    try {
        await idCard.deleteOne({ idcard })
        
    } catch (err) {
        return res.json({ status: 'error', have: err })
    }
    return res.json({ status: 'ok' })
})

router.put('/editstudentcard', async (req, res) => {
    let { studentcard, update } = req.body;
    try {
        const user = await studentCard.findOneAndUpdate(
            { studentcard },
            update
        )
        console.log(user)
        } catch (err) {
        return res.json({ status: err })
    }
    return res.json({ status: 'ok' })
})

router.put('/editidcard', async (req, res) => {
    let { idcard, update } = req.body;
    try {
        const user = await idCard.findOneAndUpdate(
            { idcard },
            update
        )
        console.log(user)
        } catch (err) {
        return res.json({ status: err })
    }
    return res.json({ status: 'ok' })
})

module.exports = router;