import { Point } from '../dfa/dfa.js'
import { ClassRenderer } from './classRenderer.js'

export class ClassDiagram {
  constructor () {
    this.doneObjects = []
    this.length = 200
    this.objects = null
  }

  render (g, objects) {
    this.objects = objects

    let scale = 2.0 - (this.objects.length / 10)
    if (scale < 1.2) {
      scale = 1.2
    }
    g.font = (8 * scale).toString() + 'px Lucida Console'

    // Set size of all objects
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i].constructor.name === 'Class') {
        let s = this.objects[i]
        let memberHeight = Math.round(s.members.length * 10 * scale + scale * 2)
        let width = 0
        for (let j = 0; j < s.members.length; j++) {
          if (s.members[j].length > width) {
            width = s.members[j].length
          }
        }
        if (s.name.length > width) {
          width = s.name.length
        }
        width *= Math.round(5 * scale)
        if (width < scale * 70) {
          width = Math.round(scale * 70)
        }
        s.width = width
        if (s.type === 'CLASS') {
          s.height = Math.round(scale * 10 + memberHeight)
        } else if (s.type === 'ENUM') {
          s.height = Math.round(scale * 10 * 2 + memberHeight)
        } else if (s.type === 'INTERFACE') {
          s.height = Math.round(scale * 10 * 2 + memberHeight)
        }
      }
    }

    // Set x and y for all objects.
    if (this.objects.length > 0) {
      this.objects[0].x = 400
      this.objects[0].y = 400
    }
    this.doneObjects.push(this.objects[0])
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i].constructor.name === 'Class') {
        let s = this.objects[i]
        this.placeConnections(s)
      }
    }

    let renderer = new ClassRenderer()
    renderer.render(g, this.objects)
  }

  placeConnections (s) {
    let connections = this.getConnections(s)
    for (let i = 0; i < connections.length; i++) {
      let a = connections[i]
      if (!this.doneObjects.includes(a.to)) {
        let done = false
        for (let j = 0; !done && j < 100; j++) {
          let angle = Math.random() * 2 * Math.PI
          let x = Math.floor(a.from.x + Math.cos(angle) * this.length)
          let y = Math.floor(a.from.y + Math.sin(angle) * this.length)
          if (x < 0 || y < 0 || x > 1800 || y > 1000 || this.isOverlapping(x, y)) {
            done = false
          } else {
            done = true
            a.to.x = x
            a.to.y = y
            this.doneObjects.push(a.to)
            this.placeConnections(a.to)
          }
        }
      }
    }
  }

  isOverlapping (x, y) {
    let result = false
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i].x !== null && this.objects[i].y !== null) {
        let one = new Point(x, y)
        let two = new Point(this.objects[i].x, this.objects[i].y)
        if (one.distanceTo(two) < 100) {
          result = true
          break
        }
      }
    }
    return result
  }

  getConnections (s) {
    let list = []
    list = list.concat(s.aggregations)
    list = list.concat(s.associations)
    list = list.concat(s.compositions)
    list = list.concat(s.dAssociations)
    list = list.concat(s.dependencies)
    list = list.concat(s.inheritances)
    list = list.concat(s.realizations)
    return list
  }
}
