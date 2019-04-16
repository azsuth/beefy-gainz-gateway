const express = require('express');
const proxy = require('express-http-proxy');
const { OAuth2Client } = require('google-auth-library');
const { port, clientId } = require('./config');

const app = express();
const client = new OAuth2Client(clientId);

async function verify(idToken) {
    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: clientId
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];

    console.log('User ID: ', userId);
}

app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        next();
        return;
    }

    console.log('Beginning auth...');

    const idToken = req.header('idToken');
    verify(idToken)
        .then(next)
        .catch((err) => {
            console.error(err);
            res.send('Error');
        });
});

app.use('/', proxy('http://router'));

app.listen(port, () => {
    console.log("Gateway listening on port " + port);
});
