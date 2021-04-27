const express = require('express');
const app = express();


    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    http = require('http'),
    path = require('path');

    app.use(cors());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    app.use('/api', fromBuilderRoute);

    let fromBuilderRoute = require('./app/Routes/formbuilderRoutes');

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

      var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
      var server_host = process.env.YOUR_HOST || '0.0.0.0';
      server.listen(server_port, server_host, function() {
      });      