const express = require('express');
const proxy = require('express-http-proxy');
const { OAuth2Client } = require('google-auth-library');

const {
  port,
  clientId,
  userIdOverride,
  exerciseUpstream
} = require('./config');

const app = express();
const client = new OAuth2Client(clientId);

// throws an error if the idToken from Google is invalid
async function verify(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: clientId
  });

  const payload = ticket.getPayload();
  const userId = payload['sub'];

  console.log('idToken:', idToken);
  console.log('userId:', userId);

  return userId;
}

// catch all to handle authentication
app.use((req, res, next) => {
  if (userIdOverride) {
    req.headers['userId'] = userIdOverride;
    next();
    return;
  }

  const idToken = req.header('idToken');
  verify(idToken)
    .then(userId => {
      // pass the userId to all upstream services
      req.headers['userId'] = userId;
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(401).send();
    });
});

app.use(
  '/exercises',
  proxy(exerciseUpstream, {
    proxyReqPathResolver: req => {
      const query = req.url.split('?');
      return `/exercises${req.path}?${query[1]}`;
    }
  })
);

app.listen(port, () => {
  console.log(`Gateway listening on port ${port}`);
});
