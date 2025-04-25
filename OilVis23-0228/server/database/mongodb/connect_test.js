
var MongoClient = require('mongodb').MongoClient;
const dbConnectionUrl = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(dbConnectionUrl, {
  useUnifiedTopology: true,
});

client.connect(function(err, db){
    console.log('connect successful ')
    // if(!err)
    // {
    //     console.log('connect successful')
    //     var dbase = db.db("labtest")
    //     dbase.collection('test').find().toArray(function(err,result){
    //         console.log('查询结果',result)
    //     })
    // }else{
    //     console.log(err)
    // }
})