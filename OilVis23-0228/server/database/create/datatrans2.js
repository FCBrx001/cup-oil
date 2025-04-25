//数据转换函数，转换为array或者string

//列名数组

var arr1 = [
    'Timestamp',              '茂名下载1',            '茂名下载2',
    '茂名出站流量1',          '茂名出站流量2',        '给油泵出口压力',
    '茂名出站压力',           '茂名进站油品密度',     '茂名出站油品密度',
    '茂名进站温度',           '茂名出站温度',         '茂名进站压力',
    '茂名下载减压阀后压力',   '茂名出站流量',         '阳江进站流量',
    '阳江流量计1',            '阳江流量计2',          '阳江进站压力',
    '阳江出站压力',           '阳江油品密度',         '阳江进站温度',
    '阳江出站温度',           '阳江输油泵组入口压力', '阳江输油泵组出口压力',
    '阳江下载阀前压力',       '阳江减压阀后压力',     '阳江出站流量',
    '恩平流量计1',            '恩平流量计2',          '恩平越站流量',
    '恩平进站压力',           '恩平出站压力',         '恩平油品密度',
    '恩平密度计1',            '恩平密度计2',          '恩平进站温度',
    '恩平减压阀前压力',       '恩平减压阀后压力',     '恩平出站流量',
    '鹤山进站流量',           '鹤山流量计1',          '鹤山流量计2',
    '鹤山进站压力',           '鹤山出站压力',         '鹤山油品密度',
    '鹤山进站温度',           '鹤山出站温度',         '鹤山下载减压阀前压力',
    '鹤山主输泵出口压力',     '鹤山减压阀后压力',     '鹤山主输泵入口压力',
    '鹤山出站流量',           '江门进站流量',         '江门流量计1',
    '江门流量计2',            '江门流量计3',          '江门流量计4',
    '江门出站流量',           '江门进站压力',         '江门出站压力',
    '江门油品密度',           '江门密度计1',          '江门进站温度',
    '江门至荷城出站温度',     '江门出站流量',         '高明进站流量',
    '高明流量计1',            '高明流量计2',          '高明流量计3',
    '高明进站压力',           '高明出站压力',         '高明油品密度',
    '高明进站温度',           '高明出站温度',         '高明站减压阀前压力',
    '高明减压阀后压力',       '高明出站流量',         '{MCC} STN20-00-19FI003',
    '三水流量计1',            '三水流量计2',          '三水越站流量',
    '三水进站压力',           '三水至花都出站压力',   '三水至南海出站压力',
    '三水油品密度',           '三水进站温度',         '三水出站温度',
    '三水减压阀前压力',       '三水减压阀后压力',     '三水进站流量',
    '花都进站什么玩意',       '花都流量计1',          '花都流量计2',
    '花都进站压力',           '花都油品密度',         '花都进站温度',
    '花都减压阀钱雅丽',       '花都减压阀后压力',     '花都进站流量',
    '{MCC} STN21-00-20FI003','南海流量计1','南海流量计2','南海进站压力',
    '南海油品密度','南海密度计','南海进站温度','南海减压阀前压力','南海减压阀后压力','南海进站流量']
//check:数组/字符串判别值    line：每一航数据    length：数据长度
//state:返回纯数组


function average(span){
    var ave_span=Array(110)
        //计算span的平均数得出ave_span
        for(var k=0;k<span.length;k++)
        {
            var len=span[k].length
            var sum = 0
            for(var n=0;n<span[k].length;n++)
            {
                if(isNaN(span[k][n]))
                {
                    sum+=0
                    len--
                }
                else
                {
                    sum+=span[k][n]*1
                }
            }
            //console.log(`sum[k]值`,sum)
            ave_span[k] = sum/len
        }
        //console.log('平均数',ave_span)
        return ave_span
   
}

function datatrans2(span,length,doc_num,type){

    var arrstr = new Array( )
    var arrArr = new Array( )
    data = average(span)
    //console.log('-----span值：',span)
    if(type==1)//更新文档，返回字符串
    {
        return new Promise((resolve,reject)=>{
        //组合字符串
        let liststr={}//字符串集合
        arrstr[1]=span[1][0]
        for(var i=2;i<=length;i++)
        {
            arrstr[i] = data[i]
        }
        //console.log('arrstr值：',arrstr)
        
        for(var i=1;i<110;i++)
        {
            liststr[`${arr1[i-1]}`] = arrstr[i]
        }
        //console.log('liststr值：',liststr)
        //组合结束
        
            resolve(liststr)
        })
    }else if(type==0)//创建文档，返回数组
    {
        return new Promise((resolve,reject)=>{
        //组合数组
        let listArr={}//数组集合
        arrArr[1] = new Array()
        arrArr[1][0] = span[1][0]
        console.log('span中的时间值：',span[1][0])
        for(var i=2;i<=110;i++)
        {
            //arrArr[i] = Array(data[i])
            arrArr[i] = new Array()
            arrArr[i][0] = data[i]
        }
        //console.log('arrArr值：',arrArr)
        var time = span[1][0]
        const date = new Date(time);
        //console.log('Time值',time)
        const Y = date.getFullYear();
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        const D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
        const H = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours());

        //listArr['Doc-ID']=docnum_JSON
        listArr['Doc-ID']=doc_num
        //listArr['Timestamp']=time
        listArr['Year']=Y
        listArr['Month']=M
        listArr['Day']=D
        listArr['Hour']=H
        for(var i=1;i<110;i++)
        {
            listArr[`${arr1[i-1]}`] = arrArr[i]
        }
        //console.log('listArr',listArr)
        //组合结束
        
            resolve(listArr)
        })
    }
}

module.exports = datatrans2
