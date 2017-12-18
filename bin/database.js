const mongoose = require('mongoose');
const config = require('config');
const Request = require('../models/Request');

const mongoUrl = process.env.MONGO_URL || `mongodb://${config.db.uri}:${config.db.port}/${config.db.name}`;
const db = mongoose.createConnection(mongoUrl);

db.on('error', function(err){
    if(err) throw err;
});

db.once('open', function callback () {
    console.info('Mongo db connected successfully');
});

module.exports = db;