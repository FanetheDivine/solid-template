/* @refresh reload */
import { ParentProps } from 'solid-js'
import { render, Suspense, ErrorBoundary } from 'solid-js/web'
import { Router } from '@solidjs/router'
import 'cui-solid/dist/styles/cui.css'
import getRouteMap from '~solid-pages'
import './index.css'

function convertRoutesMap(routeMap: any[]) {
  routeMap.forEach((item) => {
    if (item.isWrapper) {
      const { Loading, Error, Layout } = item.component
      item.component = (props: ParentProps) => {
        let res = null
        if (Loading) {
          res = () => (
            <Suspense fallback={<Loading />}>{props.children}</Suspense>
          )
        }
        if (Error) {
          const _res = res
          res = () => (
            <ErrorBoundary
              fallback={(err, reset) => <Error err={err} reset={reset} />}
            >
              {_res ? _res() : props.children}
            </ErrorBoundary>
          )
        }
        if (Layout) {
          const _res = res
          res = () => <Layout>{_res ? _res() : props.children}</Layout>
        }
        return res?.()
      }
    }
    if (item.children) convertRoutesMap(item.children)
  })
  return routeMap
}

const routes = convertRoutesMap(getRouteMap())
console.log(routes)
const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(() => <Router>{routes}</Router>, root!)
