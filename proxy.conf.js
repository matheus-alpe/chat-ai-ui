const PROXY_CONFIG = [
  // Proxy configuration for API calls
  {
    context: ['/api'],
    target: 'http://localhost:8080',
    secure: false,
    logLevel: 'debug',
  },
];

module.exports = PROXY_CONFIG;
