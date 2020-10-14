const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

//RouteFiles
const usersRoute = require('./routes/users');
const travelcardRoute = require('./routes/travelcard');
const touristcardRoute = require('./routes/touristcard');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json()); 

const uri = process.env.ATLAS_URI;
mongoose.connect(uri,{useNewUrlParser: true,useCreateIndex : true, useUnifiedTopology: true, useFindAndModify: false });

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log('MongoDB database connected successfully!');
})


//Routes
app.use('/api/users',usersRoute);
app.use('/api/travelcard',travelcardRoute);
app.use('/api/Touristcard',touristcardRoute);


app.listen(port, ()=>{
    console.log(`App is running on ${port}`);
})