import axios from 'axios'
import * as d from 'd3'
const d3=require('d3-dsv')
/*折线图 */
export function readfileLine(path,algorithm,frequent){
    var columnName=[];
    var time=[];
    var ydata=[];
    var linevalue=[];
    axios.get(path).then(res => {     //
        var ret = d3.csvParse(res.data)
        //console.log('22222222222222222:',ret);
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;
        var key=Object.keys(ret[0]);
        var t='';
        for(let j=0;j<columnLen;j++)
        {
            ydata[j]=new Array();
            if(j==0){
                t=key[j];
            }
            if(j>0)
            {columnName.push(key[j])}
        }
        //console.log('---|||---',t)
        for(let i=0;i<ret.length;i+=frequent){
            var value=Object.values(ret[i]);
            if(time==null||ret[i][t]!=time[time.length-1])
            { 
                time.push(ret[i][t]);
                for(let k=0;k<columnLen-1;k++){
                    ydata[k].push(parseFloat(value[k+1]))
                }        
            }
        }
    })
    //console.log("ydataline:",ydata)
    /*console.log("columnName:",columnName)
    console.log("time:",time)
    */
    linevalue.push(columnName);
    linevalue.push(time);
    linevalue.push(ydata);
    return linevalue;
}
export function readfileLine2(path,j){
    var position=[];
    var linevalue=[];
    var ydata=[];
    //console.log('j:',j)
    axios.get(path).then(res => {     // 
        var ret = d3.csvParse(res.data)
        //console.log('-------------------========================------------------------',ret);
        for(let i=0;i<ret.length;i++){
            position.push(i+1);
            ydata.push(ret[i][j]);
        }
    })
    linevalue.push(position);
    linevalue.push(ydata);
    //console.log('---------------------linevalue----------------------:',linevalue);
    return linevalue;
}
/*平行坐标图 */
//有时间轴
export function readfiletimeParallel(path){
    var parallelvalue=[];
    var data=[];
    var schema=[]
    axios.get(path).then(res => {     // 
        //console.log(res)
        var ret = d3.csvParse(res.data)
        for(let i=0;i<ret.length;i+=12){
            let s=i/12;
            data[s]=new Array();
            data[s]=Object.values(ret[i]);
            for(let j=1;j<data[s].length;j++){
                data[s][j]=parseFloat(data[s][j]);
            }
        }
        //console.log("timeParallel--data.length:",data.length);
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;
        schema[0]=new Object();
        schema[0].dim=0;
        schema[0].name="time";//坐标轴名称
        schema[0].type="category";//坐标轴名称
        schema[0]=JSON.parse(JSON.stringify(schema[0]));
        var key=Object.keys(ret[0]);
        for(let i=1;i<columnLen;i++){
            schema[i]=new Object();
            schema[i].dim=i;
            schema[i].name=key[i];//坐标轴名称
            schema[i].type="value";//坐标轴类型
            schema[i]=JSON.parse(JSON.stringify(schema[i]));
        }
    })
    parallelvalue.push(data);
    parallelvalue.push(schema);
    //console.log("data:",data)
    return parallelvalue;
}
//不带时间轴的平行坐标
export function readfileParallel(path){
    var parallelvalue=[];
    var data=[];
    var schema=[]
    axios.get(path).then(res => {     // 
        //console.log(res)
        var ret = d3.csvParse(res.data)
        for(let i=0;i<ret.length;i+=12){
            let s=i/12;
            data[s]=new Array();
            data[s]=Object.values(ret[i]);
            for(let j=1;j<data[s].length;j++){
                data[s][j]=parseFloat(data[s][j]);
            }
        }
        //console.log("data.length:",data.length);
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;
        var key=Object.keys(ret[0]);
        for(let i=0;i<columnLen;i++){//此处columnLen-3为了应付测试，实际应为columnLen
            schema[i]=new Object();
            schema[i].dim=i;
            schema[i].name=key[i];//坐标轴名称
            schema[i].type="value";//坐标轴类型
            schema[i]=JSON.parse(JSON.stringify(schema[i]));
        }
    })
    parallelvalue.push(data);
    parallelvalue.push(schema);
    //console.log("data:",data)
    return parallelvalue;
}
/*热力图 */
/*
export async function getDicsList(){
    var result =await Axios.get('../../static/getdicsList.json');
    return result;
}
 */
