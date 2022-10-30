const cookieParser = require('cookie-parser');
// use the express library
const express = require('express');
const session = require('express-session')
const fetch = require('node-fetch');
// create a new server application
const app = express();
app.use(cookieParser());
app.use(express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');
// Define the port we will listen on
// (it will attempt to read an environment global
// first, that is for when this is used on the real
// world wide web).
const port = process.env.PORT || 3000;
let nextVisitorId = 1;
app.use(session({secret: "Shh, its a secret!",
resave: false,
  saveUninitialized: false,
}));

app.get("/trivia", (req, res) => {
  res.send('TODO');
});
// The main page of our website
app.get('/', (req, res) => {
  if(req.session.page_views){
    req.session.page_views++;
    req.session.mesg="It has been "+Math.round(new Date().getTime() / 1000-req.cookies.visitedsec)+" seconds since your last visit.";
 } else {
    req.session.page_views = 1;
    req.session.mesg="You have never visited this page.";
    res.cookie('visitorId', nextVisitorId++);
 }
  res.cookie('visitedsec', new Date().getTime() / 1000);
  res.cookie('visited', Date.now().toString());
  res.render('welcome', {
    name: req.query.name || "World",
    date: new Date().toLocaleString() || "Today's date",
    visit: req.cookies.visitorId || "xxx",
    message: req.session.mesg || "Error",
  });
});


// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");