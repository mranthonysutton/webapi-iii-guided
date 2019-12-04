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

// Checks if the password is equal to melon, if so, then allows the next function to run, else, immediately returns an error
function gateKeeper(req, res, next) {
  const password = req.headers.password;

  if (password && password.toLowerCase() === 'melon') {
    next();
  } else {
    res.status(401).json({errorMessage: 'Sorry, but the password is incorrect.'});
  }
}

// if making a dynamic function, we need to return a function. For example, we want to run a condition based upon a users specific role that is being passed
const checkRole = (role) => {
  return function (req, res, next) {
    if (role && role === req.headers.role) {
      next();
    } else {
      res.status(403).json({message: "Can't touch this!"})
    }
  }
};

// server.use(helmet()); // this will apply it globally
server.use(express.json());
server.use(logger);

// Endpoints
// This router is local middleware because hubsRouter ONLY applies to this specific route
server.use('/api/hubs', helmet(), checkRole('admin'), hubsRouter);

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

// this middleware is applied locally to the /area51
server.get("/area51", helmet(), gateKeeper, checkRole('agent'), (req, res) => {
  res.send(req.headers);
});


module.exports = server;
