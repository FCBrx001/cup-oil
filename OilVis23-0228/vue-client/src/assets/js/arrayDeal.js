//对象转数组
function transform(obj){
	var arr = [];
	for(var item in obj){
		arr.push(obj[item]);
	}
	return arr;
}

function transform5(arr){
	var arr2=arr.slice(0,arr.length-2);
	arr2.removeByValue2("");
	arr2.removeByValue2(0);
	return arr2;
}

Array.prototype.contains = function (obj) {
	var i = this.length;
	while (i--) {
		/*if((typeof obj) === "object"){
			return JSON.stringify(this[i])===JSON.stringify(obj);
		}*/
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}

Array.prototype.removeByValue = function(val) {
	for(var i=0; i<this.length; i++) {
		if(this[i] == val) {
			this.splice(i, 1);
			break;
		}
	}
}

//统计数组元素出现的次数
Array.prototype.eleNum = function(val) {
	var num=0;
	for(var i=0;i<this.length;i++){
		if(this[i]==val)
			num++;
	}
	return num;
}

//去除重复元素
Array.prototype.moveRepetition = function(){ 
   var arr = [];    //定义一个临时数组 
   for(var i = 0; i < this.length; i++){    //循环遍历当前数组 
       //判断当前数组下标为i的元素是否已经保存到临时数组 
       //如果已保存，则跳过，否则将此元素保存到临时数组中 
       if(arr.indexOf(this[i]) == -1){ 
           arr.push(this[i]); 
       } 
   } 
   return arr; 
}

//去掉数组中的重复元素
Array.prototype.deleteEle = function(){
	var newArr = this;
	for(var i=newArr.length-1; i>=0; i--){
		var targetNode = newArr[i];
		for(var j=0; j < i; j++){
			if(targetNode == newArr[j]){
				newArr.splice(i,1);
				break;
			}
		}
	}
	return newArr;
}

//移除数组中的元素
Array.prototype.removeByValue2 = function(val) {
	var arr=this;
	var len=arr.length;
	var j=0;
	while(j<len){
		for(var i=0; i<arr.length; i++) {
			if(arr[i] == val) {
				arr.splice(i, 1);
				break;
			}
		}
		j++;
	}
	return arr;
}