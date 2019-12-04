const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// Middleware

// Custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next(); // allows the next middleware or route handler to be ran
}

function gateKeeper(req, res, next) {
  console.log('Gatekeeper check!');
  next();
}

// Write a gatekeeper middleware that reads a password from the headers and if the password is 'melon', let it continue, else, send back a 401 status code and a message.
// Use it for the /area51 endpoint

// server.use(helmet()); // this will apply it globally
server.use(express.json());
server.use(logger);


// Endpoints
// This router is local middleware because hubsRouter ONLY applies to this specific route
server.use('/api/hubs', helmet(), hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.get("/echo", (req, res) => {
  res.send(req.headers);
});

server.use(gateKeeper);
// this middleware is applied locally to the /area51
server.get("/area51", helmet(), (req, res) => {
  if (req.headers.password === 'melon') {
    res.send(req.headers);
  } else {
    res.status(401).json({errorMessage: 'Sorry, but the password is incorrect!'})
  }
});


module.exports = server;
