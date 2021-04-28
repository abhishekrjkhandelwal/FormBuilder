const express = require('express');
let formBuilderRoute = require('./app/Routes/formbuilderRoutes');
const mongoose  = require('mongoose');

const app = express();

    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    http = require('http'),
    path = require('path');

    app.use(cors());

    const password = encodeURIComponent('abhishek');;

    mongoose.connect(`mongodb+srv://formbuilder:${password}@cluster0.hosyj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true  
    }).then(() => {
      console.log('Conntected to database!');
    })
    .catch(() => {
      console.log('Connection failed');
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use('/api', formBuilderRoute);

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept"
        );
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        );
        next();
      });

//server listens to port 3000 
app.listen(3000, (err)=>{ 
  if(err) 
  throw err; 
  }); 