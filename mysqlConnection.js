var mysql = require('mysql');
var exports=module.exports;
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


exports.findSubscriptionsDetail = function(id, callback){
    var inner_sql = "select * from subscriptions_detail where sub_id=" + id

    connection.query(inner_sql, (err, inner_result)=>{
                    
        inner_result = JSON.stringify(inner_result)
        inner_result = JSON.parse(inner_result)
            
        callback(inner_result)
        
    });
}