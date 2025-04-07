import Pages, { PageContext } from 'vite-plugin-pages'

/** 把生成的文件打印到控制台 */
const ConsoleResult = false

const legalFileNames = ['page', '404', 'loading', 'error', 'layout']

const getComputedRoutes = (ctx: PageContext) => {
  /**
   * src所处的目录
   * @example '/workspaces/solid-template'
   */
  const root = ctx.root
  /**
   * Map类型 key是所有src/pages下的所有.tsx文件的绝对路径
   * 例如'/workspaces/solid-template/src/pages/page.tsx'
   */
  const pageRouteMap = ctx.pageRouteMap
  const paths = [...pageRouteMap.keys()]
    .map((path) => path.replaceAll(root, ''))
    .filter((path) =>
      legalFileNames.some((name) => path.endsWith(`${name}.tsx`)),
    )
  paths.forEach((path) => {
    if (path.includes("'")) throw new Error(`${path}文件路径不能包含单引号(')`)
  })
  const fileStructure = getFileStructure(paths)
  const routes = getRoutesFromFileStructure(fileStructure)
  return [routes]
}
const resolveRoutes = (ctx: PageContext) => {
  const routes = getComputedRoutes(ctx)
  const baseImport = ["import { lazy } from 'solid-js';"]
  const { routeImports, stringRoutes } = convertStringRoutes(routes)
  const importCodes = Array.from(routeImports.values())
    .map((item) => item.code)
    .toSorted((code1, code2) => {
      const [num1, num2] = [code1, code2].map((code) =>
        code.startsWith('import') ? 0 : 1,
      )
      return num1 - num2
    })
  const codes = [
    ...baseImport,
    ...importCodes,
    `const routeMap = ${stringRoutes};`,
    'export default routeMap',
  ]
  const fileContent = codes.join('\n')
  if (ConsoleResult) console.log(fileContent)
  return fileContent
}
export const CustomPagesPlugin = Pages({
  resolver: {
    resolveModuleIds: () => ['~solid-pages'],
    resolveExtensions: () => ['tsx'],
    resolveRoutes,
    getComputedRoutes,
  },
})

type Directory = {
  dirName: string
  /** fileName=>path */
  files: Map<string, string>
  /** dirName=>dir */
  children: Map<string, Directory>
}
/** 根据路径数组创建文件结构 */
function getFileStructure(paths: readonly string[]) {
  const fileStructure: Directory = {
    dirName: '/',
    files: new Map(),
    children: new Map(),
  }
  paths.forEach((path) => {
    const pathSplitList = path.replace('/src/pages', '').split('/')
    const dirNames = pathSplitList.slice(0, -1)
    const fileName = pathSplitList.at(-1)!.replace('.tsx', '')
    let currentDir = fileStructure
    let currentIndex = 1
    while (currentIndex < dirNames.length) {
      const dirName = dirNames[currentIndex]
      if (!currentDir.children.has(dirName)) {
        currentDir.children.set(dirName, {
          dirName,
          files: new Map(),
          children: new Map(),
        })
      }
      currentDir = currentDir.children.get(dirName)!
      ++currentIndex
    }
    currentDir.files.set(fileName, path)
  })
  return fileStructure
}

type Route = {
  path: string
  /** 剩余参数、动态参数、静态参数 */
  pathType: 'rest' | 'dynamic' | 'common'
  children: Route[]
  type: 'wrapper' | 'page' | '404'
  components: Map<string, string>
}

/** 根据文件结构创建路由 */
function getRoutesFromFileStructure(fileStructure: Directory) {
  const { path, pathType } = getPathFromDirName(fileStructure.dirName)
  const route: Route = {
    path,
    pathType,
    type: 'wrapper',
    components: fileStructure.files,
    children: [],
  }

  if (fileStructure.files.get('page')) {
    route.children.push({
      path: '',
      pathType: 'common',
      type: 'page',
      components: fileStructure.files,
      children: [],
    })
  }
  // 按照 普通路由、动态参数、剩余参数排序
  const childrenRoutes = [...fileStructure.children.values()]
    .map(getRoutesFromFileStructure)
    .toSorted((route1, route2) => {
      const map = {
        common: 1,
        dynamic: 2,
        rest: 3,
      }
      const num1 = map[route1.pathType]
      const num2 = map[route2.pathType]
      return num1 - num2
    })

  route.children.push(...childrenRoutes)
  if (fileStructure.files.get('404')) {
    route.children.push({
      path: '*rest',
      pathType: 'rest',
      type: '404',
      components: fileStructure.files,
      children: [],
    })
  }
  return route
}
/** 将文件夹名转化路由path */
function getPathFromDirName(dirName: string): {
  path: string
  pathType: 'rest' | 'dynamic' | 'common'
} {
  if (dirName === '[...]') return { path: '*rest', pathType: 'rest' }
  // [id] => :id
  const res = /^\[(.+)\]$/.exec(dirName)
  if (res?.[1]) return { path: `:${res[1]}?`, pathType: 'dynamic' }
  return { path: dirName, pathType: 'common' }
}

type RouteImports = Map<
  string,
  {
    code: string
    target: string
  }
>
/** 将路由转化为JS代码 */
function convertStringRoutes(routes: Route[], routeImports?: RouteImports) {
  /** path=>import信息 */
  const currentRouteImports: RouteImports = routeImports ?? new Map()
  const stringRoutes =
    '[' +
    routes
      .map((route) => convertStringRoute(route, currentRouteImports))
      .filter(Boolean)
      .join(',') +
    ']'
  return {
    routeImports: currentRouteImports,
    stringRoutes,
  }
}

/** 将其中一项路由转化为JS代码 */
function convertStringRoute(route: Route, routeImports: RouteImports): string {
  return (
    '{' +
    [
      `path:'${route.path}'`,
      convertStringRouteComponent(route, routeImports),
      convertStringRouteChildren(route, routeImports),
    ]
      .filter(Boolean)
      .join(',') +
    '}'
  )
}

/** 将一项路由的children转化为JS代码 */
function convertStringRouteChildren(route: Route, routeImports: RouteImports) {
  return `children:${convertStringRoutes(route.children, routeImports).stringRoutes}`
}

/** 将一项路由的component转化为JS代码 */
function convertStringRouteComponent(route: Route, routeImports: RouteImports) {
  const componentKeys = (() => {
    switch (route.type) {
      case 'wrapper':
        return ['layout', 'error']
      case 'page':
        return ['loading', 'page']
      case '404':
        return ['404']
    }
  })()
  const mode = getImportMode(route)
  const components = componentKeys
    .map((key) => ({ key, filePath: route.components.get(key) }))
    .filter((item) => item.filePath)
    .map(
      (item) =>
        `{key:'${item.key}',value: ${convertImportCode(mode, item.filePath!, routeImports)}}`,
    )
  return `components:[${components.join(',')}]`
}

type ImportMode = 'sync' | 'async'

/** 获取导入语句 */
function convertImportCode(
  mode: ImportMode,
  filePath: string,
  routeImports: RouteImports,
) {
  if (!routeImports.has(filePath)) {
    const target = `Target${routeImports.size}`
    const code =
      mode === 'sync'
        ? `import ${target} from '${filePath}';`
        : `const ${target} = lazy(()=>import('${filePath}'));`
    routeImports.set(filePath, { code, target })
  }
  const target = routeImports.get(filePath)!.target
  return `${target}`
}

/** 导入策略
 * '/'路径的layout error loading才会被静态导入
 */
function getImportMode(route: Route): ImportMode {
  if (route.path === '/' && route.type === 'wrapper') {
    return 'sync'
  }
  return 'async'
}
