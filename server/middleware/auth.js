const models = require('../models');
const Promise = require('bluebird');
const utils = require('../lib/hashUtils');

module.exports.createSession = (req, res, next) => {
  if (JSON.stringify(req.cookies) !== JSON.stringify({})) {
    // console.log('cookies!!!!!!!!!', req.cookies);
    req.session = { hash: 'req.cookies[shortlyid]' };

  } else {
    var cookieHash = utils.hashfunc(Math.random().toString(), 'jim');
    var option = { hash: cookieHash };
    req.session = { hash: cookieHash};
    res.cookies = {shortlyid: {value: cookieHash}};
    models.Sessions.create(option)
    .then(results => {
    })

  }
  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

