import { ClassRenderer } from './classRenderer.js'
import { Rectangle } from '../dfa/dfaController.js'
import { Point } from '../dfa/dfa.js'

export class ClassController {
  constructor (canvas, g, objects) {
    this.canvas = canvas
    this.g = g
    this.objects = objects
    this.isDown = false
    this.currentObject = null
    this.currentArrow = null
    this.arrowPointIndex = 0
    this.isOnPoint = false
    this.renderer = new ClassRenderer()
    this.startPoint = null
  }

  listen () {
    this.canvas.onmousedown = (e) => {
      let mousePos = this.getMousePosition(e)
      if (this.currentArrow !== null && !this.isDown) { // if mouse is over arrow
        if (!this.isOnPoint && e.button === 0) {
          this.addAt(this.currentArrow.points, mousePos, this.arrowPointIndex)
        } else if (this.isOnPoint && e.button === 2) {
          this.currentArrow.points.splice(this.arrowPointIndex, 1)
          this.g.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.renderer.render(this.g, this.objects)
        }
      } else {
        for (let i = 0; i < this.objects.length; i++) {
          if (this.objects[i].constructor.name === 'Class') {
            let r = new Rectangle(this.objects[i].x, this.objects[i].y, this.objects[i].width, this.objects[i].height)
            if (r.containsPoint(mousePos)) {
              this.currentObject = this.objects[i]
              this.startPoint = mousePos
            }
          }
        }
      }
      this.isDown = true
    }

    this.canvas.onmousemove = (e) => {
      let mousePos = this.getMousePosition(e)
      if (!this.isDown) {
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.renderer.render(this.g, this.objects)
        outerloop:// eslint-disable-line
        for (let i = 0; i < this.objects.length; i++) {
          if (this.objects[i].constructor.name === 'Class') {
            let s = this.objects[i]
            let connections = this.getConnections(s)
            for (let j = 0; j < connections.length; j++) {
              let arrow = connections[j]
              for (let k = 0; k < arrow.points.length; k++) {
                if (mousePos.distanceTo(arrow.points[k]) < 15) {
                  this.drawRedCircle(this.g, arrow.points[k].x, arrow.points[k].y)
                  this.currentArrow = arrow
                  this.arrowPointIndex = k
                  this.isOnPoint = true
                  break outerloop;// eslint-disable-line
                } else if (k > 0) {
                  this.isOnPoint = false
                  let a = arrow.points[k - 1]
                  let b = arrow.points[k]
                  let v = Math.PI / 2 - (this.getAngle(a, b) - this.getAngle(mousePos, b))
                  let length = Math.cos(v) * mousePos.distanceTo(b)
                  let margin = 10
                  if (length < margin && length > -margin && this.isWithinPoints(a, b, mousePos, margin)) {
                    this.drawGreenCircle(this.g, mousePos.x, mousePos.y)
                    this.currentArrow = arrow
                    this.arrowPointIndex = k
                    break outerloop;// eslint-disable-line
                  } else {
                    this.currentArrow = null
                    this.arrowPointIndex = 0
                  }
                }
              }
            }
          }
        }
      } else if (this.isDown && this.currentObject != null) { // Holding on an object
        this.currentObject.x += mousePos.x - this.startPoint.x
        this.currentObject.y += mousePos.y - this.startPoint.y
        for (let i = 0; i < this.objects.length; i++) {
          if (this.objects[i].constructor.name === 'Class') {
            let s = this.objects[i]
            let connections = this.getConnections(s)
            if (s === this.currentObject) {
              for (let j = 0; j < connections.length; j++) {
                let x = connections[j].points[0].x + mousePos.x - this.startPoint.x
                let y = connections[j].points[0].y + mousePos.y - this.startPoint.y
                connections[j].points[0] = new Point(x, y)
              }
            } else {
              for (let j = 0; j < connections.length; j++) {
                if (connections[j].to === this.currentObject) {
                  let x = connections[j].points[connections[j].points.length - 1].x + mousePos.x - this.startPoint.x
                  let y = connections[j].points[connections[j].points.length - 1].y + mousePos.y - this.startPoint.y
                  connections[j].points[connections[j].points.length - 1] = new Point(x, y)
                }
              }
            }
          }
        }
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.renderer.render(this.g, this.objects)
        this.startPoint = mousePos
      } else if (this.isDown && this.currentArrow != null) { // Holding on an arrow
        if (e.button === 0) {
          this.currentArrow.points[this.arrowPointIndex] = this.getMousePosition(e)
          this.g.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.renderer.render(this.g, this.objects)
        }
      }
    }

    this.canvas.onmouseup = (e) => {
      this.currentObject = null
      this.isDown = false
    }
  }

  isWithinPoints (a, b, mousePos, margin) {
    let rect
    if (a.x >= b.x && a.y >= b.y) {
      rect = new Rectangle(b.x - margin, b.y - margin, a.x - b.x + margin * 2, a.y - b.y + margin * 2)
    } else if (a.x >= b.x && a.y <= b.y) {
      rect = new Rectangle(b.x - margin, a.y - margin, a.x - b.x + margin * 2, b.y - a.y + margin * 2)
    } else if (a.x <= b.x && a.y <= b.y) {
      rect = new Rectangle(a.x - margin, a.y - margin, b.x - a.x + margin * 2, b.y - a.y + margin * 2)
    } else if (a.x <= b.x && a.y >= b.y) {
      rect = new Rectangle(a.x - margin, b.y - margin, b.x - a.x + margin * 2, a.y - b.y + margin * 2)
    }
    return rect.containsPoint(mousePos)
  }

  drawGreenCircle (g, x, y) {
    g.beginPath()
    g.fillStyle = '#00FF00'
    g.arc(x, y, 10, 0, Math.PI * 2)
    g.fill()
    g.closePath()
    g.fillStyle = '#000000'
  }

  drawRedCircle (g, x, y) {
    g.beginPath()
    g.fillStyle = '#FF0000'
    g.arc(x, y, 15, 0, Math.PI * 2)
    g.fill()
    g.closePath()
    g.fillStyle = '#000000'
  }

  getAngle (a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x)
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

  getMousePosition (e) {
    let rect = this.canvas.getBoundingClientRect()
    let mousePos = new Point(e.clientX - rect.left, e.clientY - rect.top)
    return mousePos
  }

  addAt (points, p, index) {
    points.push(p)
    for (let i = points.length - 1; i > index; i--) {
      points[i] = points[i - 1]
    }
    points[index] = p
  }
}
