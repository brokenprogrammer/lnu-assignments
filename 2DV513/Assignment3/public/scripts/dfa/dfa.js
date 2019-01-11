import { DFARenderer } from './dfaRenderer.js'

export class DFA {
  constructor () {
    this.doneObjects = []
    this.length = 200
    this.objects = []
  }

  render (g, objects) {
    let scale = 2.0 - (objects.length / 10)
    if (scale < 1.2) {
      scale = 1.2
    }
    g.font = (12 * scale).toString() + 'px Arial'
    this.objects = objects

    // Set x and y for all objects
    if (objects.length > 1) {
      this.objects[0].x = 400
      this.objects[0].y = 400
      this.objects[1].x = 400 + this.length
      this.objects[1].y = 400
    }
    this.doneObjects.push(this.objects[0])
    this.doneObjects.push(this.objects[1])
    for (let i = 0; i < this.objects.length; i++) {
      let s = objects[i]
      this.placeConnections(s)
    }

    // Set points for arrows
    for (let i = 0; i < this.objects.length; i++) {
      let s = objects[i]
      for (let j = 0; j < s.connections.length; j++) {
        let a = s.connections[j]
        if (a.points.length < 2) {
          if (a.from === a.to) {
            let ang = Math.PI / 3
            let x = s.width / 2 * Math.cos(ang)
            let y = s.width / 2 * Math.sin(ang)
            a.points.push(new Point(s.x + s.width / 2 + x, s.y + s.height / 2 + y))
            a.points.push(new Point(s.x + s.width / 2, s.y + s.height + scale * 25))
            a.points.push(new Point(s.x + s.width / 2 - x, s.y + s.height / 2 + y))
          } else {
            let angle = Math.atan2(a.to.y - a.from.y, a.to.x - a.from.x)
            let x = s.width / 2 * Math.cos(angle)
            let y = s.width / 2 * Math.sin(angle)
            a.points.push(new Point(a.from.x + a.from.width / 2 + x, a.from.y + a.from.height / 2 + y))
            a.points.push(new Point(a.to.x + a.to.width / 2 - x, a.to.y + a.to.height / 2 - y))
          }
        }
      }
    }

    let doneArrows = []

    // Bend arrows that go back and forth.
    for (let i = 0; i < objects.length; i++) {
      let s = objects[i]
      for (let j = 0; j < s.connections.length; j++) {
        let other = s.connections[j].to
        if (!doneArrows.includes(s.connections[j]) && s !== other) {
          for (let k = 0; k < other.connections.length; k++) {
            if (other.connections[k].to === s && !doneArrows.includes(other.connections[k])) {
              let a = new Point(s.x + s.width / 2, s.y + s.height / 2)
              let b = new Point(other.x + other.width / 2, other.y + other.height / 2)
              let middle = this.getMiddle(a, b)
              let angle = Math.PI - (Math.PI / 2 - Math.atan2(b.y - a.y, b.x - a.x))
              let x = 20 * Math.cos(angle)
              let y = 20 * Math.sin(angle)
              let temp = other.connections[k].points[1]
              other.connections[k].points.push(temp)
              other.connections[k].points[1] = new Point(middle.x + x, middle.y + y)
              this.setEdgePoints(other.connections[k])
              doneArrows.push(other.connections[k])
              temp = s.connections[j].points[1]
              s.connections[j].points.push(temp)
              s.connections[j].points[1] = new Point(middle.x - x, middle.y - y)
              this.setEdgePoints(s.connections[j])
              doneArrows.push(s.connections[j])
            }
          }
        }
      }
    }

    let renderer = new DFARenderer()
    renderer.render(g, objects)
  }

  setEdgePoints (a) {
    if (a.from !== a.to) {
      let from = new Point(a.from.x + a.from.width / 2, a.from.y + a.from.height / 2)
      let angle = this.getAngle(from, a.points[1])
      let x = (a.from.width / 2) * Math.cos(angle)
      let y = (a.from.width / 2) * Math.sin(angle)
      a.points[0] = new Point(a.from.x + a.from.width / 2 + x, a.from.y + a.from.height / 2 + y)
      let to = new Point(a.to.x + a.to.width / 2, a.to.y + a.to.height / 2)
      angle = this.getAngle(to, a.points[1])
      x = (a.to.width / 2) * Math.cos(angle)
      y = (a.to.width / 2) * Math.sin(angle)
      a.points[2] = new Point(a.to.x + a.to.width / 2 + x, a.to.y + a.to.height / 2 + y)
    }
  }

  getAngle (a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x)
  }

  getMiddle (a, b) {
    let x = a.x + (b.x - a.x) / 2
    let y = a.y + (b.y - a.y) / 2
    return new Point(x, y)
  }

  placeConnections (s) {
    for (let i = 0; i < s.connections.length; i++) {
      let a = s.connections[i]
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
}

export class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  distanceTo (point) {
    return Math.sqrt((this.x - point.x) * (this.x - point.x) + (this.y - point.y) * (this.y - point.y))
  }
}
