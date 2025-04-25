<template>
    <div>
        <div>
            <el-button >裁剪</el-button>
            <el-button > 重置</el-button>
        </div>
        <svg width="100%" height="700" >
        </svg>
    </div>
</template>

<script>
import * as d3 from 'd3';
export default {
    data() {
        return {
            
        }
    },
    mounted() {
        this.set()
    },
    methods: {
        set(){
            var width=620,height=620,
                margin={left:55,top:20,right:20,buttom:20};
            var svg=d3.select('svg')
                .append('svg')
                .attr('width',width)
                .attr('height',height);
    
            //设置平行坐标长宽
            var g_height=200 ,
                g_width=600 ;

            //g用来绘制静态元素
            var g=d3.select('svg')
                    .append('g')
                    .attr("transform","translate("+margin.left+","+margin.top+")");

            //用来绘制动态元素
            var board=d3.select('svg')
                        .append('g')
                        .attr("transform","translate("+margin.left+","+margin.top+")");

            var board2=d3.select('svg')
                         .append('g')
                         .attr("transform","translate("+margin.left+","+margin.top+")");

            var Xmaximum=20,Ymaximum=6;
            //设置数据范围同svg比例增大或缩小
            var scale_x=d3.scaleLinear()
                          .domain([0,Xmaximum])//输入范围
                          .range([0,g_width]);//输出范围
                
            var scale_y=d3.scaleLinear()
                          .domain([0,Ymaximum])
                          .range([g_height,0]);
            //添加坐标系
            
    
            // g.append('g')
            // .call(x_axis);

            var cp=this.createParallelCoordinates(0);

            //Cardinal样条插值
            var tension=1;
            board.html('');
            //获取滑动点位置 
            var ponits1=new Array();
            ponits1[0]=[scale_x(0)-scale_x(5),parseFloat(cp[0].attr("cy"))+scale_y(3)-scale_y(0)];
            var i;
            for(i=0;i<cp.length;i++){
                ponits1[i+1]=[0,0];
                ponits1[i+1][0]=parseFloat(cp[i].attr("cx"));
                ponits1[i+1][1]=parseFloat(cp[i].attr("cy"));
            }
            ponits1[i+1]=[scale_x(5)-scale_x(0)+parseFloat(cp[i-1].attr("cx")),parseFloat(cp[i-1].attr("cy"))+scale_y(3)-scale_y(0)];
            // console.log(ponits1);
            var normal_P = this.createPoints(ponits1);
            this.createLine(normal_P,tension);
            // console.log(normal_P);

            //KochanekBartels样条插值
            var cp_kb=this.createParallelCoordinates(200);
            var tension_kb=1;
            var bias=0;
            var continuity=0;
            this.updataKochanekBartelsCurve(tension_kb,bias,continuity);
        },
        updataKochanekBartelsCurve(tension,bias,continuity){
            board2.html('');
            var scale_x=d3.scaleLinear()
                          .domain([0,Xmaximum])//输入范围
                          .range([0,g_width]);//输出范围
                
            var scale_y=d3.scaleLinear()
                          .domain([0,Ymaximum])
                          .range([g_height,0]);
            //获取滑动点位置 
            var ponits1=new Array();
            ponits1[0]=[scale_x(0)-scale_x(5),parseFloat(cp_kb[0].attr("cy"))+scale_y(3)-scale_y(0)];
            var i;
            for(i=0;i<cp_kb.length;i++)
            {
                ponits1[i+1]=[0,0];
                ponits1[i+1][0]=parseFloat(cp_kb[i].attr("cx"));
                ponits1[i+1][1]=parseFloat(cp_kb[i].attr("cy"));
            }
            ponits1[i+1]=[scale_x(5)-scale_x(0)+parseFloat(cp_kb[i-1].attr("cx")),parseFloat(cp_kb[i-1].attr("cy"))+scale_y(3)-scale_y(0)];
            // console.log(ponits1);
            var normal_P = createPoints(ponits1);
            // console.log(normal_P);
            createLine_Kb(normal_P,tension,bias,continuity);
        },
        createPoints(p){
            var normal_P=new Array();
            for(var i=0;i<(p.length-3);i++){
                var points=[ [ p[i][0],p[i][1] ],
                           [ p[i+1][0],p[i+1][1] ],
                           [ p[i+2][0],p[i+2][1] ],
                           [ p[i+3][0],p[i+3][1] ]];
                normal_P.push(points);
            }
            return normal_P;
        },
        createLine(normal_P,tension){
            for(var i=0;i<normal_P.length;i++){
                var points=normal_P[i];
                var result=evaluateCardinalSplineSegment(points,tension);
                // console.log(i+"="+result);
                for(var j=0;j<(result.length-1);j++){
                    drawLine(result[j][0],result[j][1],result[j+1][0],result[j+1][1]);
                }
                // console.log("END:  "+result[result.length-1][0]+","+result[result.length-1][1]);
            }
        },
        createLine_Kb(normal_P,tension,bias,continuity){
            for(var i=0;i<normal_P.length;i++){
                var points=normal_P[i];
                var result=evaluateKochanekBartelsSplineSegment(points, tension, bias, continuity);
                // console.log(i+"="+result);
                for(var j=0;j<(result.length-1);j++){
                    drawLine(result[j][0],result[j][1],result[j+1][0],result[j+1][1],"blue",true);
                }
            }
        },
        drawLine(x1,y1,x2,y2,color="blue",target=false){
            if(target==false){
                this,board.append("line")
                .attr("x1",x1)
                .attr("y1",y1)
                .attr("x2",x2)
                .attr("y2",y2)
                .attr("stroke",color)
                .attr("z-index",99)
                .attr("stroke-width","2px");
            }else{
                board2.append("line")
                .attr("x1",x1)
                .attr("y1",y1)
                .attr("x2",x2)
                .attr("y2",y2)
                .attr("stroke",color)
                .attr("z-index",99)
                .attr("stroke-width","2px");
            }
        },
        createParallelCoordinates(h){
            var g=d3.select('svg')
                    .append('g');
            var Xmaximum=20,Ymaximum=6;
            var g_height=120 ,
                g_width=500 ;
            var scale_x=d3.scaleLinear()
                          .domain([0,Xmaximum])//输入范围
                          .range([0,g_width]);//输出范围
                
            var scale_y=d3.scaleLinear()
                          .domain([0,Ymaximum])
                          .range([g_height,0]);
            var x_axis=d3.axisTop().scale(scale_x).ticks(Xmaximum).tickPadding(5).tickSize(1) ,
                y_axis=d3.axisLeft().scale(scale_y).ticks(Ymaximum).tickPadding(5).tickSize(5) ;
            var p=new Array(5);
            for(var i=0;i<5;i++){
                g.append('g')
                    .call(y_axis)
                    .attr("transform","translate("+(scale_x(i*5)-scale_x(0))+","+h+")");
                p[i]=g.append("circle")
                    .attr("cx",scale_x(i*5))
                    .attr("cy",h+scale_y(3))   
                    .attr("r",5)
                    .style("fill","red")
                    .call(d3.drag().on("drag", this.dragged));
            }
        },
        dragged(event){
            if((event.y>h)&&(event.y<(scale_y(0)-scale_y(6)+h))){
                d3.select(this).attr("cy",event.y);
                var pos_y=parseFloat(d3.select(this).attr("cy"));
                if(pos_y<=150)
                    updataCardinalCurve(tension);
                else
                    updataKochanekBartelsCurve(tension_kb,bias,continuity);
                }       
            }
        },
        multiply(a, b) {
            // 相乘约束
            if (a[0].length !== b.length) {
                throw new Error();
            }
            var m = a.length;
            var p = a[0].length;
            var n = b[0].length;
            // 初始化 m*n 全 0 二维数组
            var c = new Array(m).fill(0).map(arr => new Array(n).fill(0));
            for (var i = 0; i < m; i++) {
                for (var j = 0; j < n; j++) {
                    for (var k = 0; k < p; k++) {
                        c[i][j] += a[i][k] * b[k][j]*1.0;
                    }
                }
            }
            return c
        },
        evaluateCardinalSplineSegment(points,tension){
            var G = [[points[0][0], points[0][1]],
                    [points[1][0], points[1][1]],
                    [points[2][0], points[2][1]],
                    [points[3][0], points[3][1]]
                    ];
            var k = 0.5 * (1 - tension);
            var M = [[-k,2-k,k-2,k],
                    [2*k,k-3,3-2*k,-k],
                    [-k,0,k,0],
                    [0,1,0,0]
                ];
            var C = multiply(M,G);
            // console.log(C);
            var result =new Array();
            var index=0;
            for (var t = 0; t <= 1.05; t += 0.05) {
                var T = [[t * t * t, t * t, t, 1]];
                // console.log(T);
                var p = multiply(T,C);
                // result.push(p)
                result[index]=[p[0][0],p[0][1]];
                index++;
                // console.log(t+"="+p[0][1]);
            }
            return result
        },
        evaluateKochanekBartelsSplineSegment(points, tension, bias, continuity){  
            var G = [[points[0][0], points[0][1]],
                    [points[1][0], points[1][1]],
                    [points[2][0], points[2][1]],
                    [points[3][0], points[3][1]]];
            var k = 0.5 * (1 - tension);
            var q1 = k * (1 + bias) * (1 - continuity);
            var q2 = k * (1 - bias) * (1 + continuity);
            var q3 = k * (1 + bias) * (1 + continuity);
            var q4 = k * (1 - bias) * (1 - continuity);
            var M = [[-q1, q1 - q2 - q3 + 2, q2 + q3 - q4 -2,  q4],
                    [2 * q1, q3 - 2 * q1 + 2 * q2 -3, q4 - q3 - 2 * q2 + 3, -q4],
                    [-q1, q1 - q2, q2, 0],
                    [ 0, 1,0, 0]];
            var C = multiply(M,G);
            var result =new Array();
            var index=0;
            for (var t = 0; t <= 1.05; t += 0.05) {
                var T = [[t * t * t, t * t, t, 1]];
                // console.log(T);
                var p = multiply(T,C);
                // result.push(p)
                result[index]=[p[0][0],p[0][1]];
                index++;
                // console.log(t+"="+p);
            }
            return result;
        },

    }
</script> 
