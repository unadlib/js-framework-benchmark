import { $state, render } from 'fict'

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
const random = max => Math.round(Math.random() * 1000) % max

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

const Button = ({ id, title, onClick }) => (
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id={id} onClick={onClick}>
      {title}
    </button>
  </div>
)

const Row = ({ isSelected, item, select, remove }) => (
  <tr class={isSelected ? 'danger' : ''}>
    <td class="col-md-1">{item.id}</td>
    <td class="col-md-4">
      <a onClick={() => select(item.id)}>{item.label}</a>
    </td>
    <td class="col-md-1">
      <a onClick={() => remove(item.id)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true" />
      </a>
    </td>
    <td class="col-md-6" />
  </tr>
)

const Main = () => {
  let items = $state([])
  let selected = $state(0)

  const run = () => {
    items = buildData(1_000)
    selected = 0
  }

  const runLots = () => {
    items = buildData(10_000)
    selected = 0
  }

  const add = () => {
    items = items.concat(buildData(1_000))
  }

  const clear = () => {
    items = []
    selected = 0
  }

  const update = () => {
    const updated = items.slice()
    for (let i = 0; i < updated.length; i += 10) {
      const r = updated[i]
      updated[i] = { id: r.id, label: `${r.label} !!!` }
    }
    items = updated
  }

  const swapRows = () => {
    if (items.length < 999) return
    const swapped = items.slice()
    ;[swapped[1], swapped[998]] = [swapped[998], swapped[1]]
    items = swapped
  }

  const remove = id => {
    items = items.filter(item => item.id !== id)
    if (selected === id) selected = 0
  }

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Fict (keyed)</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" title="Create 1,000 rows" onClick={run} />
              <Button id="runlots" title="Create 10,000 rows" onClick={runLots} />
              <Button id="add" title="Append 1,000 rows" onClick={add} />
              <Button id="update" title="Update every 10th row" onClick={update} />
              <Button id="clear" title="Clear" onClick={clear} />
              <Button id="swaprows" title="Swap Rows" onClick={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          {items.map(item => (
            <Row key={item.id} item={item} isSelected={selected === item.id} select={id => (selected = id)} remove={remove} />
          ))}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  )
}

render(() => <Main />, document.getElementById('main'))
