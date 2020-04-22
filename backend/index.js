const bodyParser = require ('body-parser');
const express = require('express');
const app = express();
const allowCors= require('./config/cors');

const user = require('./routes/usuario')
const is_friend = require('./routes/is_friend');
const asked_as_friend = require('./routes/asked_as_friend');
const depoimento = require('./routes/depoimento');
const groups = require ( './routes/groups');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(allowCors);

app.use('/API/user', user);
app.use('/API/is_friend', is_friend);
app.use('/API/asked_as_friend', asked_as_friend);
app.use('/API/depoimento',depoimento);
app.use('/API/groups',groups);



app.listen(3003, function(){
    console.log(`BACKEND is running on port ${3003}.`)
});
  