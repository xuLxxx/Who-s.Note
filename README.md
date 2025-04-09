# [Who's note](https://github.com/) &middot; ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

## React + TypeScript + Vite

## Express + TypeScript + typeOrm + PostgreSQL

# What is Who's note

`Who's note`是个人学习项目。具备**高度集成组件**，封装实用函数的特点。基于 `React Router` 实现**动态路由**`，前置路由守卫，Redux` 实现状态管理。
`Who's note` is a note like website that allows users to create and share their own note posts. It is built using React, TypeScript, and Vite.
`Who's note`是一个**个人笔记网站**，**目标实现用户上传 markdown 云存储、评论和实时聊天。前端使用 React Router,Redux, Antd，大多数组件封装在 components 中。React-Markdown 解析 markdown。**

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

# 特点 Features

- **all ts & tsx** 全部由 Ts,Tsx 编写。
- 采用现代 React 编写，仅包含使用 Hooks 的函数式组件
- 多个自定义组件存放于 `components` 包中（动态菜单,Layout,自定义 Icon 组件,Markdown 组件）
- **主题切换** less 实现
- api 由 express 提供并使用 typeorm 连接 PostgreSQL 数据库
- 经实践验证、可扩展且易于理解的 Express 项目结构
- 使用经典的 Node & Vite 尽可能地构建轻量的项目，使用自定义配置 而不是使用 create-react-app，typeorm init。Custom Node & Vite setup simply without create-react-app,typeorm init.
- 使用 Redux @rematch/core 管理状态，提供了一个@rematch/core 的完整方案。
- typescript 封装 Axios,使用 LRU 缓存算法，减少重复的 Get 请求。
- multer 实现 Express 通用上传文件功能。
- 健全的 markdown 解析，支持 h1-h6,图片,链接,代码块,表格,引用,分割线,列表等。

# 评述 Observation

- 这个项目的想法是提供一个学习路线，记录着我个人的学习，是否喜欢这个项目由您个人决定。
- 这个 React 项目结构并非完全适用生产环境。我只是想练习一下 React 项目的搭建和开发。
- 其实并不需要 Redux,我只是想练习一下 Redux。完全可以通过 Simple local React state management 实现

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

管理员账号自行修改数据库的 `role` 字段为 `admin`
用户自行注册即可

# 展望

- 通过实现限制用户功能 完善 RBAC 情景
- 通过修改用户信息 完善 CRUD 情景
- 完善基于 Websocket 的实时聊天功能
- 优化 markdown 内的图片上传
- Docker 部署到服务器

# Repo Public

个人学习。不接受 PR，你有更好的想法请随意 Fork 并开发你自己的版本。Private Learning demo.Will not accept PRs. Feel free to fork and develop your own version if you have better ideas.
