const Database = require('better-sqlite3');
const db = new Database('hotel.db');
db.prepare("UPDATE users SET role = 'admin' WHERE email = 'brisa@email.com'").run();
console.log('listo');