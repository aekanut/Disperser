const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = require('./route/routes')
const api = require('./route/api')

const PORT = 3000;

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use("/", router);

app.use("/api", api);

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
})