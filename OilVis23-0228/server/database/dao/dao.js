var MongoClient = require('mongodb').MongoClient;
class DAO{
    constructor(url,dbName,collectionName){
        this.url=url;
        this.dbName=dbName;
        this.collectionName=collectionName;
        //this.column=column;
    }
    _connect(){
        return new Promise((resolve,reject)=>{
            MongoClient.connect(this.url,{useUnifiedTopology:true},(err,client)=>{
                if(err){
                    return reject(err);
                }
                console.log('数据库连接成功！')
                resolve(client);
            })
        })
    }
    insert(obj,isMany){
        return new Promise((resolve,reject)=>{
            this._connect().then(client=>{
                let db=client.db(this.dbName);
                if(isMany){
                    db.collection(this.collectionName).insertMany(obj).then(res=>{
                        resolve(res);
                        client.close();
                    })
                }
                else{
                    db.collection(this.collectionName).insertOne(obj).then(res=>{
                        resolve(res);
                        client.close();
                    })
                }
            })
        })
    }
    delete(obj,isMany){
        return new Promise((resolve,reject)=>{
            this._connect().then(client=>{
                let db=client.db(this.dbName);
                if(isMany){
                    db.collection(this.collectionName).deleteMany(obj).then(res=>{
                        resolve(res);
                        client.close();
                    })
                }
                else{
                    db.collection(this.collectionName).deleteOne(obj).then(res=>{
                        resolve(res);
                        client.close();
                    })
                }
            })
        })
    }
    query(obj,column){
        obj=obj||{};
        let arr=[];
        return new Promise((resolve,reject)=>{
            console.log('111')
            this._connect().then(client=>{
                console.log('query')
                let db=client.db(this.dbName);
                db.collection(this.collectionName).find({},column).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        //console.log(result);
                        resolve(result);
                        client.close();
                    }
                });
                //let queryRes=db.collection(this.collectionName).find(obj);
                // console.log(queryRes);
                // queryRes.each((err,data)=>{
                //     if(data!=null){
                //         arr.push(data)
                //     }else{
                //         resolve(arr)
                //     }
                // })
                // client.close()
            })
        })
    }
}
module.exports=DAO
