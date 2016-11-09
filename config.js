var config = {
  CLIENT_ID: getEnv('CLIENT_ID'),
  PORT: getEnv('PORT') || 4000,
};
 
function getEnv(variable){
  if (process.env.NODE_ENV != undefined && process.env[variable] === undefined){
    throw new Error('You must create an environment variable for ' + variable);
  }
  return process.env[variable];
};
 
module.exports = config;
