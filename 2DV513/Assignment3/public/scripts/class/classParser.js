import { Arrow } from '../dfa/dfaParser.js'

export class ClassParser {
  parse (string) {
    let list = []
    let lines = string.split('\n')
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith('Class ')) {
        this.initClass(list, lines[i], i, 'CLASS')
      } else if (lines[i].startsWith('Enum ')) {
        this.initClass(list, lines[i], i, 'ENUM')
      } else if (lines[i].startsWith('Interface ')) {
        this.initClass(list, lines[i], i, 'INTERFACE')
      } else if (lines[i].startsWith('Package ')) {
        this.package(list, lines[i], i)
      } else if (lines[i].includes(' add ')) {
        this.add(list, lines[i], i)
      } else if (lines[i].includes('-->')) {
        this.dependency(list, lines[i], i)
      } else if (lines[i].includes('--|>')) {
        this.realization(list, lines[i], i)
      } else if (lines[i].includes('-|>')) {
        this.inheritance(list, lines[i], i)
      } else if (lines[i].includes(')-(')) {
        this.association(list, lines[i], i)
      } else if (lines[i].includes(')->(')) {
        this.dAssociation(list, lines[i], i)
      } else if (lines[i].includes(')<>-(')) {
        this.aggregation(list, lines[i], i)
      } else if (lines[i].includes(')<#>-(')) {
        this.composition(list, lines[i], i)
      } else if (lines[i].includes('.text=')) {
        this.text(list, lines[i], i)
      }
    }
    return list
  }

  text (list, line, lineNumber) {
    let parts = line.split('.text=')
    for (let i = 0; i < list.length; i++) {
      if (parts[0] === list[i].name && list[i].constructor.name === 'Package') {
        if (parts[1][0] === '"' && parts[1][parts[1].length - 1] === '"') {
          let p = list[i]
          p.text = parts[1].replace(/"/g, '')
        } else {
          console.log('ERROR: string must be between two " symbols\nline: ' + lineNumber)
        }
      }
    }
  }

  composition (list, line, lineNumber) {
    let parts = line.split(')<#>-(')
    let from = parts[0].split('(')[1]
    let to = parts[1].split(')')[0]
    let a = -1
    let b = -1
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === parts[0].split('(')[0]) {
        a = i
      } else if (list[i].name === parts[1].split(')')[1]) {
        b = i
      }
    }
    if (a !== -1 && b !== -1) {
      if (list[a].constructor.name === 'Class' && list[b].constructor.name === 'Class') {
        let c = list[a]
        let ass = new Association()
        ass.fromText = from
        ass.toText = to
        ass.to = list[b]
        ass.from = c
        c.composition.push(ass)
      } else {
        console.log('ERROR: invalid variable type\nline: ' + lineNumber)
      }
    } else {
      console.log('ERROR: invalid variable names\nline: ' + lineNumber)
    }
  }

  aggregation (list, line, lineNumber) {
    let parts = line.split(')<>-(')
    let from = parts[0].split('(')[1]
    let to = parts[1].split(')')[0]
    let a = -1
    let b = -1
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === parts[0].split('(')[0]) {
        a = i
      } else if (list[i].name === parts[1].split(')')[1]) {
        b = i
      }
    }
    if (a !== -1 && b !== -1) {
      if (list[a].constructor.name === 'Class' && list[b].constructor.name === 'Class') {
        let c = list[a]
        let ass = new Association()
        ass.fromText = from
        ass.toText = to
        ass.to = list[b]
        ass.from = c
        c.aggregations.push(ass)
      } else {
        console.log('ERROR: invalid variable type\nline: ' + lineNumber)
      }
    } else {
      console.log('ERROR: invalid variable names\nline: ' + lineNumber)
    }
  }

  dAssociation (list, line, lineNumber) {
    let parts = line.split(')->(')
    let from = parts[0].split('(')[1]
    let to = parts[1].split(')')[0]
    let a = -1
    let b = -1
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === parts[0].split('(')[0]) {
        a = i
      } else if (list[i].name === parts[1].split(')')[1]) {
        b = i
      }
    }
    if (a !== -1 && b !== -1) {
      if (list[a].constructor.name === 'Class' && list[b].constructor.name === 'Class') {
        let c = list[a]
        let ass = new Association()
        ass.fromText = from
        ass.toText = to
        ass.to = list[b]
        ass.from = c
        c.dAssociations.push(ass)
      } else {
        console.log('ERROR: invalid variable type\nline: ' + lineNumber)
      }
    } else {
      console.log('ERROR: invalid variable names\nline: ' + lineNumber)
    }
  }

  association (list, line, lineNumber) {
    let parts = line.split(')-(')
    let from = parts[0].split('(')[1]
    let to = parts[1].split(')')[0]
    let a = -1
    let b = -1
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === parts[0].split('(')[0]) {
        a = i
      } else if (list[i].name === parts[1].split(')')[1]) {
        b = i
      }
    }
    if (a !== -1 && b !== -1) {
      if (list[a].constructor.name === 'Class' && list[b].constructor.name === 'Class') {
        let c = list[a]
        let ass = new Association()
        ass.fromText = from
        ass.toText = to
        ass.to = list[b]
        ass.from = c
        c.associations.push(ass)
      } else {
        console.log('ERROR: invalid variable type\nline: ' + lineNumber)
      }
    } else {
      console.log('ERROR: invalid variable names\nline: ' + lineNumber)
    }
  }

  inheritance (list, line, lineNumber) {
    let parts = line.split('-|>')
    let a = -1
    let b = -1
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === parts[0]) {
        a = i
      } else if (list[i].name === parts[1]) {
        b = i
      }
    }
    if (a !== -1 && b !== -1) {
      if (list[a].constructor.name === 'Class' && list[b].constructor.name === 'Class') {
        let c = list[a]
        let arrow = new Arrow()
        arrow.from = c
        arrow.to = list[b]
        c.inheritances.push(arrow)
      } else {
        console.log('ERROR: invalid variable type\nline: ' + lineNumber)
      }
    } else {
      console.log('ERROR: invalid variable type\nline: ' + lineNumber)
    }
  }

  realization (list, line, lineNumber) {
    let parts = line.split('--|>')
    let a = -1
    let b = -1
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === parts[0]) {
        a = i
      } else if (list[i].name === parts[1]) {
        b = i
      }
    }
    if (a !== -1 && b !== -1) {
      if (list[a].constructor.name === 'Class' && list[b].constructor.name === 'Class') {
        let c = list[a]
        let arrow = new Arrow()
        arrow.from = c
        arrow.to = list[b]
        c.realizations.push(arrow)
      } else {
        console.log('ERROR: invalid variable type\nline: ' + lineNumber)
      }
    } else {
      console.log('ERROR: invalid variable type\nline: ' + lineNumber)
    }
  }

  dependency (list, line, lineNumber) {
    let parts = line.split('-->')
    let a = -1
    let b = -1
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === parts[0]) {
        a = i
      } else if (list[i].name === parts[1]) {
        b = i
      }
    }
    if (a !== -1 && b !== -1) {
      if (list[a].constructor.name === 'Class' && list[b].constructor.name === 'Class') {
        let c = list[a]
        let arrow = new Arrow()
        arrow.from = c
        arrow.to = list[b]
        c.dependencies.push(arrow)
      } else {
        console.log('ERROR: invalid variable type\nline: ' + lineNumber)
      }
    } else {
      console.log('ERROR: invalid variable type\nline: ' + lineNumber)
    }
  }

  add (list, line, lineNumber) {
    let parts = line.split(' add ')
    for (let i = 0; i < list.length; i++) {
      if (list[i].name === parts[0] && list[i].constructor.name === 'Class') {
        let c = list[i]
        c.members.push(parts[1])
        break
      } else if (list[i].name === parts[0] && list[i].constructor.name === 'Package') {
        let p = list[i]
        for (let j = 0; j < list.length; j++) {
          if (list[j].name === parts[1] && list[j].constructor.name === 'Class' && j !== i) {
            let c = list[j]
            p.classes.push(c)
            break
          }
        }
      }
    }
  }

  package (list, line, lineNumber) {
    let parts = line.split(' ')
    if (parts.length === 2 && !line.includes('.')) {
      for (let i = 0; i < list.length; i++) {
        if (parts[1] === list[i].name) {
          console.log('ERROR: variable name already exists\nline: ' + lineNumber)
          return
        }
      }
      let p = new Package()
      p.name = parts[1]
      list.push(p)
    } else {
      console.log('ERROR: invalid variable name\nline: ' + lineNumber)
    }
  }

  initClass (list, line, lineNumber, type) {
    let parts = line.split(' ')
    if (parts.length === 2 && !line.includes('.')) {
      for (let i = 0; i < list.length; i++) {
        if (parts[1] === list[i].name) {
          console.log('ERROR: variable name already exists\nline: ' + lineNumber)
          return
        }
      }
      let c = new Class()
      c.name = parts[1]
      c.type = type
      list.push(c)
    } else {
      console.log('ERROR: invalid variable name\nline: ' + lineNumber)
    }
  }
}

export class Package {
  constructor () {
    this.classes = []
    this.text = null
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
  }
}

export class Class {
  constructor () {
    this.type = null
    this.inheritances = []
    this.dependencies = []
    this.realizations = []
    this.associations = []
    this.dAssociations = []
    this.aggregations = []
    this.compositions = []
    this.members = []
  }
}

export class Association {
  constructor () {
    this.fromText = null
    this.toText = null
  }
}
