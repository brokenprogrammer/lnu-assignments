import { Rectangle } from '../dfa/dfaController.js'
import { Point } from '../dfa/dfa.js'

export class ClassRenderer {
  constructor () {
    this.scale = null
  }

  render (g, objects) {
    this.scale = 2.0 - (objects.length / 10)
    if (this.scale < 1.2) {
      this.scale = 1.2
    }
    g.font = (8 * this.scale).toString() + 'px Lucida Console'
    g.beginPath()

    // Draw arrows
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].constructor.name === 'Class') {
        let s = objects[i]
        for (let j = 0; j < s.inheritances.length; j++) {
          let arrow = s.inheritances[j]
          if (arrow.points.length < 3) {
            this.setArrowPoints(arrow)
          }
          this.drawInheritance(g, arrow)
        }
        for (let j = 0; j < s.dependencies.length; j++) {
          let arrow = s.dependencies[j]
          if (arrow.points.length < 3) {
            this.setArrowPoints(arrow)
          }
          this.drawDependency(g, arrow)
        }
        for (let j = 0; j < s.realizations.length; j++) {
          let arrow = s.realizations[j]
          if (arrow.points.length < 3) {
            this.setArrowPoints(arrow)
          }
          this.drawRealization(g, arrow)
        }
        for (let j = 0; j < s.associations.length; j++) {
          let arrow = s.associations[j]
          if (arrow.points.length < 3) {
            this.setArrowPoints(arrow)
          }
          this.drawAssociation(g, arrow)
        }
        for (let j = 0; j < s.dAssociations.length; j++) {
          let arrow = s.dAssociations[j]
          if (arrow.points.length < 3) {
            this.setArrowPoints(arrow)
          }
          this.drawDAssociation(g, arrow)
        }
        for (let j = 0; j < s.aggregations.length; j++) {
          let arrow = s.aggregations[j]
          if (arrow.points.length < 3) {
            this.setArrowPoints(arrow)
          }
          this.drawAggregation(g, arrow)
        }
        for (let j = 0; j < s.compositions.length; j++) {
          let arrow = s.compositions[j]
          if (arrow.points.length < 3) {
            this.setArrowPoints(arrow)
          }
          this.drawComposition(g, arrow)
        }
      }
    }

    // Draw objects
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].constructor.name === 'Class') {
        let s = objects[i]
        if (s.type === 'CLASS') {
          this.drawClass(g, s)
        } else if (s.type === 'ENUM') {
          this.drawEnum(g, s)
        } else if (s.type === 'INTERFACE') {
          this.drawInterface(g, s)
        }
      } else if (objects[i].constructor.name === 'Package') {
        let p = objects[i]
        this.setPackagePosition(p)
        this.drawPackage(g, p)
      }
    }
    g.stroke()
  }

  drawPackage (g, p) {
    g.strokeRect(p.x, p.y, p.width, p.height)
    g.moveTo(p.x, p.y + this.scale * 12)
    let text = null
    if (p.text === null) {
      text = p.name
    } else {
      text = p.text
    }
    g.lineTo(p.x + text.length * this.scale * 5, p.y + this.scale * 12)
    g.lineTo(p.x + text.length * this.scale * 5 + this.scale * 6, p.y + this.scale * 6)
    g.lineTo(p.x + text.length * this.scale * 5 + this.scale * 6, p.y)
    g.fillText(text, p.x + this.scale * 2, p.y + this.scale * 8)
  }

  setPackagePosition (p) {
    if (p.classes.length > 0) {
      let leftMostX = p.classes[0]
      let rightMostX = p.classes[0]
      let topY = p.classes[0]
      let bottomY = p.classes[0]
      for (let j = 1; j < p.classes.length; j++) {
        if (p.classes[j].x < leftMostX.x) {
          leftMostX = p.classes[j]
        }
        if (p.classes[j].x + p.classes[j].width > rightMostX.x + rightMostX.width) {
          rightMostX = p.classes[j]
        }
        if (p.classes[j].y < topY.y) {
          topY = p.classes[j]
        }
        if (p.classes[j].y + p.classes[j].height > bottomY.y + bottomY.height) {
          bottomY = p.classes[j]
        }
      }
      p.x = leftMostX.x - 50
      p.y = topY.y - 50
      p.width = rightMostX.x + rightMostX.width + 50 - p.x
      p.height = bottomY.y + bottomY.height + 50 - p.y
    }
  }

  drawInterface (g, s) {
    g.strokeRect(s.x, s.y, s.width, s.height)
    g.moveTo(s.x, s.y + this.scale * 10 * 2)
    g.lineTo(s.x + s.width, s.y + this.scale * 10 * 2)
    let textX1 = Math.floor((s.x + s.width / 2) - 13 * this.scale * 2.4)
    let textX2 = Math.floor((s.x + s.width / 2) - s.name.length * this.scale * 2.4)
    g.fillText('<<interface>>', textX1, s.y + this.scale * 8)
    g.font = 'bold ' + (8 * this.scale).toString() + 'px Lucida Console'
    g.fillText(s.name, textX2, s.y + this.scale * 8 * 2)
    g.font = (8 * this.scale).toString() + 'px Lucida Console'
    let field = []
    let methods = []
    for (let j = 0; j < s.members.length; j++) {
      if (s.members[j].includes('(') && s.members[j].includes(')')) {
        methods.push(s.members[j])
      } else {
        field.push(s.members[j])
      }
    }
    let j = null
    for (j = 0; j < field.length; j++) {
      let x = s.x + this.scale * 2
      let y = s.y + this.scale * 10 * (j + 3) - this.scale * 2
      g.fillText(field[j], x, y)
    }
    let nwY = s.y + this.scale * 10 * (j + 2)
    g.moveTo(s.x, nwY)
    g.lineTo(s.x + s.width, nwY)
    for (j = 0; j < methods.length; j++) {
      let x = s.x + this.scale * 2
      let y = nwY + this.scale * 10 * (j + 1) - this.scale * 2
      g.fillText(methods[j], x, y)
    }
  }

  drawEnum (g, s) {
    g.strokeRect(s.x, s.y, s.width, s.height)
    g.moveTo(s.x, s.y + this.scale * 10 * 2)
    g.lineTo(s.x + s.width, s.y + this.scale * 10 * 2)
    let textX1 = Math.floor((s.x + s.width / 2) - 15 * this.scale * 2.4)
    let textX2 = Math.floor((s.x + s.width / 2) - s.name.length * this.scale * 2.4)
    g.fillText('<<enumeration>>', textX1, s.y + this.scale * 8)
    g.font = 'bold ' + (8 * this.scale).toString() + 'px Lucida Console'
    g.fillText(s.name, textX2, s.y + this.scale * 8 * 2)
    g.font = (8 * this.scale).toString() + 'px Lucida Console'
    for (let i = 0; i < s.members.length; i++) {
      let x = s.x + this.scale * 2
      let y = s.y + this.scale * 10 * (i + 3) - this.scale * 2
      g.fillText(s.members[i], x, y)
    }
  }

  drawClass (g, s) {
    g.strokeRect(s.x, s.y, s.width, s.height)
    g.moveTo(s.x, s.y + this.scale * 10)
    g.lineTo(s.x + s.width, s.y + this.scale * 10)
    let field = []
    let methods = []
    for (let j = 0; j < s.members.length; j++) {
      if (s.members[j].includes('(') && s.members[j].includes(')')) {
        methods.push(s.members[j])
      } else {
        field.push(s.members[j])
      }
    }
    g.font = 'bold ' + (8 * this.scale).toString() + 'px Lucida Console'
    let textX = Math.floor((s.x + s.width / 2) - s.name.length * this.scale * 2.4)
    g.fillText(s.name, textX, s.y + this.scale * 8)
    g.font = (8 * this.scale).toString() + 'px Lucida Console'
    let j = null
    for (j = 0; j < field.length; j++) {
      let x = s.x + this.scale * 2
      let y = s.y + this.scale * 10 * (j + 2) - this.scale * 2
      g.fillText(field[j], x, y)
    }
    let nwY = s.y + this.scale * 10 * (j + 1)
    g.moveTo(s.x, nwY)
    g.lineTo(s.x + s.width, nwY)
    for (j = 0; j < methods.length; j++) {
      let x = s.x + this.scale * 2
      let y = nwY + this.scale * 10 * (j + 1) - this.scale * 2
      g.fillText(methods[j], x, y)
    }
  }

  drawComposition (g, a) {
    let headlen = 15
    let from = a.points[0]
    let to = a.points[1]
    let angle = Math.atan2(to.y - from.y, to.x - from.x)
    g.stroke()
    g.beginPath()
    g.moveTo(from.x, from.y)
    to = new Point(from.x + headlen * Math.cos(angle - Math.PI / 6), from.y + headlen * Math.sin(angle - Math.PI / 6))
    g.lineTo(to.x, to.y)
    to = new Point(to.x + headlen * Math.cos(angle - 11 * Math.PI / 6), to.y + headlen * Math.sin(angle - 11 * Math.PI / 6))
    g.lineTo(to.x, to.y)
    g.moveTo(from.x, from.y)
    to = new Point(from.x + headlen * Math.cos(angle - 11 * Math.PI / 6), from.y + headlen * Math.sin(angle - 11 * Math.PI / 6))
    g.lineTo(to.x, to.y)
    to = new Point(to.x + headlen * Math.cos(angle - Math.PI / 6), to.y + headlen * Math.sin(angle - Math.PI / 6))
    g.lineTo(to.x, to.y)
    g.closePath()
    g.fillStyle = '#000000'
    g.fill()
    g.beginPath()
    g.moveTo(to.x, to.y)
    for (let i = 1; i < a.points.length; i++) {
      g.lineTo(a.points[i].x, a.points[i].y)
    }
    this.drawAssociationText(g, a)
  }

  drawAggregation (g, a) {
    let headlen = 15
    let from = a.points[0]
    let to = a.points[1]
    let angle = Math.atan2(to.y - from.y, to.x - from.x)
    g.moveTo(from.x, from.y)
    to = new Point(from.x + headlen * Math.cos(angle - Math.PI / 6), from.y + headlen * Math.sin(angle - Math.PI / 6))
    g.lineTo(to.x, to.y)
    to = new Point(to.x + headlen * Math.cos(angle - 11 * Math.PI / 6), to.y + headlen * Math.sin(angle - 11 * Math.PI / 6))
    g.lineTo(to.x, to.y)
    g.moveTo(from.x, from.y)
    to = new Point(from.x + headlen * Math.cos(angle - 11 * Math.PI / 6), from.y + headlen * Math.sin(angle - 11 * Math.PI / 6))
    g.lineTo(to.x, to.y)
    to = new Point(to.x + headlen * Math.cos(angle - Math.PI / 6), to.y + headlen * Math.sin(angle - Math.PI / 6))
    g.lineTo(to.x, to.y)
    for (let i = 1; i < a.points.length; i++) {
      g.lineTo(a.points[i].x, a.points[i].y)
    }
    this.drawAssociationText(g, a)
  }

  drawDAssociation (g, a) {
    let headlen = 15
    g.moveTo(a.points[0].x, a.points[0].y)
    for (let i = 1; i < a.points.length; i++) {
      g.lineTo(a.points[i].x, a.points[i].y)
    }
    let to = a.points[a.points.length - 1]
    let from = a.points[a.points.length - 2]
    let angle = Math.atan2(to.y - from.y, to.x - from.x)
    g.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6))
    g.moveTo(to.x, to.y)
    g.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6))
    this.drawAssociationText(g, a)
  }

  drawAssociation (g, a) {
    g.moveTo(a.points[0].x, a.points[0].y)
    for (let i = 1; i < a.points.length; i++) {
      g.lineTo(a.points[i].x, a.points[i].y)
    }
    this.drawAssociationText(g, a)
  }

  drawAssociationText (g, a) {
    let length = 20
    let from = a.points[0]
    let to = a.points[1]
    let angle = Math.atan2(to.y - from.y, to.x - from.x)
    if (angle < 0) {
      angle += Math.PI * 2
    }
    if (angle <= Math.PI) {
      angle -= Math.PI / 4
    } else {
      angle += Math.PI / 4
    }
    let x = Math.cos(angle) * length
    let y = Math.sin(angle) * length + 5
    if (angle >= Math.PI / 2 && angle <= 3 * Math.PI / 2) {
      x -= 20
    }
    g.fillText(a.fromText, from.x + x, from.y + y)
    from = a.points[a.points.length - 2]
    to = a.points[a.points.length - 1]
    angle = Math.atan2(to.y - from.y, to.x - from.x)
    if (angle < 0) {
      angle += Math.PI * 2
    }
    if (angle <= Math.PI) {
      angle += Math.PI / 4
    } else {
      angle -= Math.PI / 4
    }
    x = Math.cos(angle) * length
    y = Math.sin(angle) * length - 5
    if (angle <= Math.PI / 2 || angle >= 3 * Math.PI / 2) {
      x += 20
    }
    g.fillText(a.toText, to.x - x, to.y - y)
  }

  drawRealization (g, a) {
    let headlen = 15
    let angle
    for (let j = 1; j < a.points.length; j++) {
      let from = a.points[j - 1]
      let to = a.points[j]
      angle = Math.atan2(to.y - from.y, to.x - from.x)
      let x = headlen * 0.9 * Math.cos(angle)
      let y = headlen * 0.9 * Math.sin(angle)
      g.moveTo(from.x, from.y)
      let current = from
      let last = to
      if (j === a.points.length - 1) {
        let difx = (headlen * 0.9 * Math.cos(angle)).floor()
        let dify = (headlen * 0.9 * Math.sin(angle)).floor()
        last = new Point(last.x - difx, last.y - dify)
      }
      let i = 0
      while (current.distanceTo(last) > headlen) {
        current = new Point(current.x + x, current.y + y)
        if (i % 2 === 0) {
          g.lineTo(current.x, current.y)
        } else {
          g.moveTo(current.x, current.y)
        }
        i++
      }
      if (i % 2 === 0) {
        g.lineTo(last.x, last.y)
      } else {
        g.moveTo(last.x, last.y)
      }
    }

    let difx = (headlen * 0.9 * Math.cos(angle)).floor()
    let dify = (headlen * 0.9 * Math.sin(angle)).floor()
    let to = a.points[a.points.length - 1]
    g.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6))
    g.lineTo(to.x, to.y)
    g.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6))
    g.lineTo(to.x - difx, to.y - dify)
  }

  drawDependency (g, a) {
    let headlen = 15
    let angle = null
    for (let j = 1; j < a.points.length; j++) {
      let from = a.points[j - 1]
      let to = a.points[j]
      angle = Math.atan2(to.y - from.y, to.x - from.x)
      let x = headlen * 0.9 * Math.cos(angle)
      let y = headlen * 0.9 * Math.sin(angle)
      g.moveTo(from.x, from.y)
      let i = 0
      while (from.distanceTo(to) > headlen) {
        from = new Point(from.x + x, from.y + y)
        if (i % 2 === 0) {
          g.lineTo(from.x, from.y)
        } else {
          g.moveTo(from.x, from.y)
        }
        i++
      }
      if (i % 2 === 0) {
        g.lineTo(to.x, to.y)
      } else {
        g.moveTo(to.x, to.y)
      }
    }
    let to = a.points[a.points.length - 1]
    g.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6))
    g.moveTo(to.x, to.y)
    g.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6))
  }

  drawInheritance (g, a) {
    let headlen = 15
    let angle = null
    let x = null
    let y = null
    g.moveTo(a.points[0].x, a.points[0].y)
    for (let i = 1; i < a.points.length; i++) {
      let to = a.points[i]
      let from = a.points[i - 1]
      if (i === a.points.length - 1) {
        angle = Math.atan2(to.y - from.y, to.x - from.x)
        x = Math.floor(headlen * 0.9 * Math.cos(angle))
        y = Math.floor(headlen * 0.9 * Math.sin(angle))
        to = new Point(to.x - x, to.y - y)
      }
      g.lineTo(to.x, to.y)
    }
    let to = a.points[a.points.length - 1]
    g.lineTo(to.x - headlen * Math.cos(angle - Math.PI / 6), to.y - headlen * Math.sin(angle - Math.PI / 6))
    g.lineTo(to.x, to.y)
    g.lineTo(to.x - headlen * Math.cos(angle + Math.PI / 6), to.y - headlen * Math.sin(angle + Math.PI / 6))
    g.lineTo(to.x - x, to.y - y)
  }

  setArrowPoints (a) {
    a.points = []
    let r1 = new Rectangle(a.from.x, a.from.y, a.from.width, a.from.height)
    let fromX = a.from.x + a.from.width / 2
    let fromY = a.from.y + a.from.height / 2
    let toX = a.to.x + a.to.width / 2
    let toY = a.to.y + a.to.height / 2
    let angle = Math.atan2(toY - fromY, toX - fromX)
    a.points.push(this.getRectangleEdge(r1, angle))
    let r2 = new Rectangle(a.to.x, a.to.y, a.to.width, a.to.height)
    angle = Math.atan2(fromY - toY, fromX - toX)
    a.points.push(this.getRectangleEdge(r2, angle))
  }

  getRectangleEdge (r, angle) {
    let topRight = Math.atan((r.height / 2) / (r.width / 2))
    if (topRight < 0) {
      topRight += 2 * Math.PI
    }
    let topLeft = Math.PI - topRight
    let bottomRight = -1 * topRight + 2 * Math.PI
    let bottomLeft = -1 * topLeft + 2 * Math.PI
    let x = null
    let y = null
    if (angle < 0) {
      angle += 2 * Math.PI
    }
    if (angle >= bottomRight || angle <= topRight) {
      x = r.width / 2
      y = Math.tan(angle) * x
    } else if (angle >= topRight && angle <= topLeft) {
      y = r.height / 2
      x = y / Math.tan(angle)
    } else if (angle >= topLeft && angle <= bottomLeft) {
      x = -r.width / 2
      y = Math.tan(angle) * x
    } else if (angle >= bottomLeft && angle <= bottomRight) {
      y = -r.height / 2
      x = y / Math.tan(angle)
    }
    return new Point(r.x + r.width / 2 + x, r.y + r.height / 2 + y)
  }
}
