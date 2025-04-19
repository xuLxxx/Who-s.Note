# [Who's note](https://github.com/) &middot; ![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

## React + React Native + Express + TypeScript + TypeORM

# What is Who's note

`Who's note`是个人学习项目。具备**高度集成组件**特点。Web 端使用 `React` 。移动端使用 `React Native` 。分别使用 Redux `@rematch/core` `@toolkit` 实现状态管理。路由使用 `React Router`，`expo-router`。
`Who's note`是一个**个人笔记网站**，**主题切换，解析 markdown,上传 markdown,用户可以在日历中增删改事件**

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

- **all ts & tsx** 全部由 ts,tsx 编写。
- 采用现代 React 编写，使用仅包含 Hooks 的函数式组件
- 大量自定义组件存放于 `components` 包中（动态菜单,Layout,自定义 Icon 组件,Markdown 组件）
- **主题切换** less 实现
- api 由 express 提供并使用 typeorm 连接 PostgreSQL 数据库
- 经实践验证、可扩展且易于理解的 Express 项目结构
- 使用经典的 Node & Vite 尽可能地构建轻量的项目，使用自定义配置 而不是使用 create-react-app，typeorm init。Custom Node & Vite setup simply without create-react-app,typeorm init.
- React 使用 Redux @rematch/core 管理状态，RN 使用 Redux @toolkit 分别提供了一个完整的学习 Redux 样例。
- 封装 Axios,选择性使用 LRU 缓存算法来减少重复的 Get 请求。
- multer 实现 Express 通用上传文件功能。
- 健全的 markdown 解析，支持 h1-h6,图片,链接,代码块,表格,引用,分割线,列表等。
- React Native 使用官方推荐的 expo 框架搭建。

# 评述 Observation

- 这个项目的想法是提供一个学习路线，记录着我个人的学习，这个项目并不能媲美任何其他项目。
- 其实并不需要 Redux,我只是想练习一下 Redux。完全可以通过 Simple local React state management 实现
- 大多数的功能实现并不适合生产环境
- 一个简单但尽可能完整的 React Native

# 技术选型 Tech Stack

- React Axios Antd React Router Vite
- React Native Expo
- TypeScript
- Express TypeOrm PostgresSQL WebSocket
- Redux @rematch/core in React
- Redux @toolkit in React Native
- React-Markdown & React-Native-Marked

# 展望 | 未完成 | Future & Not Done Yet

- 通过实现限制用户功能 完善 RBAC 情景
- 通过修改用户信息 完善 CRUD 情景
- 完善基于 Websocket 的实时聊天功能、评论和实时聊天功能
- 优化 markdown 内的图片上传
- Docker 部署到服务器完成云存储等功能
- React-Native Markdown 无法实现生成目录。
- 认为可以使用 CodeMirror unified 实现 更强悍 的 Web-Markdown 功能

# Repo Public

个人学习项目。不接受 PR，你有更好的想法随意 Fork 或 Clone 开发你自己的版本。
Private Learning demo.Will not accept PRs. Feel free to fork and develop your own version if you have better ideas.
