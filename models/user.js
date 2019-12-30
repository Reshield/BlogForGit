const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are collected!')
});
const Schema = mongoose.Schema

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        //注意：这里不要写 Date.now() 因为这个方法会在编译得时候就立即调用
        //而我们需要的是在创建用户的时候才获取时间
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        //注意：这里不要写 Date.now() 因为这个方法会在编译得时候就立即调用
        //而我们需要的是在创建用户的时候才获取时间
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/img/avatar-default.png'
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1]
    },
    birthday: {
        type: Date
    },
    status: {
        type: Number,
        //0 没有权限限制
        //1 不可以评论
        //2 不可以登录
        enum: [0, 1, 2],
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)