'use strict'

let db = require('../lib/databaseHelper').db

let diagramTable = 'CREATE TABLE IF NOT EXISTS Diagrams (id INTEGER PRIMARY KEY AUTOINCREMENT, title varchar(100) not null default "Untitled", code longtext not null, author int not null, FOREIGN KEY (author) REFERENCES Users (id))'
let classDiagramTable = 'CREATE TABLE IF NOT EXISTS ClassDiagrams (id INTEGER not null, type tinytext not null, FOREIGN KEY (id) REFERENCES Diagrams (id))'
let dfaDiagramTable = 'CREATE TABLE IF NOT EXISTS DFADiagrams (id INTEGER not null, isNFA boolean not null default false, FOREIGN KEY (id) REFERENCES Diagrams (id))'

// Creates a new entry in Diagrams and one in the respective child table ClassDiagram or DFADiagram.
function create (data, callback) {
  if (data.type === 'class') {
    let sql = 'INSERT INTO Diagrams(title, code, author) VALUES(?, ?, ?)'
    db.run(sql, [data.title, data.code, data.author], function (error) {
      if (error) {
        console.log(error)
      }
      let diagramId = this.lastID
      sql = 'INSERT INTO ClassDiagrams (id, type) VALUES(?, ?)'
      db.run(sql, [diagramId, data.classType], callback)
    })
  } else {
    let sql = 'INSERT INTO Diagrams(title, code, author) VALUES(?, ?, ?)'
    db.run(sql, [data.title, data.code, data.author], function (error) {
      if (error) {
        console.log(error)
      }
      let diagramId = this.lastID
      sql = 'INSERT INTO DFADiagrams (id, isNFA) VALUES(?, ?)'
      db.run(sql, [diagramId, data.isNFA], callback)
    })
  }
}

function findById (id, callback) {
  let queryString = `
    SELECT Diagrams.id, Diagrams.title, Diagrams.code, Diagrams.author, ClassDiagrams.type, DFADiagrams.isNFA
    FROM Diagrams
    LEFT JOIN ClassDiagrams ON Diagrams.id = ClassDiagrams.id
    LEFT JOIN DFADiagrams ON Diagrams.id = DFADiagrams.id
    WHERE Diagrams.id = ?`
  db.get(queryString, id, function (error, result) {
    if (error) {
      return callback(null)
    }

    return callback(result)
  })
}

function findAll (callback) {
  let queryString = `
    SELECT Diagrams.id, Diagrams.title, Diagrams.code, ClassDiagrams.type, DFADiagrams.isNFA
    FROM Diagrams
    LEFT JOIN ClassDiagrams ON Diagrams.id = ClassDiagrams.id
    LEFT JOIN DFADiagrams ON Diagrams.id = DFADiagrams.id`
  db.all(queryString, callback)
}

function findAllUserDiagrams (userId, callback) {
  let queryString = `
    SELECT Users.username, Diagrams.id, Diagrams.title, Diagrams.code, ClassDiagrams.type, DFADiagrams.isNFA
    FROM Users
    JOIN Diagrams ON Users.id = Diagrams.author
    LEFT JOIN ClassDiagrams ON Diagrams.id = ClassDiagrams.id
    LEFT JOIN DFADiagrams ON Diagrams.id = DFADiagrams.id
    WHERE Users.id = ?`
  db.all(queryString, userId, callback)
}

function countUserDiagrams (callback) {
  let queryString = `
    SELECT author, COUNT(*) as "Total", COUNT(ClassDiagrams.id) as "ClassDiagrams", COUNT(DFADiagrams.id) as "DFADiagrams", SUM(DFADiagrams.isNFA = 1) as "NFADiagrams"
    FROM Diagrams
    LEFT JOIN ClassDiagrams ON Diagrams.id = ClassDiagrams.id
    LEFT JOIN DFADiagrams ON Diagrams.id = DFADiagrams.id
    GROUP BY author`
  db.all(queryString, callback)
}

module.exports.diagramTable = diagramTable
module.exports.classDiagramTable = classDiagramTable
module.exports.dfaDiagramTable = dfaDiagramTable
module.exports.create = create
module.exports.findById = findById
module.exports.findAll = findAll
module.exports.findAllUserDiagrams = findAllUserDiagrams
module.exports.countUserDiagrams = countUserDiagrams
