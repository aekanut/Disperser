const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const URI = 'mongodb://localhost:27017/dispense';
const URI = 'mongodb+srv://root:root@cluster0.jk4w7.mongodb.net/dispense'
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).
    catch(error => handleError(error));
const studentCard = require('../model/memberbystudentcard');
const idCard = require('../model/memberbyidcard');
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
        res.status(401);
        return res.send("Don't hack please")
    } else {
        next()
    }
}

router.get('/allidcard', ifNotLoggedIn, async (req, res) => {
    try {
        const allIdCard = await idCard.find({}).sort('_id')
        return res.json(allIdCard)
    } catch (err) {
        return res.json({ status: 'error' })
    }
})

router.get('/allstudentcard', ifNotLoggedIn, async (req, res) => {
    try {
        const allIdCard = await studentCard.find({})
        return res.json(allIdCard)
    } catch (err) {
        return res.json({ status: 'error' })
    }
})

router.post('/oneidcard', ifNotLoggedIn, async (req, res) => {
    try {
        let { idcard } = req.body;
        console.log(idcard)
        const thisIdCard = await idCard.find({ idcard }).sort('_id')
        console.log(thisIdCard)
        return res.json(thisIdCard)
    } catch (err) {
        return res.json({ status: 'error' })
    }
})

router.post('/addidcard', ifNotLoggedIn, async (req, res) => {
    let { firstname, lastname, idcard, dateofbirth } = req.body;
    const DATE = new Date();
    let sec;
    if (DATE.getSeconds() < 10) {
        sec = 0 + DATE.getSeconds().toString()
    } else {
        sec = DATE.getSeconds()
    }
    let date = `Date: ${DATE.getDate()}-${DATE.getMonth() + 1}-${DATE.getFullYear()} Time: ${DATE.getHours()}:${DATE.getMinutes()}:${sec}`
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

router.post('/addstudentcard', ifNotLoggedIn, async (req, res) => {
    let { firstname, lastname, studentcard, faculty } = req.body;
    const DATE = new Date();
    let sec;
    if (DATE.getSeconds() < 10) {
        sec = 0 + DATE.getSeconds().toString()
    } else {
        sec = DATE.getSeconds()
    }
    let date = `Date: ${DATE.getDate()}-${DATE.getMonth() + 1}-${DATE.getFullYear()} Time: ${DATE.getHours()}:${DATE.getMinutes()}:${sec}`
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

router.post('/deletestudentcard', ifNotLoggedIn, async (req, res) => {
    let { studentcard } = req.body;
    try {
        const user = await studentCard.deleteOne({ studentcard })
        if (!user.n) return res.json({ status: 'error'})
    } catch (err) {
        return res.json({ status: 'error', error: err })
    }
    return res.json({ status: 'ok' })
})

router.post('/deleteidcard', ifNotLoggedIn, async (req, res) => {
    let { idcard } = req.body;
    try {
        const user = await idCard.deleteOne({ idcard })
        if (!user.n) return res.json({ status: 'error'})
    } catch (err) {
        return res.json({ status: 'error', error: err })
    }
    return res.json({ status: 'ok' })
})

router.put('/editstudentcard', ifNotLoggedIn, async (req, res) => {
    let { studentcard, update } = req.body;
    try {
        const user = await studentCard.findOneAndUpdate(
            { studentcard },
            update
        )
        console.log(user)
        return res.json({ status: 'ok', data: user })
    } catch (err) {
        return res.json({ status: "error", error: err })
    }

})

router.put('/editidcard', ifNotLoggedIn, async (req, res) => {
    let { idcard, update } = req.body;
    try {
        const user = await idCard.findOneAndUpdate(
            { idcard },
            update
        )
        return res.json({ status: 'ok', data: user })

    } catch (err) {
        return res.json({ status: "error", error: err })
    }
})

module.exports = router;