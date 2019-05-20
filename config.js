module.exports = {
    port: process.env.GATEWAY_PORT || 3001,
    clientId: process.env.GATEWAY_GOOGLE_CLIENT_ID,
    userIdOverride: process.env.GATEWAY_USER_ID_OVERRIDE,
    exerciseUpstream: process.env.GATEWAY_EXERCISE_UPSTREAM || 'http://exercise:8080'
};
