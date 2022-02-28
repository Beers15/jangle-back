const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

module.exports = function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
