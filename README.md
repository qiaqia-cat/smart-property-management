# 智慧物业管理系统

基于 Vue3 + Node.js + Express + MySQL 的前后端分离物业管理系统，面向小区物业管理场景，支持业主、管理员、维修人员三类角色协作完成报修、投诉、缴费、车位、访客、公告和消息通知等业务流程。

## 技术栈

前端：Vue3、Vite、Pinia、Vue Router、Element Plus、Axios

后端：Node.js、Express、Sequelize、MySQL、JWT、Multer

## 功能模块

- 用户登录注册：支持账号注册、登录、Token 鉴权和用户信息获取
- 多角色权限：管理员、业主、维修人员三类角色，登录后进入不同工作台
- 报修工单：业主提交报修，管理员分派维修人员，维修人员接单、完工，业主评价
- 投诉建议：业主提交投诉/建议，管理员处理并反馈结果
- 物业缴费：物业费用账单管理、缴费状态展示和提醒
- 车位管理：车辆和车位出入记录管理
- 访客登记：业主登记访客信息并生成通行记录
- 公告通知：管理员发布公告，业主端查看消息
- 后台看板：展示用户、工单、费用等关键数据
- 图片上传：支持报修图片上传和静态资源访问

## 项目亮点

- 使用 Vue Router 路由守卫实现登录校验和基于角色的页面访问控制
- 使用 Pinia 管理用户 Token 和用户信息，实现登录态持久化
- 封装 Axios 请求实例，统一处理 Token 注入、错误提示、登录过期跳转和异常响应
- 后端基于 Express + Sequelize 分层组织 Controller、Service、Model，便于维护和扩展
- 基于 JWT 实现接口鉴权，并通过中间件控制管理员和维修人员接口权限
- 报修模块包含提交、分派、接单、完工、评价、撤销等完整状态流转

## 目录结构

```text
property-manage-system/
├── client/          # Vue3 前端项目
├── server/          # Node.js / Express 后端项目
├── .gitignore
└── README.md
```

## 本地运行

### 1. 准备数据库

请先在本地 MySQL 中创建数据库：

```sql
CREATE DATABASE property_manage_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 配置后端环境变量

复制 `server/.env.example` 为 `server/.env`，并按本地 MySQL 配置修改：

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=property_manage_system
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=replace_with_a_long_random_secret
```

### 3. 启动后端

```bash
cd server
npm install
npm run seed
npm run dev
```

后端默认运行在：`http://localhost:3000`

### 4. 启动前端

```bash
cd client
npm install
npm run dev
```

前端默认运行在 Vite 输出的本地地址，例如：`http://localhost:5173`

## 测试账号

初始化数据脚本会创建以下测试账号：

| 角色 | 用户名 | 密码 |
| --- | --- | --- |
| 管理员 | admin | 123456 |
| 业主 | owner1 | 123456 |
| 维修人员 | worker1 | 123456 |

## 简历描述参考

智慧物业管理系统｜Vue3、Vite、Pinia、Vue Router、Element Plus、Axios、Node.js、Express、Sequelize、MySQL、JWT

面向小区物业管理场景的前后端分离系统，支持业主、管理员、维修人员三类角色。负责前端页面开发、路由权限控制、Pinia 登录态管理、Axios 请求封装，以及 Node.js + Express 后端接口联调；实现报修工单、投诉处理、物业缴费、车位管理、访客登记、公告通知等模块，其中报修工单覆盖提交、分派、接单、完工、评价等完整业务流程。
## 版权与使用声明

本项目为作者个人学习与求职展示项目，版权归作者本人所有。

欢迎 HR、面试官、招聘方以评估作者技术能力查看本项目代码。

未经作者明确许可，禁止将本项目或其代码用于以下用途：

1. 作为个人求职项目、简历项目、作品集项目进行展示；
2. 作为课程设计、实训作业、毕业设计、竞赛作品等提交；
3. 复制、修改后冒充为本人原创项目；
4. 用于任何商业用途或其他未经授权的用途。



© 2026 qiaqia-cat. All rights reserved.