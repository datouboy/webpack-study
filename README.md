# React & webpack 的学习

---

使用React开发的一个简单的照片墙，有一些简单的CSS3动画效果。
使用webpack整合打包

---

##### 环境
 1. node v5.10.1
 2. npm 3.9.0

##### 技术栈

> [webpack](http://webpack.github.io/docs/)

> [React](http://docs.reactjs-china.com/react/docs/getting-started.zh-CN.html)

---
### 截图

---

![print](./src/print/demo.jpg)

---

### 安装
项目地址：（使用`git clone`）

```shell
git clone https://github.com/datouboy/webpack-study.git
```

通过`npm`安装本地服务第三方依赖模块(需要已安装[Node.js](https://nodejs.org/))，使用npm安装依赖模块可能会很慢，建议换成[cnpm](http://cnpmjs.org/)

```shell
npm install -g cnpm --registry=http://registry.npm.taobao.org
```

### 目录结构
<pre>
.
├── README.md           
├── dist                     // 项目build目录
├── package.json             // node.js项目配置文件
├── webpack.config           // webpack配置文件
├── src                      // 生产目录
│   ├── css
│   ├── js
│   ├── images
│   ├── fonts
│   └── entry.js             // webpack入口文件
.
</pre>
