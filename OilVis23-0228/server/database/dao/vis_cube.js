const e = require('express');

const MongoClient = require('mongodb').MongoClient;
class vis_cube{
    //库名、集合名
    constructor(dbname,colectionname,flag){
        this.flag = flag
        this.dbName=dbname;
        this.collectionName=colectionname;
        this.url = `mongodb://127.0.0.1:27017/${this.dbName}`

        this.client = new MongoClient(this.url,{
            useNewUrlParser:true
        })
        this.client.connect(err=>{
            if(err) throw err
            // console.log('链接成功')
        })
    }
    setdbAndcolName(dbname,collectionname){
        if(dbname!=this.dbName){
            this.client.close()
            this.dbName=dbname;
            // this.collectionName=collectionname;
            this.url = `mongodb://127.0.0.1:27017/${this.dbName}`
            
            this.client = new MongoClient(this.url,{
                useNewUrlParser:true
            })
            this.client.connect(err=>{
                if(err) throw err
                // console.log('链接成功')
            })
        }
        this.collectionName=collectionname;
    }
    setcollectionName(colectionname){
        this.collectionName=colectionname;
    }
    _connect(){
        return new Promise((resolve,reject)=>{
            MongoClient.connect(this.url,{useUnifiedTopology:true},(err,client)=>{
                if(err){
                    return reject(err);
                }
                // console.log('数据库连接成功！')
                resolve(client);
            })
        })
    }

//新增，查找准确率
vis_findzql(gkname){
    return new Promise((resolve,reject)=>{
        
        let db = this.client.db(this.dbname)
        // console.log(this.dbname,this.collectionName)
        db.collection(this.collectionName).find({gk_name:gkname}).toArray(function(err,result){
            
            // console.log('hhhh')
            if(err){
                throw err;
            }
                resolve(result);
            
        })
       
           
        
    })
}
vis_sure_zql(gkname){
    // console.log('确认准确率')
    return new Promise((resolve,reject)=>{
        
        // resolve('queren zhunquelv ')
        let db = this.client.db(this.dbname)
        db.collection(this.collectionName).update({gk_name:gkname},{$inc:{'confirm_time':1}})
        db.collection(this.collectionName).find({gk_name:gkname}).toArray(function(err,result){
            if(err){
                throw err;
            }
            else{
                resolve(result);
               
                   
                
            }
        })
        
    })
}
vis_error_zql(gkname){
    return new Promise((resolve,reject)=>{
        // console.log('修改准确率')
        
        let db = this.client.db(this.dbname)
        db.collection(this.collectionName).update({gk_name:gkname},{$inc:{'edit_time':1}})
        db.collection(this.collectionName).find({gk_name:gkname}).toArray(function(err,result){
            if(err){
                console.log('修改准确率错误')
                throw err;
            }
            else{
                resolve(result);
            }
        })
       
           
        
    })
}
//新增，工况统计
vis_gkstatis(){
    return new Promise((resolve,reject)=>{
        
        
        let db = this.client.db(this.dbname)
        var gkname = ['阀门内漏','开关阀','甩泵','清管']
        db.collection(this.collectionName).find().toArray(function(err,result){
            if(err){
                console.log('工况统计错误')
                throw err;
            }
            else{
                resolve(result);
            }
        })
       
           
        
    })
}
    vis_newoilfind(){
        return new Promise((resolve,reject)=>{
            
            let db = this.client.db(this.dbname)
            db.collection(this.collectionName).find().toArray(function(err,result){
                if(err){
                    throw err
                }else{
                    resolve(result)
                }
            })
           
               
            
        })
    }
    //查找整个表----参数（开始时间、结束时间、参数数组）
    vis_oilfindBy_timeandobj(starttime,overtime,obj){
        // console.log('查询参数：',starttime,overtime,obj)
        // console.log('表名：',this.collectionName)
        return new Promise((resolve,reject)=>{
            
            let db = this.client.db(this.dbname)
            var name = {}
            for(var i=0;i<obj.length;i++)
            {
                name[obj[i]]=1
            }
            // name['id']=0
            // console.log('参数名：',name)   //此处的时间值为Time
            // console.log('sday',starttime[2])
            // console.log('eday',overtime[2])
            var sday = starttime[2]
            var oday = overtime[2]

            // starttime overtime
            let s_date = new Date(starttime).toISOString()
            let e_date = new Date(overtime).toISOString()
            // console.log('时间：',new Date(s_date),new Date(e_date))
            db.collection(this.collectionName).find({"time":{"$gt":new Date(s_date),"$lt":new Date(e_date)}},{projection:name}).toArray(function(err,result){
                if(err){
                    console.log('error')
                    throw err;
                }
                else{
                    resolve(result);
                }
            })
           
               
            
            // db.collection(this.collectionName).find({
            //     // year:{$gt:`${starttime0]}`,$lt:`${overtime[0]}`}
            //     // month:{$gt:`${starttie[1]}`,$lt:`${overtime[1]}`}
            //     "day":{$gte:sday,$lte:oday}
            // },{projection:name}).toArray(function(err,result){
            //     if(err){
            //         console.log('error')
            //         throw err;
            //     }
            //     else{
            //         resolve(result);
            //         // console.log('sql结果：',result)
            //         client.close();
            //     }
            // })
        }) 
    }
    //查找整个表----参数（参数数组）
    vis_oilfind(){
        return new Promise((resolve,reject)=>{
            
            let db = this.client.db(this.dbname)
                //console.log('参数名：',name)
            db.collection(this.collectionName).find().toArray(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    resolve(result);
                }
            })
           
               
            
        })  
    }

    //新增
    vis_oilfinddatalen(){
        return new Promise((resolve,reject)=>{
            
            //console.log('oilfind')
            let db = this.client.db(this.dbname)
            db.collection(this.collectionName).find({},{projection:{_id:0}}).toArray(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    resolve(result);
                    // console.log(result[0])
                }
            })
           
               
            
        })   
    }
    //查找整个表----无参数
    vis_oilfind(){
        return new Promise((resolve,reject)=>{
            
            //console.log('oilfind')
            let db = this.client.db(this.dbname)
            db.collection(this.collectionName).find().sort('_id',-1).limit(1).toArray(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    resolve(result);
                    // console.log(result[0])
                   
                }
            })
           
               
            
        })
    }
    vissl_findlastone(){
        return new Promise((resolve, reject) => {
            let db = this.client.db(this.dbName);
            db.collection(this.collectionName).find().sort('_id', -1).limit(1).toArray(function(err, result) {
                if (err) {
                    console.error("数据库查询错误：", err);
                    reject(err); // 处理错误情况
                } else {
                    resolve(result); // 正确处理返回结果
                }
            });
        });
    }
    p_findlastone(obj){
        let name = Object.keys(obj)
        let test=obj[name[0]]
        let p=[{
            $sort:{_id:-1}
        }]
        let pro={
        }
        for(let i=0;i<test.length;i++){
            pro[test[i]]=1
        }
        for(var i=1;i<name.length;i++){
            var x={ 
                $lookup:{
                    from: name[i],
                    localField: "_id",
                    foreignField: "_id",
                    as: name[i]
                },
            }
            p.push(x)
            let sub_pro={}
            test=obj[name[i]]
            for(let j=0;j<test.length;j++){
                sub_pro[test[j]]=1
            }
            pro[name[i]]=sub_pro
        }
        p.push({
            $limit:1
        },)
        p.push({
            $project:pro
        })
        return new Promise((resolve,reject)=>{
            
            let db = this.client.db(this.dbname)
            db.collection(this.collectionName).aggregate(p).toArray(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    // console.log('查询结果',result)
                    resolve(result);
                }
            })
           
               
            
        })
    }
    vis_update(data){
        return new Promise((resolve,reject)=>{
            var name = "data."+data.station+"."+data.index
            
                let db = this.client.db(this.dbname)
                db.collection(this.collectionName).updateOne({
                    'filename':"inject_oil"
                },{
                    $set:{
                        [name]:data.data
                    }
                })
            }).then(res=>{

            })
            resolve(data)
    }
    vis_findlast(){
        return new Promise((resolve,reject)=>{
            
                let db= this.client.db(this.dbName)
                db.collection(this.collectionName).find().sort('_id',-1).limit(3000).toArray(function(err,result){
                    // console.log(result)
                    resolve(result)
                })
            })
    }
    vis_oilfindone(checkid){
        return new Promise((resolve,reject)=>{
            
                let db = this.client.db(this.dbname)
                db.collection(this.collectionName).find({warnId:`${checkid}`},{projection:{_id:0}}).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        resolve(result);
                    }
                })
               
                   
                
            })  
    }
    //查找整个表（分列返回）
    vis_oilfindclo(starttime,overtime,obj){
        // console.log('time:',starttime,overtime)
        return new Promise((resolve,reject)=>{
            
            //console.log('oilfind')
            let db = this.client.db(this.dbname)
            //console.log(obj)
            //定义返回值二维数组（去掉第一列时间值）
            var ydata=[]
            //console.log('obj长度：',obj.length)
            for(let j=0;j<obj.length-1;j++)
            {  
                ydata[j]=new Array();
            }
            //console.log('ydata长度',ydata.length)
            //定义并组成显示字段字符
            var name = {}
            for(var i=0;i<obj.length;i++)
            {
                name[obj[i]]=1
            }
            //console.log(name)
            
            //具体查询操作
            db.collection(this.collectionName).find({Timestamp:{$gt:starttime,$lt:overtime}},{projection:name}).toArray(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    var arr2 = Object.keys(result)
                    //console.log('--------result=',result)
                    // console.log('数据原始长度：',result.length)
                    // console.log('日期值：',result)
                    for (let i=0;i<result.length;i+=3)
                    {
                        //var arr2 = Object.keys(result[i])
                        //console.log('arr2:-----',arr2)
                        var valArr22 = Object.keys(result[i]).map(function(j){return result[i][j]});//["I am 1", "I am 2"]
                        for(let j=2;j<valArr22.length;j++)
                        {
                            ydata[j-2].push(parseFloat(valArr22[j]))
                        }
                    }
                    resolve(ydata)
                }
            })
           
               
            
        })
            //resolve(result);   
    }
    vis_oilfindclo2(obj){
        return new Promise((resolve,reject)=>{
            
                //console.log('oilfind')
                let db = this.client.db(this.dbname)
                //console.log(obj)
                //定义返回值二维数组（去掉第一列时间值）
                var ydata=[]
                //console.log('obj长度：',obj.length)
                for(let j=0;j<obj.length-1;j++)
                {  
                    ydata[j]=new Array();
                }
                //console.log('ydata长度',ydata.length)
                //定义并组成显示字段字符
                var name = {}
                for(var i=0;i<obj.length;i++)
                {
                    name[obj[i]]=1
                }
                //console.log(name)
                //具体查询操作
                db.collection(this.collectionName).find({},{projection:name}).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        var arr2 = Object.keys(result)
                        //console.log('--------result=',result)
                        // console.log('数据原始长度：',result.length)
                        for (let i=0;i<result.length;i+=3)
                        {
                            //var arr2 = Object.keys(result[i])
                            //console.log('arr2:-----',arr2)
                            var valArr22 = Object.keys(result[i]).map(function(j){return result[i][j]});//["I am 1", "I am 2"]
                            for(let j=2;j<valArr22.length;j++)
                            {
                                ydata[j-2].push(parseFloat(valArr22[j]))
                            }
                        }
                        resolve(ydata)
                    }
                })
               
                   
                
            })
            //resolve(result);      
    }
    //创建数据表
    //参数说明：库名为已有的库名，表名为
    vis_create(){
        return new Promise((resolve,reject)=>{
            
                let db = this.client.db(this.dbname)
                db.createCollection(this.collectionName, function(err, collection) {
                    db.close();
                    resolve('创建成功')
              })
            })
    }
    //查找数据Bydatatime
    findlabeldataBydatatime(datatime,len,obj){
        return new Promise((resolve,reject)=>{
            
                let db = this.client.db(this.dbname)
                let date2 = new Date(datatime).toISOString()
                var name = {}
                for(var i=0;i<obj.length;i++)
                {
                    name[obj[i]]=1
                }
                name['_id']=0
                // console.log('date时间：',date)
                db.collection(this.collectionName).find({"time":{$gte:new Date(date2)}},{projection:name}).limit(len).toArray(function(err,result){
                    if(err){
                        console.log('findlabeldataBydatatime出错')
                    }else{
                        // console.log('日期结果：',result)
                        resolve(result)
                    }
                })
            })
    }
    //插入数据
    //方案1
    // vis_insert(collectionname,data){

    //     return new Promise((resolve,reject)=>{
    //         
    //             let db = this.client.db(this.dbname)
    //             db.collection(collectionname).insertMany(data)
    //             resolve('success')
                
    //         })
    //     })
    // }
    //方案2
    vis_insert2(collectionname,data,event,stationname){
        
        return new Promise((resolve,reject)=>{
            
            
                let db = this.client.db(this.dbname)
                db.collection(collectionname).insertOne({"event":event,"labeldata":data,"stationname":stationname})
                // console.log('success?')
                resolve('success')
               
                   
                
            })
    }
    //更新数据,select是查询条件数据(查询字段：值),newdata是更新数据(更新字段：值)
    vis_update_warnId(collectionname,select,newdata){
        // console.log('collectionname',collectionname)
        return new Promise((resolve,reject)=>{
            
                let db = this.client.db(this.dbname)
                db.collection(collectionname).updateOne({warnId:select},{$set:{warn_type:newdata}})
                resolve('success')
            })
    }


    //分页查询
    vis_findByPage(pagenum,pagesize){
        var num = (pagenum-1)*pagesize
        //var num = pagenum
        console.log('参数',num,pagesize)
        return new Promise((resolve,reject)=>{
            
            //console.log('oilfind')
            let db = this.client.db(this.dbname)
            db.collection(this.collectionName).find({},{projection:{_id:0}}).sort('_id',-1).skip(parseInt(num)).limit(parseInt(pagesize)).toArray(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    resolve(result);
                }
            })
           
               
            
        })  
    }
    //参数表查询表名
    vis_findtablename(){
        return new Promise((resolve,reject)=>{
            
                let db = this.client.db(this.dbname)
                db.collection(this.collectionName).find().limit(1).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        // console.log('查询结果',result)
                        var arr2 = Object.keys(result[0])
                        // console.log('列名',arr2)
                        resolve(arr2)
                    }
                })
               
                   
                
            })
            //resolve(result);  
    }
    vis_findlastone(){
        // console.log('进入findlastone')
        return new Promise((resolve,reject)=>{
            
                // console.log('最新一条测')
                // console.log('表名',this.dbname)
                let db = this.client.db(this.dbname)
                //console.log(obj)
                // var name = {}
                // for(var i=0;i<obj.length;i++)
                // {
                //     name[obj[i]]=1
                // }
                //console.log('参数名：',name)
                
                db.collection(this.collectionName).find({id:0}).limit(1).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        // console.log('查询结果',result)
                        resolve(result);
                    }
                })
               
                   
                
            })   
    }

    vis_findlastonetest(){
        return new Promise((resolve,reject)=>{
            
            
                //console.log('oilfind')
                let db = this.client.db(this.dbname)
                db.collection(this.collectionName).find({},{projection:{_id:0}}).sort('_id',-1).limit(1).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        resolve(result);
                    }
                })
               
                   
                
            })  
    }

    //更新数据,select是查询条件数据(查询字段：值),newdata是更新数据(更新字段：值)
    vis_sureupdate(select){
        // console.log('@@@collectionname',this.collectionName)
        return new Promise((resolve,reject)=>{
            
            console.log('@@@collectionname',this.collectionName)
                var that = this
                let db = this.client.db(this.dbname)
                db.collection(this.collectionName).updateOne({uuid:select},{$set:{state:'已处理'}})
                    if(that.flag==1){
                        that.client.close()
                    }
                    resolve('success')
                })
                
    }

    vis_findlastone(number){
        return new Promise((resolve,reject)=>{
            
            //console.log('oilfind')
            let db = this.client.db(this.dbname)
            db.collection(this.collectionName).find({},{projection:{_id:0}}).sort('_id',-1).limit(number).toArray(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    resolve(result);
                }
            })
           
               
            
        })  
    }
    time_find(){
        return new Promise((resolve,reject)=>{
            
            let db = this.client.db(this.dbname)
            db.collection(this.collectionName).find().sort('_id',-1).limit(1440).toArray(function(err,result){
                if(err){
                    throw err;
                }
                else{
                    // console.log('查询结果',result)
                    resolve(result);
                }
            })
           
               
            
        })
    }
    find_all(){
        return new Promise((resolve,reject)=>{
            
                let db = this.client.db(this.dbname)
                db.collection(this.collectionName).find({},{projection:{_id:0,confirm_time:1}}).toArray(function(err,result){
                    if(err){
                        throw err;
                    }
                    else{
                        // console.log('查询结果',result)
                        resolve(result);
                    }
                })
            })
    }
}
module.exports=vis_cube
