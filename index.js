const express = require('express');
const proxy = require('express-http-proxy');
const { OAuth2Client } = require('google-auth-library');

const {
  port,
  clientId,
  userIdOverride,
  clientUpstream,
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
  // only authenticate requests to paths starting with /api
  if (!req.path.startsWith('/api')) {
    next();
    return;
  }

  const idToken = req.header('idToken');
  verify(idToken)
    .then(userId => {
      // pass the userId to all upstream services
      req.headers['userId'] = userIdOverride || userId;
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(401).send();
    });
});

app.use(
  '/api/exercises',
  proxy(exerciseUpstream, {
    proxyReqPathResolver: req => {
      const query = req.url.split('?');
      return `/exercises?${query[1]}`;
    }
  })
);

app.use('/', proxy(clientUpstream));

app.listen(port, () => {
  console.log('Gateway listening on port ' + port);
});
