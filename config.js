module.exports = {
    port: process.env.GATEWAY_PORT || 3001,
    clientId: process.env.GATEWAY_CLIENT_ID || '54851119520-ioolc277euiajnnqt3vdo2r9r8sqse9g.apps.googleusercontent.com',
    router: process.env.GATEWAY_ROUTER || 'http://router',
    userIdOverride: process.env.GATEWAY_USER_ID_OVERRIDE
};
