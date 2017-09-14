const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./models/index');
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const userRoutes = require('./routes/user');
const applicationRoutes = require('./routes/application');
const domainRoutes = require('./routes/domain');
const privateDomainRoutes = require('./routes/privateDomains')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use('/users', userRoutes);
app.use('/users/:user_id/applications', applicationRoutes);
app.use('/domains', domainRoutes);
app.use('/users/:user_id/privateDomains', privateDomainRoutes);

console.log('RESTful API server for SoundHound started on: ' + port);

app.listen(port);
module.exports = app;
