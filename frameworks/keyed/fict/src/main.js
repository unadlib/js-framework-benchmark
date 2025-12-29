import { createSignal, createEffect } from 'fict'

const adjectives = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy',
]

const colors = [
  'red',
  'yellow',
  'blue',
  'green',
  'pink',
  'brown',
  'purple',
  'brown',
  'white',
  'black',
  'orange',
]

const nouns = [
  'table',
  'chair',
  'house',
  'bbq',
  'desk',
  'car',
  'pony',
  'cookie',
  'sandwich',
  'burger',
  'pizza',
  'mouse',
  'keyboard',
]

const random = max => Math.round(Math.random() * 1000) % max

let nextId = 1

const buildData = count => {
  const data = new Array(count)
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`,
    }
  }
  return data
}

const createButton = (id, text, onClick) => {
  const wrapper = document.createElement('div')
  wrapper.className = 'col-sm-6 smallpad'

  const button = document.createElement('button')
  button.id = id
  button.type = 'button'
  button.className = 'btn btn-primary btn-block'
  button.textContent = text
  button.addEventListener('click', onClick)

  wrapper.appendChild(button)
  return wrapper
}

const createRow = (row, onSelect, onRemove, selectedId) => {
  const tr = document.createElement('tr')
  if (selectedId === row.id) tr.className = 'danger'

  const idTd = document.createElement('td')
  idTd.className = 'col-md-1'
  idTd.textContent = row.id

  const labelTd = document.createElement('td')
  labelTd.className = 'col-md-4'
  const labelLink = document.createElement('a')
  labelLink.textContent = row.label
  labelLink.addEventListener('click', () => onSelect(row.id))
  labelTd.appendChild(labelLink)

  const removeTd = document.createElement('td')
  removeTd.className = 'col-md-1'
  const removeLink = document.createElement('a')
  const removeIcon = document.createElement('span')
  removeIcon.className = 'glyphicon glyphicon-remove'
  removeIcon.setAttribute('aria-hidden', 'true')
  removeLink.appendChild(removeIcon)
  removeLink.addEventListener('click', () => onRemove(row.id))
  removeTd.appendChild(removeLink)

  const fillerTd = document.createElement('td')
  fillerTd.className = 'col-md-6'

  tr.append(idTd, labelTd, removeTd, fillerTd)
  return tr
}

const main = document.getElementById('main')
main.textContent = ''

const container = document.createElement('div')
container.className = 'container'

const header = document.createElement('div')
header.className = 'jumbotron'

const headerRow = document.createElement('div')
headerRow.className = 'row'

const titleCol = document.createElement('div')
titleCol.className = 'col-md-6'
const title = document.createElement('h1')
title.textContent = 'Fict (keyed)'
titleCol.appendChild(title)

const controlsCol = document.createElement('div')
controlsCol.className = 'col-md-6'
const controlsRow = document.createElement('div')
controlsRow.className = 'row'
controlsCol.appendChild(controlsRow)

headerRow.append(titleCol, controlsCol)
header.appendChild(headerRow)

const table = document.createElement('table')
table.className = 'table table-hover table-striped test-data'
const tbody = document.createElement('tbody')
table.appendChild(tbody)

const preload = document.createElement('span')
preload.className = 'preloadicon glyphicon glyphicon-remove'
preload.setAttribute('aria-hidden', 'true')

container.append(header, table, preload)
main.appendChild(container)

const rows = createSignal([])
const selectedId = createSignal(null)

const run = () => {
  rows(buildData(1_000))
  selectedId(null)
}

const runLots = () => {
  rows(buildData(10_000))
  selectedId(null)
}

const add = () => {
  rows(rows().concat(buildData(1_000)))
}

const update = () => {
  rows(rows().map((row, idx) => (idx % 10 === 0 ? { id: row.id, label: `${row.label} !!!` } : row)))
}

const clear = () => {
  rows([])
  selectedId(null)
}

const swapRows = () => {
  const list = rows()
  if (list.length > 998) {
    const next = list.slice()
    const temp = next[1]
    next[1] = next[998]
    next[998] = temp
    rows(next)
  }
}

const remove = id => {
  rows(rows().filter(row => row.id !== id))
  if (selectedId() === id) selectedId(null)
}

const select = id => {
  selectedId(id)
}

controlsRow.append(
  createButton('run', 'Create 1,000 rows', run),
  createButton('runlots', 'Create 10,000 rows', runLots),
  createButton('add', 'Append 1,000 rows', add),
  createButton('update', 'Update every 10th row', update),
  createButton('clear', 'Clear', clear),
  createButton('swaprows', 'Swap Rows', swapRows),
)

createEffect(() => {
  const currentRows = rows()
  const currentSelected = selectedId()

  tbody.textContent = ''
  for (const row of currentRows) {
    tbody.appendChild(createRow(row, select, remove, currentSelected))
  }
})
