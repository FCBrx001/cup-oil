const testTransaction = async (goodId,client,res,Coll,i) => {
    //const client = await db.dbInstance();
    const transactionOptions = {
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' },
      readPreference: 'primary',
    };
  
    const session = client.startSession();
    //console.log('事务状态：', session.transaction.state);
  
    try {
      session.startTransaction(transactionOptions);
      //console.log('事务状态：', session.transaction.state);
  
      //const Coll = await client.db('labtest').collection('huadu');

      await Coll.findOneAndUpdate({_id:goodId},{$push:res},{session})
      await Coll.findOneAndUpdate({_id:goodId},{$inc:{count:1}},{session})
      console.log(Coll.findOne({_id:goodId}))
    //原原子操作
    //   const { stock, price } = await goodsColl.findOne({ goodId }, { session });
    //   console.log('事务状态：', session.transaction.state);
    //   if (stock <= 0) {
    //       throw new Error('库存不足');
    //   }
    //   await goodsColl.updateOne({ goodId }, {
    //       $inc: { stock: -1 } // 库存减 1
    //   })
    //   await orderGoodsColl.insertOne({ id: Math.floor(Math.random() * 1000),  goodId, price  }, { session });
      await session.commitTransaction();
    } catch(err) {
      //console.log(`[MongoDB transaction] ERROR: ${err}`);
      await session.abortTransaction();
    } finally {
      await session.endSession();
      return new promise((resolve,reject)=>{
        resolve(i+1)
      })
      //console.log('事务状态：', session.transaction.state);
    }
  }

  module.exports = testTransaction