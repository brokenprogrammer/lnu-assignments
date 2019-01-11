'use strict'

let diagramTable = 'CREATE TABLE IF NOT EXISTS Diagrams (id int PRIMARY KEY AUTO_INCREMENT, title varchar(100) not null default "Untitled", code longtext not null, author int not null, FOREIGN KEY (author) REFERENCES Users (id))'
let classDiagramTable = 'CREATE TABLE IF NOT EXISTS ClassDiagrams (id int not null, type tinytext not null, FOREIGN KEY (id) REFERENCES Diagrams (id))'
let dfaDiagramTable = 'CREATE TABLE IF NOT EXISTS DFADiagrams (id int not null, isNFA boolean not null default false, FOREIGN KEY (id) REFERENCES Diagrams (id))'

// Creates a new entry in Diagrams and one in the respective child table ClassDiagram or DFADiagram.
function create (connection, data, callback) {
  if (data.type === 'class') {
    let queryString = 'INSERT INTO Diagrams(title, code, author) VALUES(?, ?, ?); INSERT INTO ClassDiagrams (id, type) VALUES(LAST_INSERT_ID(), ?)'
    connection.query(queryString, [data.title, data.code, data.author, data.classType], callback)
  } else {
    let queryString = 'INSERT INTO Diagrams(title, code, author) VALUES(?, ?, ?); INSERT INTO DFADiagrams (id, isNFA) VALUES(LAST_INSERT_ID(), ?)'
    connection.query(queryString, [data.title, data.code, data.author, data.isNFA], callback)
  }
}

function findAllUserDiagrams (connection, userId, callback) {
  let queryString = `
    SELECT Users.username, Diagrams.title, Diagrams.code, ClassDiagrams.type, DFADiagrams.isNFA
    FROM Users
    JOIN Diagrams ON Users.id = Diagrams.author
    LEFT JOIN ClassDiagrams ON Diagrams.id = ClassDiagrams.id
    LEFT JOIN DFADiagrams ON Diagrams.id = DFADiagrams.id
    WHERE Users.id = ?`
  connection.query(queryString, userId, callback)
}

module.exports.diagramTable = diagramTable
module.exports.classDiagramTable = classDiagramTable
module.exports.dfaDiagramTable = dfaDiagramTable
module.exports.create = create
module.exports.findAllUserDiagrams = findAllUserDiagrams
