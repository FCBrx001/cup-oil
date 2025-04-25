const client1 = require('./mongo')

const client2 = require('./mongo')

client1('pipeline',(res)=>{
    console.log(res)
})

client2('labtest',(res)=>{
    console.log(res)
})

