/* @refresh reload */
import { render, Suspense } from 'solid-js/web'
import { Router } from '@solidjs/router'
import 'cui-solid/dist/styles/cui.css'
import routes from '~solid-pages'
import './index.css'

console.log(routes)
const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(
  () => (
    <Router root={(props) => <Suspense>{props.children}</Suspense>}>
      {routes}
    </Router>
  ),
  root!,
)
