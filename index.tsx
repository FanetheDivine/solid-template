/* @refresh reload */
import { Component } from 'solid-js'
import { render, Suspense, ErrorBoundary } from 'solid-js/web'
import { RouteDefinition, Router } from '@solidjs/router'
import routeMap, { type RouteMap } from '~solid-pages'
import './index.css'
import './leafer-component'

function getRoutes(): RouteDefinition[] {
  function convertRouteMap(routeMap: RouteMap): RouteDefinition[] {
    const res = routeMap.map((item) => {
      return {
        path: item.path,
        component: createComboComp(item.components),
        children: convertRouteMap(item.children),
      }
    })
    return res
  }
  const routes = convertRouteMap(routeMap)
  return routes
}

const routes = getRoutes()
console.log(routes)
const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(() => <Router>{routes}</Router>, root!)

/**
 * 做如下转换
 * [Comp1,Comp2] -> props=><Comp1><Comp2>{props.children}</Comp2><Comp1>
 * 对于key为loading的组件 使用Suspense
 * 对于key为error的组件 使用ErrorBoundary
 */
function createComboComp(
  comps: { key: string; value: Component<any> }[],
): Component<any> | undefined {
  let ResultComp: Component<any> | undefined = undefined
  comps.forEach((item) => {
    let CurrentComp: Component<any>
    if (item.key === 'error') {
      const _Comp = item.value
      CurrentComp = (props) => (
        <ErrorBoundary
          fallback={(err, reset) => <_Comp err={err} reset={reset} />}
        >
          {props.children}
        </ErrorBoundary>
      )
    } else if (item.key === 'loading') {
      const _Comp = item.value
      CurrentComp = (props) => (
        <Suspense fallback={<_Comp />}>{props.children}</Suspense>
      )
    } else {
      CurrentComp = item.value
    }
    if (ResultComp) {
      const TempComp = ResultComp
      ResultComp = (props) => (
        <TempComp>
          <CurrentComp>{props.children}</CurrentComp>
        </TempComp>
      )
    } else {
      ResultComp = CurrentComp
    }
  })
  return ResultComp
}
