const Promise = require('bluebird');

module.exports = (db) => {
  if (!db.queryAsync) {
    db = Promise.promisifyAll(db);
  }

  // Create links table
  return db.queryAsync(`
    CREATE TABLE IF NOT EXISTS links (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      url VARCHAR(255),
      baseUrl VARCHAR(255),
      code VARCHAR(5),
      title VARCHAR(255),
      visits INT NOT NULL DEFAULT 0,
      timestamp TIMESTAMP
    );`)
    .then(() => {
      // Create clicks table
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS clicks (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          linkId INT,
          timestamp TIMESTAMP
        );`);
    })
  /************************************************************/
  /*          Add additional schema queries here              */
  /************************************************************/
    .then(() => {
      return db.queryAsync('DROP TABLE IF EXISTS users;');
    })
    .then(() => {
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(24),
        password VARCHAR(300),
        timestamp TIMESTAMP,
        UNIQUE (username)
        );`)
    })
    .then(() => {
      return db.queryAsync('DROP TABLE IF EXISTS sessions;');
    })
    .then(() => {
      return db.queryAsync(`
        CREATE TABLE IF NOT EXISTS sessions (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        hash VARCHAR(300),
        user_id INT,
        timestamp TIMESTAMP
        );`);
    })
    .then(() => {
      // return db.queryAsync('FOREIGN KEY (user_id) REFERENCES users (id);');
    })
    .error(err => {
      console.log(err);
    });
};
