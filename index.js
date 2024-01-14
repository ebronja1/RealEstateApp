const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = require('./routes.js'); 
const db = require('./db.js');



const app = express();
//
app.use(express.static('./public'));
app.use(express.static('./public/HTML'));
app.use(express.static('./public/CSS'));
app.use(express.static('./public/scripts'));
app.use(express.static('./public/CSS'));

// Using middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key', 
    resave: true,
    saveUninitialized: true,
  })
);

// Use the router
app.use('/', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
