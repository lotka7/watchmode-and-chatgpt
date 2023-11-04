import path from 'path';

const rootPath = path.join(__dirname, '..', '..');

const env =
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
    ? process.env.NODE_ENV
    : 'development';

const config = {
  default: {
    version: 'v1',
    logLevel: 'debug',

    protocol: 'http',
    listenHost: '127.0.0.1',
    listenPort: 6060,
    hostname: 'localhost',
    getApiUrl: function () {
      return `${this.protocol}://${this.hostname}:${this.listenPort}/api/${this.version}`;
    },

    sessionSecret: 'secret',
    hasProxy: false,
    isCookieSecure: false,

    frontendHostname: 'localhost',
    frontendPort: 3000,

    rootPath,

    enabledOrigins: [
      'http://localhost:3000',
      'http://localhost:6060',
      'http://127.0.0.1',
    ],
    sendErrorStack: false,

    watchmode: {
      url: 'https://api.watchmode.com/v1/search/',
    },
    openai: {
      url: 'https://api.openai.com/v1/engines/text-davinci-002/completions',
      max_tokens: 50,
    },
  },
  development: {},
  production: {},
};

export default { ...config.default, ...config[env] } as typeof config.default;
