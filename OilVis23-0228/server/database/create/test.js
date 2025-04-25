var readline = require('readline');  
var fs = require('fs');  
var os = require('os');  
  
var fReadName = '../';  
var fWriteName = './1.readline.log';  
var fRead = fs.createReadStream('../data/huadu_labtest.csv');  
var fWrite = fs.createWriteStream(fWriteName);  
  
  
var objReadline = readline.createInterface({  
    input: fRead,  
// 这是另一种复制方式，这样on('line')里就不必再调用fWrite.write(line)，当只是纯粹复制文件时推荐使用  
// 但文件末尾会多算一次index计数   sodino.com  
//  output: fWrite,   
//  terminal: true  
});  
  
  
var index = 1;
function asd(){
    console.log('come in')
    for(;index<1000000;)
    {
        objReadline.prependOnceListener('line', (line)=>{  
            console.log(index, line);  
            index ++;
        
        });
    }
        

}
asd()
    

  
  
// objReadline.once('close', ()=>{  
//     console.log('readline close...');  
// });