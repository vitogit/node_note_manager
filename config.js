var config = {
  DATABASE_URL: getEnv('DATABASE_URL') || 'postgres://localhost:5432/notes',
  PORT: getEnv('PORT') || 5000,
};
 
function getEnv(variable){
  if (process.env.NODE_ENV != undefined && process.env[variable] === undefined){
    throw new Error('You must create an environment variable for ' + variable);
  }
  return process.env[variable];
};
 
module.exports = config;
