/// <reference types="vite/client" />
declare module '~solid-pages' {
  import { Component } from 'solid-js'
  export type RouteInfo = {
    path: string
    components: { key: string; value: Component<any> }[]
    children: RouteInfo[]
  }
  export type RouteMap = RouteInfo[]
  const res: RouteMap
  export default res
}
