const express = require('express')
const router = express.Router()
const User = require('./models/user')
const md5 = require('blueimp-md5')

router.get('/',function (req, res) {
    res.render('index.html',
    {
        user: req.session.user
    })
})

router.get('/login',function (req, res) {
    res.render('login.html')
})

router.post('/login',function (req, res) {
    //1.获取表单数据
    //2.查询数据库用户名密码是否正确
    //3.发送响应数据
    var body = req.body
    User.findOne(
        {
            email: body.email,
            password: md5(md5(body.password))
        },
        function(err, user) {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: err.message,
                    err_code: 1
                })
            }
            else if(!user) {
                res.status(200).json({
                    success: true,
                    message: 'Email or Password invalid!',
                    err_code: 1
                })
            }
            else {
                req.session.user = user
                res.status(200).json({
                    success: true,
                    message: 'ok',
                    err_code: 0
                })
            }
        }
    )
})

router.get('/register',function (req, res) {
    res.render('register.html')
})

router.post('/register',function (req, res) {
    //1.获取表单提交数据
    //2.操作数据库
    //  判断该用户是否存在
    //  如果已存在，不允许注册
    //  如果不存在，注册
    //3.发送响应
    let body = req.body
    User.findOne({
        $or: [
            { email: body.email },
            { nickname: body.nickname }
        ]
    },function (err, result) {
        if (err) {
            res.status(500).json({
                success: false,
                err_code: 500,
                message: 'Server Error'
            })
        }
        else if (result) {
            res.status(200).json({
                success: true,
                err_code: 1,
                message: 'email and nickname already exists!'
            })
        }
        else{
            body.password = md5(md5(body.password))
            new User(body).save(function (err, user) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        err_code: 500,
                        message: 'Internal Error'
                    })
                }
                else {
                    //注册成功，使用 Session 记录用户的登录状态
                    req.session.user = user

                    res.status(200).json({
                        success: true,
                        err_code: 0,
                        message: 'ok'
                    })
                }
            })
        }
    })
})

router.get('/logout', function (req, res) {
    //清楚登录状态
    req.session.user = null

    //重定型到登录页
    res.redirect('login')
})

module.exports = router