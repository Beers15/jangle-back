const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

module.exports = function auth(req, res, next) {
  let token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  jwt.verify(token, getKey, {}, async (err) => {
    if (err || !token) {
      console.log(err)
      token ? res.status(500).send(err) : res.status(401).send(err);
    } else next();
  });
}
