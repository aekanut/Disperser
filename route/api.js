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

router.post('/oneidcard', async (req, res) => {
    try {
        let { idcard } = req.body;
        console.log(idcard)
        const thisIdCard = await idCard.find({idcard}).sort('_id')
        console.log(thisIdCard)
        return res.json(thisIdCard)
    } catch (err) {
        return res.json({status: 'error'})
    }
})

router.post('/addidcard', async (req, res) => {
    let { firstname, lastname, idcard, dateofbirth } = req.body;
    const DATE = new Date();
    let sec; 
    if (DATE.getSeconds() < 10) {
        sec = 0 + DATE.getSeconds().toString()
    } else {
        sec = DATE.getSeconds()
    }
    let date = `Date: ${DATE.getDate()}-${DATE.getMonth()+1}-${DATE.getFullYear()} Time: ${DATE.getHours()}:${DATE.getMinutes()}:${sec}`
    try {
        const response = await idCard.create({
            firstname,
            lastname,
            idcard,
            dateofbirth,
            Date: date
        })
        
    } catch (err) {
        console.log(err.error)
        return res.json({ status: 'error', error: err })
    }
    return res.json({ status: 'ok' })
})

router.post('/addstudentcard', async (req, res) => {
    let { firstname, lastname, studentcard, faculty } = req.body;
    const DATE = new Date();
    let sec;
    if (DATE.getSeconds() < 10) {
        let sec = 0 + DATE.getSeconds().toString()
    } else {
        let sec = DATE.getSeconds()
    }
    let date = `Date: ${DATE.getDate()}-${DATE.getMonth()+1}-${DATE.getFullYear()} Time: ${DATE.getHours()}:${DATE.getMinutes()}:${sec}`
    try {
        const response = await studentCard.create({
            firstname,
            lastname,
            studentcard,
            faculty,
            Date: date
        })
        
    } catch (err) {
        return res.json({ status: 'error', error: err })
    }
    return res.json({ status: 'ok' })
})

router.post('/deletestudentcard', async (req, res) => {
    let { studentcard } = req.body;

    try {
        await studentCard.deleteOne({ studentcard })
    } catch (err) {
        return res.json({ status: 'error', error: err })
    }
    return res.json({ status: 'ok' })
})

router.post('/deleteidcard', async (req, res) => {
    let { idcard } = req.body;
    
    try {
        const user = await idCard.deleteOne({ idcard })
        console.log(user)
        if (!user.n){
            return res.json({ status: 'error'})
        }
    } catch (err) {
        return res.json({ status: 'error', error: err })
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
        return res.json({ status: "error", error: err })
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
        return res.json({ status: "error", error: err })
    }
    return res.json({ status: 'ok' })
})

module.exports = router;