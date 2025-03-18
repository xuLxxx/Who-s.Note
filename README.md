# [Who's note](https://github.com/) &middot; ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

## React + TypeScript + Vite

## Express + TypeScript + typeOrm + PostgreSQL

# What is Who's note

`Who's note`是个人学习项目，项目结构模仿 Ruoyi 等后台管理系统。同时具备**高度集成组件**，封装实用函数的特点。基于 `React Router` 实现**动态路由**`，前置路由守卫，Redux` 实现状态管理。
`Who's note` is a note like website that allows users to create and share their own note posts. It is built using React, TypeScript, and Vite.
`Who's note`是一个**类博客网站**，**目标实现用户上传 markdown、评论和实时聊天。前端使用 React React Router Redux,UI 使用 Antd，并大多数组件放在 components 中。MarkDown 使用 React-Markdown 进行解析。**

# 如何初始化 Setup 

To run the application, follow these steps:

1. Clone the repository.
2. Install the dependencies: `cd api && npm install`
3. Start the development server: `npm run dev`
4. Install the dependencies: `cd ../client && npm install`
5. Start the development server: `npm run dev`

在 Install 之前在`api`目录下创建`.env`文件，内容如下：

```
PORT=....
DB_HOST=....
DB_PORT=....
DB_USERNAME=....
DB_PASSWORD=....
DB_DATABASE=....
JWT_SECRET=....
```

# 特点

- **all ts & tsx** including api & client
- 大部分组件都存放于 `components` 包中（动态菜单,Layout,自定义 Icon 组件,Markdown 组件）
- **主题切换** less 实现
- api 由 express 提供并使用 typeOrm 连接 PostgreSQL 数据库
- 学习了漂亮的 Express 项目结构
- Custom Node,Vite setup without create-react-app , typeorm init 从零开始使用 Node Vite 构建项目而不是使用 create-react-app，快速的 typeorm 初始化项目

# 缺点

- It's not a modern,real world react demo.I Just want to learn doing with react.这不是一个现代的、生产可用的 React 项目,这只是我个人的第一个 React 学习项目。
- 因为它缺少完美的 Hooks。
- 部分功能的实现其实并不需要 Redux,我只是想练习一下 Redux。完全可以通过 Simple local React state management 实现

# 技术栈

- React
- TypeScript
- Vite
- WebSocket
- React Router
- Redux @rematch/core
- Axios
- Antd
- React-Markdown
- less

# 如何使用

管理员账号: admin 123546
用户自行注册即可

# 完善 Todo

- 通过限制用户功能完善 RBAC 情景
- 通过修改用户信息完善 CRUD 情景
- 完善基于 Websocket 的实时聊天功能
- 优化 markdown 内的图片上传
- Docker 部署到服务器

# Repo public

个人学习。不接受 PR，你有更好的想法请随意 Fork 并开发你自己的版本。Private Learning demo.Will not accept PRs. Feel free to fork and develop your own version if you have better ideas.
