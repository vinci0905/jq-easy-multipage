## 使用
```bash
cnpm i 
npm start
npm run build
```
## 组件文档
```bash
https://github.com/aralejs
https://github.com/aliceui
```
## header模块化
```bash
import '../common/header';
#include("./common/header/index.html")
```

## 模板引擎（handlebars）
```bash
import template from './file.tpl';
var context = {title: "My New Post", body: "This is my first post!"};
var html    = template(context);
```
