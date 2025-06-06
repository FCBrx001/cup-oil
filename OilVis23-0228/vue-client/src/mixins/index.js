//在src根目录下创建一个mixins文件里面放一个index.js文件，index.js文件内与正常组件内没有区别
export default{
    data(){
        return{
            name:'mixins-hhhh',
            num:1
        }
    },
    methods:{
        test(){
            console.log("我是mixins的操作：",this.name,this.num)
        }
    },
    mounted(){
       
    },
    created(){

    }
}
/*
1. 当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。
比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
2. 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子之前调用。
3. 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。
 */