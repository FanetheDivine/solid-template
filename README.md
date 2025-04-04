# Solid项目模板

## 路由

基于`@solidjs/router`和`vite-plugin-pages`的约定式路由 规则如下

- 只有`.tsx`会被视为路由
- `components` `utils` `api`下的文件不会被视为路由
- `/about/index.tsx`或`/about.tsx`-> `/about`
- `/[id].tsx`或`/[id]/index.tsx`-> `/:id`
- `[..arr]`捕获剩余的路径参数 不能匹配无路径参数的情况 `[...arr]`则可以
- 没有嵌套路由

## 组件库

[CUI/SoildJs](https://cui.cqb325.cn/)

## @/utils下的工具函数

- `createImmerSignal` 以immer的方式创建和变更signal
- `classnames` 使用clsx和tailwind-merge合并样式类

## 其他第三方库

- `zod` 类型校验
- `dayjs` 日期时间库
- `solidjs-use` 实用函数

## 杂项

- 路径别名 `'@'`->`'src'`
- `tailwindcss` `sass` `CSS Modules`混合使用
