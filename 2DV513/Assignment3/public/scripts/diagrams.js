import { DFAParser } from './dfa/dfaParser.js'
import { DFA } from './dfa/dfa.js'
import { DFAController } from './dfa/dfaController.js'

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
  g = canvas.getContext('2d')
  let str = textArea.value

  // Checks the type of diagram defined in the first line
  if (str.startsWith('<dfa>')) {
    console.log('dfa')
    let parser = new DFAParser()
    objects = parser.parse(str)
    let dfa = new DFA()
    dfa.render(g, objects)
    let controller = new DFAController(canvas, g, objects)
    controller.listen()
  } else if (str.startsWith('<nfa>')) {
    console.log('nfa')
  } else if (str.startsWith('<class>')) {
    console.log('class')
  }
}
