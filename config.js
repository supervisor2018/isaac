var config = {};

config.database = {
  "development": {
    "username": process.env.DB_USERNAME_DEV,
    "password": process.env.DB_PASSWORD_DEV,
    "database": process.env.DB_DATBASE_DEV,
    "host": process.env.DB_HOST_DEV,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USERNAME_TEST,
    "password": process.env.DB_PASSWORD_TEST,
    "database": process.env.DB_DATABASE_TEST,
    "host": process.env.DB_HOST_TEST,
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": DATABASE_URL
  }
}


module.exports = config; 