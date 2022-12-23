export const AppConfiguration = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 8080,
  bcrypt: {
    salt: 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'sAmPlEsEcReT',
    expiration: '60m',
  },
  redis: {
    master: {
      host: process.env.REDIS_MASTER_HOST || 'localhost',
      port: Number(process.env.REDIS_MASTER_PORT) || 6379,
    },
    slave: {
      host: process.env.REDIS_SLAVE_HOST || 'localhost',
      port: Number(process.env.REDIS_SLAVE_PORT) || 6379,
    },
  },
};
