import { createEffect, createSignal, render } from 'fict'

type Row = {
  id: number
  label: string
}

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

const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']

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

let nextId = 1
const random = (max: number) => Math.round(Math.random() * 1000) % max

const buildData = (count: number): Row[] => {
  const data = new Array<Row>(count)
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`,
    }
  }
  return data
}

const createButton = (id: string, text: string, onClick: () => void) => {
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

const createRow = (row: Row, onSelect: (id: number) => void, onRemove: (id: number) => void, selectedId: number | null) => {
  const tr = document.createElement('tr')
  if (selectedId === row.id) tr.className = 'danger'

  const idTd = document.createElement('td')
  idTd.className = 'col-md-1'
  idTd.textContent = String(row.id)

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

function setupApp(root: HTMLElement) {
  const main = document.createElement('div')
  main.className = 'container'

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

  main.append(header, table, preload)
  root.appendChild(main)

  const rows = createSignal<Row[]>([])
  const selectedId = createSignal<number | null>(null)

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
    rows(rows().map((row, idx) => (idx % 10 === 0 ? { ...row, label: `${row.label} !!!` } : row)))
  }

  const clear = () => {
    rows([])
    selectedId(null)
  }

  const swapRows = () => {
    const list = rows()
    if (list.length <= 998) return
    const copy = list.slice()
    ;[copy[1], copy[998]] = [copy[998], copy[1]]
    rows(copy)
  }

  const remove = (id: number) => {
    rows(rows().filter(row => row.id !== id))
    if (selectedId() === id) selectedId(null)
  }

  const select = (id: number) => {
    selectedId(id)
  }

  controlsRow.append(
    createButton('run', 'Create 1,000 rows', run),
    createButton('runlots', 'Create 10,000 rows', runLots),
    createButton('add', 'Append 1,000 rows', add),
    createButton('update', 'Update every 10th row', update),
    createButton('clear', 'Clear', clear),
    createButton('swaprows', 'Swap Rows', swapRows)
  )

  createEffect(() => {
    const currentRows = rows()
    const currentSelected = selectedId()
    tbody.textContent = ''
    for (const row of currentRows) {
      tbody.appendChild(createRow(row, select, remove, currentSelected))
    }
  })
}

const App = () => <div id="app-root"></div>

const root = document.getElementById('app')
if (root) {
  render(() => <App />, root)
  const appRoot = document.getElementById('app-root')
  if (appRoot) setupApp(appRoot)
}

export default App