/*export function readfileHeatmap(path){
   // console.log("1111")
    var columnName=[];
    var day=[];
    var hour=[];
    var ydata=[];
    var heatmapvalue=[]
    var test=[]
    
     axios.get(path).then(res => {     // 
      //  console.log(res)
      for(let a=0;a<10;a++){
        test[a]=new Array()
      }
      for(let a=0;a<10;a++){
        for(let b=0;b<10;b++){
            test[a].push(b);
        }
      }
     var ret = d3.csvParse(res.data)
        //console.log(ret);
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;
        var key=Object.keys(ret[0]);
        var n=0;
        for(let j=0;j<columnLen-2;j++)
        {
            ydata[j]=new Array();
            if(j>1)
            {
                columnName.push(key[j])
            }
        }
    for(let i=0;i<ret.length;i++){
        var value=Object.values(ret[i]);
        //console.log("value:",value[0])
        //if(time==null||ret[i].Time!=time[time.length-1])
        //{ 
        var d=ret[i].Time.slice(0,9);
        //console.log(d)
        var h=ret[i].Time.slice(10,16);
        if(day.indexOf(d)==-1)
        {
            day.push(d);
        }
        if(hour.indexOf(h)==-1){
            if(n<1440){
                hour.push(h);
                n++;
            }
        }
        
        // for(let k=0;k<columnLen-1;k++){
        //     ydata[k].push(ret[i][k+1])
        // }     
        
        //ydata[k].push((value[0])) 
        
        for(let k=0;k<columnLen-2;k++){
            ydata[k].push(parseFloat(value[k+2]))
        }        
        //}
    }
    //console.log(ydata[0].length)
    })
    
    console.log("test",test[0]);
    //ydata=JSON.parse(JSON.stringify(ydata))
    console.log("ydata11",ydata);

    // heatmapvalue.push(columnName);
    // heatmapvalue.push(day);
    // heatmapvalue.push(hour);
    // heatmapvalue.push(ydata);
    //heatmapvalue=JSON.parse(JSON.stringify(heatmapvalue))
    return test;
}*/
export async function readfileHeatmap(path){
    //console.log("1-async function readfileHeatmap")
     var columnName=[];
     var day=[];
     var hour=[];
     var ydata=[];
     var heatmapvalue=[]
     var ret
     await axios.get(path).then(res => {     // 
        //console.log("2-await")
        ret= d3.csvParse(res.data)
         //console.log(ret);
     })
     var columnLen= Object.getOwnPropertyNames(ret[0]).length;
         var key=Object.keys(ret[0]);
         var n=0;
         for(let j=0;j<columnLen-2;j++)
         {
             ydata[j]=new Array();
             if(j>1)
             {
                 columnName.push(key[j])
             }
         }
     //////////////
     var position=[];
     for(let i=0;i<ret.length;i+=12){
         if(position.indexOf(ret[i].position)==-1)
        {
            position.push(ret[i].position)
        }
     }
     //console.log("position:",position)
     for(let i=0;i<ret.length;i+=12){
         var value=Object.values(ret[i]);
         //console.log("value:",value[0])
         //if(time==null||ret[i].Time!=time[time.length-1])
         //{ 
         var d=ret[i].Time.slice(0,9);
         //console.log(d)
         var h=ret[i].Time.slice(10,16);
         if(day.indexOf(d)==-1)
         {
             day.push(d);
         }
         if(hour.indexOf(h)==-1){
             if(n<1440){
                 hour.push(h);
                 n++;
             }
         }
         
         // for(let k=0;k<columnLen-1;k++){
         //     ydata[k].push(ret[i][k+1])
         // }     
         
         //ydata[k].push((value[0])) 
         
         for(let k=0;k<columnLen-2;k++){
             ydata[k].push(parseFloat(value[k+2]))
         }        
         //}
     }
     ////
     //ydata=JSON.parse(JSON.stringify(ydata))
      //console.log("ydata11",ydata[0]);
      //console.log("columnName:",columnName)
      heatmapvalue.push(columnName);
      heatmapvalue.push(day);
      heatmapvalue.push(hour);
      heatmapvalue.push(ydata);
      heatmapvalue.push(position);
      //console.log(position)
      heatmapvalue=JSON.parse(JSON.stringify(heatmapvalue))
      //console.log('3-return');
     return heatmapvalue;
 }
 export async function readfileHeatmap2(path,frequent){
    //console.log("1-async function readfileHeatmap2")
     var columnName=[];
     var day=[];
     var hour=[];
     var ydata=[];
     var heatmapvalue=[];
     
     var ret
     await axios.get(path).then(res => {     // 
        ret= d3.csvParse(res.data)
        //console.log("@@@@@ret:",ret);
     })
     var columnLen= Object.getOwnPropertyNames(ret[0]).length;
         var key=Object.keys(ret[0]);
         var n=0;
         for(let j=0;j<columnLen;j++)
         {
             if(j!=columnLen-1)
            {
                ydata[j]=new Array();
            }
             if(j>=1)
             {
                 columnName.push(key[j])
             }
         }
     var lasthour='111'
     for(let i=0;i<ret.length;i+=frequent){
         var value=Object.values(ret[i]);
         var d=ret[i].Timestamp.slice(0,10);
         //console.log(d)
         var h=ret[i].Timestamp.slice(11);
         if(day.indexOf(d)==-1)
         {
             day.push(d);
         }
         if(hour.indexOf(h)==-1){
             if(n<1440){
                 hour.push(h);
                 n++;
             }
         }
         if(h!=lasthour){
            for(let k=0;k<columnLen-1;k++){
                ydata[k].push(parseFloat(value[k+1]))
            }  
         }   
         lasthour=h;      
     }
      heatmapvalue.push(columnName);
      heatmapvalue.push(day);
      heatmapvalue.push(hour);
      heatmapvalue.push(ydata);
      heatmapvalue=JSON.parse(JSON.stringify(heatmapvalue))
      //console.log('3-return');
      //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@',ydata)
    return heatmapvalue;
 }
