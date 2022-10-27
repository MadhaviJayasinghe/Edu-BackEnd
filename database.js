var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE subject (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject text, 
            path text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO subject (subject, path) VALUES (?,?)'
                db.run(insert, ["Computer Science","OOP"])
            }
        });  

        db.run(`CREATE TABLE attempt (
            attemptid INTEGER PRIMARY KEY AUTOINCREMENT,
            student text, 
            date text,
            subject INTEGER
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows (no rows up to now) 
                var insert = 'INSERT INTO attempt (student, date, subject) VALUES (?,?,?)'
                db.run(insert, ["S001","2022-10-16", 1])              
            }
        }); 

        db.run(`CREATE TABLE quest (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject INTEGER, 
            question text,
            marks text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows (no rows up to now)
                var insert = 'INSERT INTO quest (subject, question, marks) VALUES (?,?,?)'
                db.run(insert, [1,"What is OOP?","10"])               
            }
        }); 

        db.run(`CREATE TABLE marks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quest INTEGER, 
            answer text,
            marks INTEGER,
            attempt INTEGER
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows (no rows up to now) 
                var insert = 'INSERT INTO marks (quest, answer, marks, attempt) VALUES (?,?,?,?)'
                db.run(insert, [1,"Test Answer", 0, 1])               
            }
        }); 

    }
});


module.exports = db