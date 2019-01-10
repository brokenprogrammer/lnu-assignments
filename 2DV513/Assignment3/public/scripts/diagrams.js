import { DFAParser } from './dfa/dfaParser.js'

let drawBtn = document.querySelector('.drawBtn')
let textArea = document.querySelector('.textArea')
let canvas = document.querySelector('.myCanvas')
let g = canvas.getContext('2d')
g.fillRect(0, 0, canvas.width, canvas.height)

let objects = []

canvas.onContextMenu = function (e) {
  e.preventDefault()
}

drawBtn.onclick = function () {
  let str = textArea.value
  console.log(objects)
  if (str.startsWith('<dfa>')) {
    console.log('dfa')
    let parser = new DFAParser()
    console.log(parser.parse(str))
  } else if (str.startsWith('<nfa>')) {
    console.log('nfa')
  } else if (str.startsWith('<class>')) {
    console.log('class')
  }
}
