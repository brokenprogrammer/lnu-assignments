import { DFARenderer } from './dfaRenderer.js'
import { Point } from './dfa.js'

export class DFAController {
  constructor (canvas, g, objects) {
    this.canvas = canvas
    this.g = g
    this.objects = objects
    this.renderer = new DFARenderer()
    this.isDown = false
    this.buttonIndex = 0
    this.currentObject = null
    this.currentArrow = null
    this.arrowPointIndex = 0
    this.isOnPoint = false
  }

  listen () {
    this.canvas.onmousedown = (e) => {
      let mousePos = this.getMousePosition(e)
      this.buttonIndex = e.button
      if (this.currentArrow !== null && !this.isDown) {
        if (!this.isOnPoint && this.buttonIndex === 0) {
          this.addAt(this.currentArrow.points, mousePos, this.arrowPointIndex)
        } else if (this.isOnPoint && this.buttonIndex === 2 && this.currentArrow.points.length > 2 && this.currentArrow.from !== this.currentArrow.to) {
          this.setTwoPoints(this.currentArrow)
          this.g.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.renderer.render(this.g, this.objects)
        }
      } else {
        for (let i = 0; i < this.objects.length; i++) {
          let r = new Rectangle(this.objects[i].x, this.objects[i].y, this.objects[i].width, this.objects[i].height)
          if (r.containsPoint(mousePos)) {
            this.currentObject = this.objects[i]
            this.startPoint = mousePos
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

        // NOTE: Disables no-labels in order to break from an outerloop smoothly.
        outerloop:// eslint-disable-line
        for (let i = 0; i < this.objects.length; i++) {
          let s = this.objects[i]
          for (let j = 0; j < s.connections.length; j++) {
            let arrow = s.connections[j]
            for (let k = 0; k < arrow.points.length; k++) {
              if (mousePos.distanceTo(arrow.points[k]) < 100 && k !== 0 && k !== arrow.points.length - 1 && arrow.from !== arrow.to && !this.isLoopingArrow(arrow)) {
                this.drawRedCircle(this.g, arrow.points[k].x, arrow.points[k].y)
                if (mousePos.distanceTo(arrow.points[k]) < 15) {
                  this.currentArrow = arrow
                  this.arrowPointIndex = k
                  this.isOnPoint = true
                  break outerloop// eslint-disable-line
                }
              } else if (k > 0 && arrow.points.length === 2) {
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
                  break outerloop// eslint-disable-line
                } else {
                  this.currentArrow = null
                  this.arrowPointIndex = 0
                }
              } else {
                this.isOnPoint = false
                this.arrowPointIndex = 0
                this.currentArrow = null
              }
            }
          }
        }
      } else if (this.isDown && this.currentObject != null) {
        this.currentObject.x += mousePos.x - this.startPoint.x
        this.currentObject.y += mousePos.y - this.startPoint.y

        for (let i = 0; i < this.objects.length; i++) {
          let s = this.objects[i]
          if (s === this.currentObject) {
            for (let j = 0; j < s.connections.length; j++) {
              let a = s.connections[j]
              if (a.points.length <= 2) {
                this.setTwoPoints(a)
              } else {
                let x1 = a.points[0].x + mousePos.x - this.startPoint.x
                let y1 = a.points[0].y + mousePos.y - this.startPoint.y
                let x2 = a.points[1].x + (mousePos.x - this.startPoint.x) / 2
                let y2 = a.points[1].y + (mousePos.y - this.startPoint.y) / 2
                a.points[0] = new Point(x1, y1)
                if (a.from !== a.to) {
                  a.points[1] = new Point(x2, y2)
                  this.setEdgePoints(a)
                } else {
                  x2 = a.points[1].x + mousePos.x - this.startPoint.x
                  y2 = a.points[1].y + mousePos.y - this.startPoint.y
                  a.points[1] = new Point(x2, y2)
                }
              }
            }
          }
          for (let j = 0; j < s.connections.length; j++) {
            let a = s.connections[j]
            if (a.points.length <= 2) {
              this.setTwoPoints(a)
            } else {
              if (a.to === this.currentObject && a.to !== a.from) {
                let x1 = a.points[2].x + mousePos.x - this.startPoint.x
                let y1 = a.points[2].y + mousePos.y - this.startPoint.y
                let x2 = a.points[1].x + (mousePos.x - this.startPoint.x) / 2
                let y2 = a.points[1].y + (mousePos.y - this.startPoint.y) / 2
                a.points[2] = new Point(x1, y1)
                a.points[1] = new Point(x2, y2)
              }
              if (a.from !== a.to) {
                this.setEdgePoints(a)
              } else if (a.to === this.currentObject) {
                let x = a.points[2].x + mousePos.x - this.startPoint.x
                let y = a.points[2].y + mousePos.y - this.startPoint.y
                a.points[2] = new Point(x, y)
              }
            }
          }
          this.setLoopArrows()
        }
        this.g.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.renderer.render(this.g, this.objects)
        this.startPoint = mousePos
      } else if (this.isDown && this.currentArrow !== null) {
        if (this.buttonIndex === 0) {
          let mousePos = this.getMousePosition(e)
          this.currentArrow.points[this.arrowPointIndex] = mousePos
          this.setEdgePoints(this.currentArrow)
          this.g.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.renderer.render(this.g, this.objects)
          this.drawRedCircle(this.g, mousePos.x, mousePos.y)
        }
      }
    }

    this.canvas.onmouseup = (e) => {
      this.currentObject = null
      this.isDown = false
    }
  }

  setLoopArrows () {
    let doneArrows = []
    for (let i = 0; i < this.objects.length; i++) {
      let s = this.objects[i]
      for (let j = 0; j < s.connections.length; j++) {
        let other = s.connections[j].to
        if (!doneArrows.includes(s.connections[j]) && s !== other) {
          for (let k = 0; k < other.connections.length; k++) {
            if (other.connections[k].to === s && !doneArrows.includes(other.connections[k])) {
              s.connections[j].points.splice(1, 1)
              other.connections[k].points.splice(1, 1)
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
  }

  getMiddle (a, b) {
    let x = a.x + (b.x - a.x) / 2
    let y = a.y + (b.y - a.y) / 2
    return new Point(x, y)
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

  isWithinPoints (a, b, mousePos, margin) {
    let rect = null
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

  getAngle (a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x)
  }

  setTwoPoints (a) {
    a.points = []
    let angle = Math.atan2(a.to.y - a.from.y, a.to.x - a.from.x)
    let x = a.to.width / 2 * Math.cos(angle)
    let y = a.to.width / 2 * Math.sin(angle)
    a.points.push(new Point(a.from.x + a.from.width / 2 + x, a.from.y + a.from.height / 2 + y))
    a.points.push(new Point(a.to.x + a.to.width / 2 - x, a.to.y + a.to.height / 2 - y))
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

  isLoopingArrow (a) {
    let s = a.to
    for (let i = 0; i < s.connections.length; i++) {
      if (s.connections[i].to === a.from) {
        return true
      }
    }
    return false
  }

  addAt (points, p, index) {
    points.push(p)
    for (let i = points.length - 1; i > index; i--) {
      points[i] = points[i - 1]
    }
    points[index] = p
  }

  getMousePosition (e) {
    let rect = this.canvas.getBoundingClientRect()
    let mousePos = new Point(e.clientX - rect.left, e.clientY - rect.top)
    return mousePos
  }
}

export class Rectangle {
  constructor (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  containsPoint (p) {
    if (p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height) {
      return true
    }
    return false
  }
}
