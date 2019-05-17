module.exports = {
    port: process.env.GATEWAY_PORT || 3001,
    clientId: process.env.GATEWAY_CLIENT_ID || '54851119520-ioolc277euiajnnqt3vdo2r9r8sqse9g.apps.googleusercontent.com',
    userIdOverride: process.env.GATEWAY_USER_ID_OVERRIDE,
    clientUpstream: process.env.GATEWAY_CLIENT_UPSTREAM || 'http://client:3000',
    exerciseUpstream: process.env.GATEWAY_EXERCISE_UPSTREAM || 'http://exercise:8080'
};
