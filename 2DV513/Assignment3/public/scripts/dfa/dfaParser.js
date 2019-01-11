export class DFAParser {
  parse (string) {
    let objects = []
    let lines = string.split('\n')
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith('State ')) {
        this.state(objects, lines[i], i, 'NORMAL')
      } else if (lines[i].startsWith('->State ')) {
        this.state(objects, lines[i], i, 'START')
      } else if (lines[i].startsWith('(State) ')) {
        this.state(objects, lines[i], i, 'END')
      } else if (lines[i].includes('->') && lines[i].split(':').length === 2 && !lines[i].startsWith('->')) {
        this.arrow(objects, lines[i], i)
      }
    }
    return objects
  }

  state (objects, line, lineNumber, stateType) {
    let parts = line.split(' ')
    if (parts.length === 2 && !line.includes('.')) {
      for (let i = 0; i < objects.length; i++) {
        if (parts[1] === objects[i].name) {
          console.log('ERROR: variable name already exists\nline: ' + lineNumber)
          return
        }
      }
      let s = new State(parts[1], stateType)
      objects.push(s)
    } else {
      console.log('ERROR: invalid variable name\nline: ' + lineNumber)
    }
  }

  arrow (objects, line, lineNumber) {
    let temp = line.split(': ')[0]
    let parts = temp.split('->')
    let a = -1
    let b = -1
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].name === parts[0]) {
        a = i
      }
      if (objects[i].name === parts[1]) {
        b = i
      }
    }
    if (a !== -1 && b !== -1) {
      let s = objects[a]
      let arrow = new Arrow(s, objects[b], line.split(': ')[1])
      s.connections.push(arrow)
    } else {
      console.log('ERROR: invalid variable names\nline: ' + lineNumber)
    }
  }
}

export class Arrow {
  constructor (from, to, text) {
    this.points = []
    this.from = from
    this.to = to
    this.text = text
  }
}

export class State {
  constructor (name, type) {
    this.x = null
    this.y = null
    this.width = null
    this.height = null
    this.connections = []
    this.name = name
    this.type = type
  }
}
