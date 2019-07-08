function makeCleanID (txt) {
  console.log(txt)
  return txt
    .normalize('NFD')
    .toLowerCase()
    .replace(/[^a-z ]+/g, '')
    .trim()
    .replace(/ +/g, '-')
}

function getHeaderList () {
  return Array.from(document.querySelectorAll('h1,h2'))
    .map(node => {
      const txt   = node.innerText.trim().replace(/<(.*?)>/g, '&lt;$1&gt;')
      const id    = makeCleanID(node.innerText)
      const label = node.nextElementSibling.innerText.trim()
      const type  = node.nodeName.toLowerCase()

      node.parentElement.id = id;

      return  { id, type, txt, label }
    })
}

window.addEventListener('DOMContentLoaded', () => {
  const headers = getHeaderList()

  document.body.insertAdjacentHTML('afterbegin', `
    <nav>
      <ol>
        ${headers.map(({id, type, txt, label}) => `
          <li class="${type}">
            <a href="#${id}" title="${label}">${txt}</a>
          </li>
        `).join('')}
      </ol>
    </nav>
  `)
})

window.addEventListener('click', (e) => {
  if (!e.target.matches('nav')) { return }

  e.target.querySelector('a').focus()
})
