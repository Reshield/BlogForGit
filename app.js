const express = require('express')
const path = require('path')
const app = new express()
const bodyParser = require('body-parser')
const session = require('express-session')
const router = require('./router')

// 配置 POST 请求体一定要在，挂载路由之前
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser,urlencodedParser)

//在 Express 这个框架中，默认不支持 Cookie 和 Session 
//但是我们可以使用第三方中间件: express-session 来解决
//1.npm install express-session
//2.配置 （一定要在 app.use(router) 之前）
//3.使用
//  当把这个插件配置好之后，我们就可以通过 req.session 来访问和设置 Session 成员
//  添加 Session 数据:req.session.foo = 'bar'
//  访问 Session 数据:req.session.foo 
//默认的 Session 数据是内存存储的，服务器一旦重启就会丢失，真正的生产环境会把 Session 进行持久化存储
app.use(session({
  //配置加密字符串，它会在原有的加密基础上和这个字符串拼起来去加密
  //目的是为了增加安全性，防止客户端恶意伪造
  secret: 'keyboard cat',//配置加密字符串，它会在原有的加密基础上和这个字符串拼起来去加密
  resave: false,
  //当设置为 true 时：无论你是否使用 Session 我都默认直接给你分配一把钥匙
  //当设置为 false 时，只有给 Session 分配数据，客户端才会获得一把钥匙
  saveUninitialized: false
}))

// path.join 用来拼接路径，例如 path.join('c:a/','b') 拼接后为 c:\\a\\b
app.use('/public/',express.static(path.join(__dirname, './public/')))
app.use('/node_modules/',express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'));
app.set('views',path.join(__dirname,'./views/'))

//把路由挂载到 app 中
app.use(router)

//配置一个处理 404 的中间件
app.use(function (req, res) {
    res.render('404.html')
})

//配置一个全局错误处理中间件
//必须有四个参数，否则参数之间会互相搞混，因为都是形参
app.use(function (err, req, res, next) {

})

app.listen(3001, function (err) {
    if (err) {
        console.log('Can not running!')
        console.log(err)
    }
    else{
        console.log('app is running in port 3000.')
    }
})