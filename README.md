# Solid项目模板

## 路由

基于`@solidjs/router`和`vite-plugin-pages`的约定式路由  
插件在`vite.custom-pages-plugin.ts` 可以自行修改

- 仅从文件结构到`routes`对象做武断映射 不考虑`solid-router`和`solid`的行为
- 文件夹名就是当前的路由名 映射规则为

1. 文件路径中不能包含单引号(')
2. `pages/` -> `'/'` 子文件夹的路由都以此为基准
3. `[id]` -> `:id` `useParams().id`可以获取到路径参数
4. `[...]` -> `*rest` `useParams().rest`可以获取到剩余的路径参数
5. 其余文件夹名会映射到同名路由

- 只有文件名为`page` `404` `error` `loading` `layout`且后缀为`.tsx`的文件会被加入路由
- 在配置中 这些文件会被这样使用

```js
// 以pages/下的文件举例
{
  path: '/',
  component: (props) => (
    <Layout>
      <ErrorBoundary
        fallback={(err, reset) => <Error err={err} reset={reset}></Error>}
      >
        <Suspense fallback={<Loading></Loading>}>{props.children}</Suspense>
      </ErrorBoundary>
    </Layout>
  ),
  children: [
    {
      path: '',
      component: Page,
    },
    //..其他的下级路由
    {
      path:'*rest',
      component: NotFound
    }
  ],
}
```

这些文件中 只有`page.tsx`是必须的  
但如果使用了`Layout` 这个组件必须接受并使用children参数  
`Error`的参数则是可选的

- 只有`pages/`下的`layout` `error` `loading`是静态导入 其余都是动态导入

## 组件库

[CUI/SoildJs](https://cui.cqb325.cn/)

## @/utils下的工具函数

- `createImmerSignal` 以immer的方式创建和变更signal
- `classnames` 使用clsx和tailwind-merge合并样式类
- `sleep` 等待指定时间

## 其他第三方库

- `zod` 类型校验
- `dayjs` 日期时间库
- `solidjs-use` 实用函数
- `lodash-es` 实用函数
- `solid-zustand` 全局状态管理 改为使用`createWithSignal`即可

## 杂项

- 路径别名 `'@'`->`'src'`
- `tailwindcss` `sass` `CSS Modules`混合使用
