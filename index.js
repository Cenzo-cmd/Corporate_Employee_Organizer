 const connection = require('./assets/js/connection');
 const start = require('./assets/js/prompts');


 connection.connect(err => {
     if (err) throw err;

     console.log(`
    +--------------------------+
    | Welcome to Corporate_db! |
    +--------------------------+
    `);

     start.start();
 });