const express = require('express')
const app = express()
const blogRouter = require('./router/blogRouter')
const session = require("express-session")
const bodyParser = require("body-parser");
const middlewareUtil = require("./middlewares/middlewareUtil");
const passport = middlewareUtil.passport;
app.use(express.static("public"));
app.use(session({secret: "cats"}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/rest/login',(req,res,next)=>{
    if(req.isAuthenticated()){
        return res.json({status:'success'});
    }else{
        next();
    }
},passport.authenticate('local'),(req,res) =>{
    res.json({status:'success'});
});
app.get('/rest/logout',function (req,res) {
    req.logout();
    res.json({status:'success'});
})

app.use('/rest/blog', blogRouter)
app.listen(3000, () => console.log('Example app listening on port 3000!'))