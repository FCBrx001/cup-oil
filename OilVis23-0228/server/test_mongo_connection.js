// const { MongoClient } = require('mongodb');

// async function testMongoDB() {
//   console.log('🔍 测试MongoDB连接...');
  
//   const url = 'mongodb://root:examplepassword@10.1.16.50:9101';
//   const dbName = '计算结果';
  
//   const client = new MongoClient(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     connectTimeoutMS: 5000,
//     serverSelectionTimeoutMS: 5000,
//   });

//   try {
//     console.log('连接到MongoDB...');
//     await client.connect();
//     // console.log('✅ 成功连接到MongoDB');
    
//     const db = client.db(dbName);
//     // console.log(`📦 连接到数据库: ${dbName}`);
    
//     // 列出所有集合
//     const collections = await db.listCollections().toArray();
//     console.log('📋 可用集合:');
//     collections.forEach(collection => {
//       console.log(`  - ${collection.name}`);
//     });
    
//     // 测试阀室2预测数据集合
//     const collectionName = '阀室2预测数据';
//     if (collections.some(c => c.name === collectionName)) {
//       console.log(`\n🔍 查询集合: ${collectionName}`);
//       const collection = db.collection(collectionName);
      
//       const count = await collection.countDocuments();
//       console.log(`📊 文档总数: ${count}`);
      
//       if (count > 0) {
//         const firstDoc = await collection.findOne();
//         console.log('📄 第一个文档:');
//         console.log(JSON.stringify(firstDoc, null, 2));
        
//         const first5Docs = await collection.find({}).limit(5).toArray();
//         console.log(`\n📄 前5个文档的字段:`)
//         first5Docs.forEach((doc, index) => {
//           console.log(`文档 ${index + 1} 字段:`, Object.keys(doc));
//         });
//       }
//     } else {
//       console.log(`❌ 集合 "${collectionName}" 不存在`);
//     }
    
//   } catch (error) {
//     console.error('❌ MongoDB连接失败:', error.message);
//   } finally {
//     await client.close();
//     console.log('🔒 MongoDB连接已关闭');
//   }
// }

// testMongoDB(); 