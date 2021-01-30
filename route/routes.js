const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const CookieParser = require('cookie-parser')

router.use(CookieParser())
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

const ifLoggedIn = (req, res, next) => {
    console.log(req.session)
    if (req.session.username) {
        return res.redirect('/main')
    } else {
        next()
    }
}

const ifNotLoggedIn = (req, res, next) => {
    console.log(req.session)
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
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'add', 'addidcard.html'))
})

router.get('/main/student', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'add', 'addstudentcard.html'))
})

router.get('/main/editidcard', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'edit', 'editidcard.html'))
})

router.get('/main/editstudentcard', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'edit', 'editstudent.html'))
})

router.get('/main/deleteidcard', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'delete', 'deleteidcard.html'))
})

router.get('/main/deletestudentcard', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'delete', 'deletestudentcard.html'))
})

router.get('/main/showallidcard', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'mainoption', 'showallidcard.html'))
})

router.get('/main/showallstudentcard', ifNotLoggedIn, async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'static', 'mainoption', 'showallstudentcard.html'))
})

module.exports = router;