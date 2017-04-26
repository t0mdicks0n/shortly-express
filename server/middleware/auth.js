const models = require('../models');
const Promise = require('bluebird');
const utils = require('../lib/hashUtils');

module.exports.createSession = (req, res, next) => {
  // on successfull signup the session in the DB get updated
  if ((req.cookies) && (req.cookies.success)) {

    Promise.resolve(req.cookies.success)
      .then(user => {
        console.log('????', req.cookies)
        return models.Users.get({
          username: user
        })
      })
      .then(results => {
        console.log('results', results);
        return results.id;
      })
      .then(userID => {
        models.Sessions.update( {hash: req.cookies.shortlyId}, {user_id: userID} )
      })
  }
  // checks for cookie object on request
  else if (req.cookies && JSON.stringify(req.cookies) !== JSON.stringify({})) {
    console.log('!!!!!!!!', req.cookies)
    // checks cookie and adds cookie to session object
    models.Sessions.get({hash: req.cookies.shortlyId})
    .then(results => {
      if (results) {
        req.session = { hash: req.cookies.shortlyId };
      }
    });
  // creates cookie, inserts to DB, and sends to browser
  } else {
    var cookieHash = utils.hashfunc(Math.random().toString(), 'jim');
    var option = { hash: cookieHash };
    req.session = { hash: cookieHash};
    res.cookie('shortlyId', cookieHash, { maxAge: 90000, httpOnly: true });

    // res.cookies = {shortlyid: {value: cookieHash}};
    models.Sessions.create(option)
    .then(results => {
      console.log('session inserted');
    })
    .error(error => {
      console.log(error);
    })

  }
  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.checkCookie = (req, res, next) => {
  if (req.path !== '/login' && req.path !== '/signup') {
    if (req.cookies && JSON.stringify(req.cookies) !== JSON.stringify({})) {
      // check via the DB
      // If ok, next/accept the request/post
      models.Sessions.get({hash: req.cookies.shortlyId})
      .then(results => {
        if (results.user_id && results.user_id !== null) {
          // req.session = { hash: req.cookies.shortlyId };
          console.log('the id ............. ', results.user_id);
          next();
        }
      })
    } else {
      // Redirect user to login
      res.status(301).redirect('/login');
    }
  } else {
    next();
  }
}




