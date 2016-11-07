var pg = require('pg');
var config = require('../config');

function query(sql, params, cb) {
  pg.connect(config.DATABASE_URL, function(err, client, done) {
    if (err) { 
      done(); // release client back to pool
      cb(err);
      return;
    }
    client.query(sql, params, cb);
  });
}

exports.loadNote = function(data, cb) {
  var sql = `
    SELECT *
    FROM notes
    WHERE id = $1
  `;
  query(sql, [data.id], function(err, result) {
    if (err) return cb(err);
    cb(null, result.rows[0]);
  });
};


exports.saveNote = function(data, cb) {
  var sql = `
    INSERT INTO notes (name, text)
    VALUES ($1, $2)
    RETURNING * 
  `;
  query(sql, [data.name, data.text], function(err, result) {
    if (err) return cb(err);
    cb(null, result.rows[0]);
  });
};

exports.updateNote = function(data, cb) {
  var sql = `
    UPDATE notes
    SET name = $2, text = $3
    WHERE id = $1
    RETURNING id, name, text     
  `;

  query(sql, [data.id, data.name, data.text], function(err, result) {
    if (err) return cb(err);
    cb(null, result.rows[0]);
  });
  
};

exports.cleanTable = function(cb) {
  var sql = `
    TRUNCATE TABLE  notes
    RESTART IDENTITY;
  `;
  query(sql, [], function(err) {
    if (err) return cb(err);
    cb(null);
  });
};
