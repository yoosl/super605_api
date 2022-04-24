const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const port = 3030



app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'developer',
    password: '123456',
    database: 'super605'
})

connection.connect((err)=>{
    if(err){
        console.log('数据库连接失败')
    }
    console.log('mysql数据库连接成功')
    console.log('等待请求中...')
});



app.get('/users', (req, res) => {

    let sql = 'select * from user';
    connection.query(sql, (err, result) => {
        if (err) {
            result_body = {
                'code':1,
                'msg':'出现错误',
                'data':[]
            }
        } else {
            result_body = {
                'code':0,
                'msg':'成功',
                'count':result.length,
                'data':result
            }
            res.json(result_body)
        }
    });


})

app.get('/messages', (req, res) => {
    let sql = 'select * from message';
    connection.query(sql, (err, result)=>{
        if (err) {
            result_body = {
                'code':1,
                'msg':'出现错误',
                'data':[]
            }
        } else {
            result_body = {
                'code':0,
                'msg':'成功',
                'count':result.length,
                'data':result
            }
            res.json(result_body)
        }
    })
})

app.get('/usersAndMessages', (req, res)=>{
    console.log(req.query);
    let query = req.query
    let sql;
    if(query.limit == undefined){
        sql = 'SELECT * FROM message LEFT JOIN user on message.user_id = user.id order by message.update_date desc'
    }
    else{
        sql = 'SELECT * FROM message LEFT JOIN user on message.user_id = user.id order by message.update_date desc limit '+(parseInt(query.page)-1).toString()+','+query.limit
    }
    connection.query(sql, (err, result)=>{
        if (err) {
            result_body = {
                'code':1,
                'msg':'出现错误',
                'count': 0,
                'data':[]
            }
        } else {
            
            result_body = {
                'code':0,
                'msg':'成功',
                'count':result.length,
                'data':result
            }
            res.json(result_body)
        }
    })
})

app.post('/register', (req, res)=>{

})

app.post('/login', (req, res)=>{
    let body = req.body
    let sql = "select * from user where username='"+body.username+"' and password='"+body.password+"'"
    let result_body;
    connection.query(sql, (err, result)=>{
        if (err) {
            result_body = {
                'code':1,
                'msg':'服务器异常！',
                'data':[]
            }
        } else {
            if (result.length == 0){
                result_body = {
                    'code':2,
                    'msg':'用户名或密码错误！',
                    'data':result
                }
            }else{
                result_body = {
                    'code':0,
                    'msg':'成功',
                    'data':result
                }
            }
            
        }
        res.json(result_body)
    })

    
})


app.get('/subscriptions', (req, res)=>{
    // var mysql2 = require('./mysqlConnection')
    let sql = "SELECT subscriptions.id,name,logo_img_path,description, GROUP_CONCAT(price ORDER BY price) as prices,price_character, GROUP_CONCAT(sub_type) as types FROM subscriptions LEFT JOIN subscriptions_detail ON subscriptions.id = subscriptions_detail.sub_id GROUP BY subscriptions.id"
    let result_body;
    connection.query(sql, (err, result)=>{
        if (err) {
            result_body = {
                'code':1,
                'msg':'服务器异常！',
                'data':[]
            }
        }else{
            

            result_body = {
                'code':0,
                'msg':'成功',
                'count':result.length,
                'data':result
            }

            
        }
        res.json(result_body)
    })
    
})


app.listen(port,"0.0.0.0", () => {
  console.log(`应用程序正在监听 ${port}`)
})