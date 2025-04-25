var lineReader = require('line-reader');
var arr = new Array( );
var test2 = new Array( );
var test=0

    lineReader.open('../sys_data/final0-4.csv',function(err,reader){
        if(reader.hasNextLine())
        {
            reader.nextLine(function(err,line){
                if(!err)
                {
                    for(var i=1;i<=110;i++)
                    {
                        arr.push(String(line.split(",")[i]))
                    }
                    test++
                    console.log(arr)
                    test2 = arr
                }
            })
            reader.close(function(err){

            })

        }
    })
    console.log('123',test2)
    if(test==1){
        console.log('123',test2)
    }
    
    


    