/*export function test(){
    var a
    d.csv('../../../static/data/ceshii2.csv',function(error,csvdata){
        if(error){
            console.log(error)
        }
        a=csvdata;
        console.log("csv",a)
    });
   console.log("a：",a);
}
export async function getDicsList(){
    var result =await Axios.get('../../static/getdicsList.json');
    return result;
}*/

export function testtest(path){
    //console.log("1111")
    var test=[]
    for(let a=0;a<10;a++){
        test[a]=new Array()
    }
     axios.get(path).then(res => {     // 
      //  console.log(res)
     
      for(let a=0;a<10;a++){
        for(let b=0;b<10;b++){
            test[a].push(b);
        }
      }
    })
    
    //console.log("test",test);
    //console.log("test",test[0])
    return test
}
export function readfileDiffStationSameParameter(path,frequent){
    var columnName=[];
    var time=[];
    var ydata=[];
    var linevalue=[];
    //console.log('readfileDiffStationSameParameter');
    axios.get(path).then(res => {     //
        var ret = d3.csvParse(res.data);
        //console.log('-----------122:',ret);
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;
        var key=Object.keys(ret[0]);
        var t='';
       
        for(let j=0;j<columnLen;j++)
        {
            ydata[j]=new Array();
            if(j==0){
                t=key[j];
            }
            if(j>0)
            {columnName.push(key[j])}
        }
        //console.log('---|||---',t)
        for(let i=0;i<ret.length;i+=frequent){
            var value=Object.values(ret[i]);
            if(time==null||ret[i][t]!=time[time.length-1])
            { 
                time.push(ret[i][t]);
                for(let k=0;k<columnLen-1;k++){
                    ydata[k].push(parseFloat(value[k+1]))
                }        
            }
        }
        
    })
    
   // console.log("ydataline-----------------:",ydata)
    linevalue.push(columnName);
    linevalue.push(time);
    linevalue.push(ydata);
    return linevalue;
}
export function readDatafileCompare(path,frequent){
    var columnName=[];
    var time=[];
    var ydata=[];
    var linevalue=[];
    axios.get(path).then(res => {     //
        var ret = d3.csvParse(res.data)
        //console.log('22222222222222222:',ret);
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;
        var key=Object.keys(ret[0]);
        var t='';
       
        for(let j=0;j<columnLen;j++)
        {
            ydata[j]=new Array();
            if(j==0){
                t=key[j];
            }
            if(j>0)
            {columnName.push(key[j])}
        }
        //console.log('---|||---',t)
        for(let i=0;i<ret.length;i+=frequent){
            var value=Object.values(ret[i]);
            if(time==null||ret[i][t]!=time[time.length-1])
            { 
                time.push(ret[i][t]);
                for(let k=0;k<columnLen-1;k++){
                    ydata[k].push(parseFloat(value[k+1]))
                }        
            }
        }
        
    })
    linevalue.push(columnName);
    linevalue.push(time);
    linevalue.push(ydata);
    return linevalue;
}
export function pressDataProcess(ret){
    //console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&---',ret);
    var columnName=[];
    var time=[];
    var ydata=[];
    var linevalue=[];
    var columnLen= Object.getOwnPropertyNames(ret[0]).length;
        var key=Object.keys(ret[0]);
        var t='';
       
        for(let j=0;j<columnLen;j++)
        {
            ydata[j]=new Array();
            if(j==0){
                t=key[j];
            }
            if(j>0)
            {columnName.push(key[j])}
        }
        //console.log('---|||---',t)
        for(let i=0;i<ret.length;i+=1){
            var value=Object.values(ret[i]);
            if(time==null||ret[i][t]!=time[time.length-1])
            { 
                time.push(ret[i][t]);
                for(let k=0;k<columnLen-1;k++){
                    ydata[k].push(parseFloat(value[k+1]))
                }        
            }
        }
        linevalue.push(columnName);
        linevalue.push(time);
        linevalue.push(ydata);
        return linevalue;
}
export function readfileoilbatchData(path,frequent){
    var barvalue=[];
    var barvalue=readfileoildis(path,frequent)
    console.log("hhhh",barvalue)
    return barvalue
}
function readfileoildis(path,frequent){
    var columnName=[];
    var time=[];
    var ydata=[];
    var barvalue=[];
    axios.get(path).then(res => {     //
        //console.log("aiaiaia",res)
        var ret = d3.csvParse(res.data)
        //console.log(ret)
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;
        var key=Object.keys(ret[0]);
        var t='';
        for(let j=0;j<columnLen;j++)
        {   
            if(j==columnLen-1){
                t=key[j];
            }
            if(j<columnLen-2)
            {
                ydata[j]=new Array();
                columnName.push(key[j]);
            }
        }
        for(let i=0;i<ret.length;i+=frequent){
            var value=Object.values(ret[i]);
            if(time==null||ret[i][t]!=time[time.length-1])
            { 
                time.push(ret[i][t]);
                for(let k=0;k<columnLen-2;k++){
                    ydata[k].push(parseFloat(value[k]))
                }        
            }
        }
    })
    barvalue.push(columnName);
    barvalue.push(time);
    barvalue.push(ydata);
    return barvalue;
}
export function readfilerealtimeData(path,path2,frequent){
    var distance=[];
    var ydata=[];
    var linevalue=[]
    axios.get(path).then(res => {     
        var ret = d3.csvParse(res.data)
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;//时间节点的个数（横轴）
        console.log('timeLen:',columnLen)
        var key=Object.keys(ret[0]);
        var t='';
        for(let j=0;j<columnLen-3;j++)
        {
            ydata[j]=new Array();
        }
        for(let i=0;i<ret.length;i+=frequent){
            var value=Object.values(ret[i]);
            if(ret[i]['各站位置']!='0'){
                distance.push(ret[i]['各站位置'])
            }
            else{
                distance.push(ret[i]['距离（km）/时间（s）'])
            }
            for(let k=0;k<columnLen-3;k++){
                ydata[k].push(parseFloat(value[k]))
            }        
        }
    })
    linevalue.push(distance);
    linevalue.push(ydata);
    var distance2=[];
    var ydata2=[];
    axios.get(path2).then(res => { 
        var ret = d3.csvParse(res.data)
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;//时间节点的个数（横轴）
        var key=Object.keys(ret[0]);
        var t='';
        for(let j=0;j<columnLen-3;j++)
        {
            ydata2[j]=new Array();
        }
        for(let i=0;i<ret.length;i+=frequent){
            var value=Object.values(ret[i]);
            distance2.push(ret[i]['距离（km）/时间（s）'])
            for(let k=0;k<columnLen-3;k++){
                ydata2[k].push(parseFloat(value[k]))
            }        
        } 
    })
     linevalue.push(ydata2);
     linevalue.push(distance2)
     return linevalue;
}
export function readfilesingleSection(path,path2,frequent){
    var distance=[];
    var ydata=[];
    var linevalue=[];
    var section=[];
    var record_start=[];
    var record_end=[];
    axios.get(path).then(res => {  //
        var ret = d3.csvParse(res.data)
        var columnLen= Object.getOwnPropertyNames(ret[0]).length;//时间节点的个数（横轴）
        var key=Object.keys(ret[0]);
        var t='';
        for(let j=0;j<columnLen-3;j++)
        {
            ydata[j]=new Array();
        }
        for(let i=0;i<ret.length;i+=frequent){
            var value=Object.values(ret[i]);
            if(ret[i]['各站位置']!='0'){
                section.push(ret[i]['各站位置']) 
                if(record_start.length>0){
                    record_end.push(i-1)
                }
                record_start.push(i)    
                distance.push(ret[i]['各站位置'])
            }
            else{
                distance.push(ret[i]['距离(km)/时间(s)'])
            }
            for(let k=0;k<columnLen-3;k++){
                ydata[k].push(parseFloat(value[k]))
            }  
        }
    })
    linevalue.push(distance);
    linevalue.push(ydata);
    linevalue.push(section);
    linevalue.push(record_start);
    linevalue.push(record_end);

    // axios.get(path2).then(res => { 
    //     var ret = d3.csvParse(res.data)
    //     var columnLen= Object.getOwnPropertyNames(ret[0]).length;//时间节点的个数（横轴）
    //     var key=Object.keys(ret[0]);
    //     var t='';
    //     for(let j=0;j<columnLen-3;j++)
    //     {
    //         ydata2[j]=new Array();
    //     }
    //     for(let i=0;i<ret.length;i+=frequent){
    //         var value=Object.values(ret[i]);
    //         distance2.push(ret[i]['距离（km）/时间（s）'])
    //         for(let k=0;k<columnLen-3;k++){
    //             ydata2[k].push(parseFloat(value[k]))
    //         }        
    //     } 
    // })
    return linevalue;
}
