//内容主题
function themeEnglish(d){
	if(d === "程序设计") return "program design";
	if(d === "应用技术") return "applied technology";
	if(d === "数据库") return "database";
	if(d === "计算机组成") return "computer composition";
	if(d === "计算机网络") return "computer network";
	if(d === "操作系统") return "operating system";
	if(d === "基础理论") return "basic theory";
	if(d === "计算机硬件") return "computer hardware";
	if(d === "工程实习") return "engineering practice";
	if(d === "数据结构") return "data structure";
	if(d === "导学课程") return "guidance course";
	 return d;
}
function typeEnglish(d){
	if(d === "必修") return "compulsory";
	if(d === "选修") return "elective";  
	if(d === "理论") return "theoretical";
	if(d === "实践") return "practical";
	if(d === "低学分") return "low";
	if(d === "高学分") return "high";
	return d;
}
function courseEnglish(d){
	//Object-Oriented Program === OOP
	if(d === "C语言程序设计") return "C Program";//
	if(d === "计算机导论") return "Intro to Computers";
	if(d === "数据结构") return "Data Structure";//
	if(d === "数据结构课程设计") return "CD of Data Structure";//
	if(d === "C语言课程设计") return "CD of C Language";//
	//认识实习
	if(d === "认识实习") return "Cognition practice";
	if(d === "离散数学") return "Discrete Mathematics";
	if(d === "C加加面向对象程序设计"||d==="C++面向对象程序设计") return "C++ Programing";
	//数字逻辑
	if(d === "数字逻辑") return "Digital logic";
	if(d === "汇编语言程序设计") return "Assembly Programing";
	if(d === "Java语言程序设计") return "Java Programing";     
	if(d === "Windows程序设计"||d === "Windows程序设计(VisualC++)") return "Windows Programing";
	if(d === "面向对象软件设计实习") return "OOP Practice";
	if(d === "操作系统课程设计") return "CD of OS";
	if(d === "计算机组成原理与汇编语言课程设计") return "CD of Composition and Assembly";//
	if(d === "UML与系统建模") return "UML and System Modeling";
	if(d === "数据库原理") return "Principle of Database";
	if(d === "计算机组成原理") return "Computer Composition"; 
	if(d === "计算机网络原理") return "Computer Network";
	if(d === "C__面向对象分析与设计"||d==="C#面向对象分析与设计") return "C# Programing";
	if(d === "操作系统") return "OS";
	if(d === "软件工程") return "SE";
	if(d === "编译原理") return "Principle of Compiling";
	if(d === "Unix/Linux系统管理"||d === "UnixLinux系统管理") return "Unix/Linux System MGT";
	if(d === "嵌入式系统") return "Embedded System";
	if(d === "数据库管理(Oracle)"|| d==="数据库管理_Oracle") return "Database MGT(Oracle)";
	if(d === "多媒体技术") return "Multimedia Tech";
	if(d === "计算机接口技术") return "Computer Interface Tech";
	if(d === "人工智能导论") return "Intro of AI";
	if(d === "软件设计与体系结构") return "Soft Design and Arch";
	if(d === "计算机图形学") return "Computer Graphics";
	if(d === "数据库课程设计") return "CD of Database";
	if(d === "计算机网络实习") return "Network Practice";
	if(d === "计算机系统结构") return "Computer Arch";
	if(d === "软件工程实习") return "SE Practice";
	if(d === "毕业设计") return "Graduation proj";
	if(d === "离散数学") return "Discrete Mathematics";
	if(d==="计算机硬件认识和使用") return "hardware understand and use";
	if(d==="数据库管理") return "Database MGT";
	if(d==="计算机组成原理与汇编语言") return "Prin of Composition and Assembly";
	if(d==="局域网组网技术实验") return "LAN networking tech";
	if(d==="信息安全") return "information security";
	if(d==="软件测试") return "software test";
	if(d==="专业实习") return "Professional internship";
	if(d===".NET程序设计") return ".Net programming";
	if(d==="Windows程序开发") return "windows program development";
	if(d==="动态网页设计与网站建设") return "Dynamic web design and construction";
	return d;
}
function courseEnglishAll(d){
	//Object-Oriented Program === OOP
	if(d === "C语言程序设计") return "Programming with C Language";
	if(d === "计算机导论") return "Introduction to Computers";
	if(d === "数据结构") return "Data Structure";
	if(d === "数据结构课程设计") return "Course Design of Data Structure";
	if(d === "C语言课程设计") return "Course Design of C Language";
	//认识实习
	if(d === "认识实习") return "Cognition practice";
	if(d === "离散数学") return "Discrete Mathematics";
	if(d === "C加加面向对象程序设计"||d==="C++面向对象程序设计") return "C++ OOP Design";
	//数字逻辑
	if(d === "数字逻辑") return "Digital logic";
	if(d === "汇编语言程序设计") return "Assembly Language programming";
	if(d === "Java语言程序设计") return "Java Language programming";
	if(d === "Windows程序设计(VisualC++)"||d === "Windows程序设计") return "Windows programming(VisualC++)";
	if(d === "面向对象软件设计实习") return "Object Oriented Soft Design Practice";
	if(d === "操作系统课程设计") return "Course Design of Operating System";
	if(d === "计算机组成原理与汇编语言课程设计") return "Course Design of Computer Composition Principle and Assembly Language";
	if(d === "UML与系统建模") return "UML and System Modeling";
	if(d === "数据库原理") return "Principle of Database";
	if(d === "计算机组成原理") return "Computer Composition Principle";
	if(d === "计算机网络原理") return "Principle of Computer Network";
	if(d === "C__面向对象分析与设计"||d==="C#面向对象分析与设计") return "C# OOP Design";
	if(d === "操作系统") return "Operatom Systems";
	if(d === "软件工程") return "Soft Engineering";
	if(d === "编译原理") return "Principle of Compiling";
	if(d === "Unix/Linux系统管理"||d === "UnixLinux系统管理") return "Unix/Linux System Management";
	if(d === "嵌入式系统") return "Embedded System";
	if(d === "数据库管理(Oracle)"||d === "数据库管理_Oracle") return "Database Management(Oracle)";
	if(d === "多媒体技术") return "Multimedia Technology";
	if(d === "计算机接口技术") return "Computer Interface Technology";
	if(d === "人工智能导论") return "Introduction of Artificial Intelligence";
	if(d === "软件设计与体系结构") return "Soft Design and Architecture";
	if(d === "计算机图形学") return "Computer Graphics";
	if(d === "数据库课程设计") return "Course Design of Database";
	if(d === "计算机网络实习") return "The Computer Network Practice";
	if(d === "计算机系统结构") return "Computer Architecture";
	if(d === "软件工程实习") return "Soft Engineering Practice";
	if(d === "计算机硬件认识和使用") return "The Understanding and Use of Computer Hardware";
	if(d === "计算机组成原理与汇编语言") return "Computer Composition Principle and Assembly Language";
	if(d === "数据库管理") return "Database Principle";
	if(d === "局域网组网技术实验") return "LAN Technology Experiment";
	if(d === "软件测试") return "Soft Testing";
	if(d === "信息安全") return "Information Security";
	if(d === "Windows程序开发") return "Windows Program Design";
	if(d === "动态网页设计与网站建设") return "Web Design and Website Construction";
	if(d === ".NET程序设计") return ".NET Program Design";
	if(d === "专业实习") return "Profession Practice";
	if(d === "软件工程实践") return "Soft Engineering Practice";
	if(d === "高级语言程序设计（Ⅰ）") return "High Level Language Program Design(I)";
	if(d === "离散数学（I）") return "Discrete Mathematics(I)";
	if(d === "离散数学（II）") return "Discrete Mathematics(II)";
	if(d === "算法设计与分析") return "Algorithm Design and Analysis";
	if(d === "Android移动终端开发") return "Android Mobile Terminal Development";
	if(d === "毕业设计") return "Graduation project";
	if(d===".NET程序设计"||d==="NET程序设计") return ".Net programming";
	return d;
}
function semEnglish(d){
	if(d==="评分")
		return "score";
	else if(d==="教师")
		return "teacher";
	else if(d==="课程")
		return "course";
	else if(d==="数量")
		return "account";
	else if(d==="学生")
		return "student";
		return d;
	
}
function toEnglish(d){
	if(d === "成绩分布") return "Score distribution";
	if(d === "授课数") return "Number of lectures";  
	if(d === "职称") return "professional title";
	return d;
	
}
function typeEnglishAll(d){
	if(d === "必修") return "Compulsory";
	if(d === "选修") return "Elective";  
	if(d === "理论课程") return "Theoretical";
	if(d === "实践实验") return "Practical";
	if(d === "低学分") return "Low";
	if(d === "高学分") return "High";
	if(d === "课程")  return "Course"
	if(d === "教师") return "Instructor";
	if(d === "教授") return "Prof";  
	if(d === "副教授") return "A.Prof";
	if(d === "讲师") return "Lecturer";
	if(d === "男") return "Male";
	if(d === "女") return "Female";

}