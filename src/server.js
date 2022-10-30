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

app.get("/trivia", async (req, res) => {
  // fetch the data
  const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple");

  // fail if bad response
  if (!response.ok) {
    res.status(500);
    res.send(`Open Trivia Database failed with HTTP code ${response.status}`);
    return;
  }

  // interpret the body as json
  const content = await response.json();

  // fail if db failed
/*  
  if (data.response_code !== 0) {
    res.status(500);
    res.send(`Open Trivia Database failed with internal response code ${data.response_code}`);
    return;
  }
*/
  // respond to the browser
  // TODO: make proper html
  //res.send(JSON.stringify(content, 2));
  const correctAnswer =content.results[0].correct_answer;
const answers =content.results[0].incorrect_answers.concat(content.results[0].correct_answer);

const answerLinks = answers.map(answer => {
  return `<a href="javascript:alert('${
    answer === correctAnswer ? 'Correct!' : 'Incorrect, Please Try Again!'
    }')">${answer}</a>
  }`
})
  res.render('trivia', {
    category: content.results[0].category || "category",
  question:JSON.stringify(content.results[0].question) || "question",
  correct_answer:content.results[0].correct_answer || "correct_answer",
  incorrect_answers:content.results[0].incorrect_answers || "incorrect_answers",
  answers:content.results[0].incorrect_answers.concat(content.results[0].correct_answer),
  difficulty:content.results[0].difficulty || "difficulty",
  answerLinks:answerLinks||"answerLinks",
})
});

// Start listening for network connections
app.listen(port);

// Printout for readability
console.log("Server Started!");