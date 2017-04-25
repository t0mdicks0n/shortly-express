const parseCookies = (req, res, next) => {
  // console.log('?????????', req.headers);
  if (req.headers.cookie) {
    var cookieStrings = req.headers.cookie.split('; ');
    var cookieCrumbles = cookieStrings.map(function(cookie) {
      return cookie.split('=');
    });
    cookieCrumbles.forEach(function(cookie, index, arr) {
      req.cookies = req.cookies || {};
      req['cookies'][cookie[0]] = cookie[1];
    });
  }
next();
};

module.exports = parseCookies;




