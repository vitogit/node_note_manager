const pg = require('pg');
const config = require('../config');
const connectionString = config.DATABASE_URL || 'postgres://localhost:5432/notes';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE notes(id SERIAL PRIMARY KEY, name varchar not null, text TEXT)');
query.on('end', () => { client.end(); });
