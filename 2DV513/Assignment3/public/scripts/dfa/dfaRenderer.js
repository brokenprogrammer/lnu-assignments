import { Point } from './dfa.js'

export class DFARenderer {
  render (g, objects) {
    let scale = 2.0 - (objects.length / 10)
    if (scale < 1.4) {
      scale = 1.4
    }
    g.font = (12 * scale).toString() + 'px Lucida Console'

    // Draw objects
    for (let i = 0; i < objects.length; i++) {
      let s = objects[i]
      this.drawArrows(g, s, scale)
      this.drawState(g, s)
      let x = Math.floor((s.x + s.width / 2) - s.name.length * scale * 2.4)
      let y = Math.floor(s.y + s.height / 2 + scale * 3)
      g.fillText(s.name, x, y)
    }
  }

  drawState (g, state) {
    g.beginPath()
    g.arc(state.x + state.width / 2, state.y + state.height / 2, state.width / 2, 0, 2 * Math.PI)
    g.stroke()
    if (state.type === 'END') {
      g.beginPath()
      g.arc(state.x + state.width / 2, state.y + state.height / 2, state.width / 2.5, 0, 2 * Math.PI)
      g.stroke()
    } else if (state.type === 'START') {
      let fromX = state.x - 100
      let fromY = Math.floor(state.y + state.height / 2)
      let toX = state.x
      let toY = fromY
      this.drawSingleArrow(g, new Point(fromX, fromY), new Point(toX, toY))
    }
  }

  drawArrows (g, state, scale) {
    for (let i = 0; i < state.connections.length; i++) {
      g.beginPath()
      let a = state.connections[i]
      let points = []
      if (a.points.length > 2) {
        points = this.circularCurve(a.points)
      } else {
        points = a.points
      }
      g.moveTo(points[0].x, points[0].y)
      for (let j = 1; j < points.length; j++) {
        g.lineTo(points[j].x, points[j].y)
      }

      let angle = 0.0
      if (points.length < 2) {
        angle = Math.PI
      } else {
        angle = this.getAngle(points[points.length - 2], points[points.length - 1])
      }
      if (a.to === a.from) {
        angle -= 0.15
      }
      let headlen = 15
      let toX = points[points.length - 1].x
      let toY = points[points.length - 1].y
      g.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6))
      g.moveTo(toX, toY)
      g.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6))
      let middle = null
      if (points.length > 1) {
        middle = this.getMiddle(points[Math.floor((points.length - 1) / 2)], points[Math.floor((points.length - 1) / 2) + 1])
      } else {
        middle = points[0]
      }
      g.stroke()
      g.fillStyle = '#FFFFFF'
      g.fillRect(middle.x - 10, middle.y - 10, 20, 20)
      g.fillStyle = '#000000'
      g.fillText(a.text, middle.x - 5, middle.y + 5)
    }
  }

  getMiddle (a, b) {
    let x = a.x + (b.x - a.x) / 2
    let y = a.y + (b.y - a.y) / 2
    return new Point(x, y)
  }

  getAngle (a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x)
  }

  circularCurve (points) {
    let list = []
    let center = this.getCircleCenter(points)
    let big = Math.atan2(center.y - points[0].y, center.x - points[0].x)
    let small = Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x)
    let right = this.direction(big, small)
    let r = points[0].distanceTo(center)
    list.push(points[0])

    let ang1 = this.getAngle(center, points[2])
    let ang2 = this.getAngle(center, points[0])
    let percent = 0
    if (!right) {
      let temp = ang1 - ang2
      if (temp < 0) {
        temp += 2 * Math.PI
      }
      percent = temp / (Math.PI * 2)
    } else {
      let temp = ang2 - ang1
      if (temp < 0) {
        temp += 2 * Math.PI
      }
      percent = temp / (Math.PI * 2)
    }
    if (r > 100000) {
      r = 1.0
    }
    let length = Math.round(Math.PI * r * 2 * percent)

    // distance between points
    let l = 1.0

    // Angle between points
    let v = Math.acos((r * r + l * l - r * r) / (2 * r * l))

    // Place points
    for (let i = 0; i < length / l; i++) {
      let a = list[list.length - 1]
      let u = Math.atan2(center.y - a.y, center.x - a.x)
      u *= -1
      let w = v + u
      w *= -1
      let y = l * Math.sin(w)
      let x = l * Math.cos(w)
      let res = null
      if (right) {
        res = new Point(a.x - x, a.y - y)
      } else {
        res = new Point(a.x + x, a.y + y)
      }
      list.push(res)
    }

    return list
  }

  direction (big, small) {
    big *= -1
    small *= -1
    if (big < 0 & small > 0 | big > 0 & small < 0) {
      big += Math.PI / 2
      small += Math.PI / 2
      if (big < 0) {
        big += Math.PI * 2
      }
      if (small < 0) {
        small += Math.PI * 2
      }
    }
    big = big % (Math.PI * 2)
    small = small % (Math.PI * 2)
    if (small < big) {
      return true
    } else {
      return false
    }
  }

  getCircleCenter (points) {
    let yDeltaA = points[1].y - points[0].y
    let xDeltaA = points[1].x - points[0].x
    let yDeltaB = points[2].y - points[1].y
    let xDeltaB = points[2].x - points[1].x
    let arr = []
    arr.push(yDeltaA)
    arr.push(xDeltaA)
    arr.push(yDeltaB)
    arr.push(xDeltaB)
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 0) {
        arr[i] = 1.0
      }
    }
    let aSlope = arr[0] / arr[1]
    let bSlope = arr[2] / arr[3]
    let x = ((aSlope * bSlope * (points[0].y - points[2].y) + bSlope * (points[0].x + points[1].x) - aSlope * (points[1].x + points[2].x)) / (2 * (bSlope - aSlope)))
    let y = (-1 * (x - (points[0].x + points[1].x) / 2) / aSlope + (points[0].y + points[1].y) / 2)
    let center = new Point(x, y)
    return center
  }

  drawSingleArrow (g, from, to) {
    g.beginPath()
    let headlen = 15
    let angle = Math.atan2(to.y - from.y, to.x - from.x)
    g.moveTo(from.x, from.y)
    g.lineTo(to.x, to.y)
    g.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6))
    g.moveTo(to.x, to.y)
    g.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6))
    g.stroke()
  }
}
