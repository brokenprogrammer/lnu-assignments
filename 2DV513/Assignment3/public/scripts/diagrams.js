import { DFAParser } from './dfa/dfaParser.js'
import { DFA } from './dfa/dfa.js'
import { DFAController } from './dfa/dfaController.js'
import { ClassParser } from './class/classParser.js'
import { ClassDiagram } from './class/classDiagram.js'
import { ClassController } from './class/classController.js'

let drawBtn = document.querySelector('.drawBtn')
let textArea = document.querySelector('.textArea')
let canvas = document.querySelector('.myCanvas')
let g = canvas.getContext('2d')

let objects = []

canvas.oncontextmenu = function (e) {
  e.preventDefault()
}

drawBtn.onclick = function () {
  // Removes old event listeners
  let newCanvas = canvas.cloneNode(true)
  canvas.parentNode.replaceChild(newCanvas, canvas)
  canvas = newCanvas
  canvas.oncontextmenu = function (e) {
    e.preventDefault()
  }
  g = canvas.getContext('2d')
  let str = textArea.value

  // Checks the type of diagram defined in the first line
  if (str.startsWith('<dfa>') || str.startsWith('<nfa>')) {
    let parser = new DFAParser()
    objects = parser.parse(str)
    let dfa = null
    if (str.startsWith('<dfa>')) {
      dfa = new DFA('DFA')
    } else {
      dfa = new DFA('NFA')
    }
    dfa.render(g, objects)
    let controller = new DFAController(canvas, g, objects)
    controller.listen()
  } else if (str.startsWith('<class>')) {
    let parser = new ClassParser()
    objects = parser.parse(str)
    let classDiagram = new ClassDiagram()
    classDiagram.render(g, objects)
    let controller = new ClassController(canvas, g, objects)
    controller.listen()
  }
}
