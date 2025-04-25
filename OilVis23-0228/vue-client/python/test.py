from flask import Flask, json,jsonify
from flask import abort
from flask import make_response
from flask import request
from flask_cors import CORS
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt  #2D绘图库
import math
#from flask_cors import*
import csv
app = Flask(__name__)

# 这里默认的是get请求方式

# def hello_world():
#     arr=[]
#     reader = csv.reader(open('data/accident.csv','r'))
#     t={}
#     for row in reader:
#        arr.append(row)
#     print(arr)
#     t['data']=arr
#     return json.dumps(t,ensure_ascii=False)
# if __name__ == '__main__':
#     CORS(app,support_credentials=True)
#     app.run(host='0.0.0.0', port=8001, debug=True)
# 这里host是你的后端地址，这里写0.0.0.0， 表示的是这个接口在任何服务器上都可以被访问的到，只需要前端访问该服务器地址就可以的，
# 当然你也可以写死，如222.222.222.222， 那么前端只能访问222.222.222.222, port是该接口的端口号,
# debug = True ,表示的是，调试模式，每次修改代码后不用重新启动服务
#计算均值,要求输入数据为numpy的矩阵格式，行表示样本数，列表示特征
class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, time):
            return obj.__str__()
        else:
            return super(NpEncoder, self).default(obj)
def meanX(dataX):
    return np.mean(dataX,axis=0)#axis=0表示按照列来求均值，如果输入list,则axis=1

#@app.route('/yrr')
def pca(XMat, k):
    print("pca")
    average = meanX(XMat)
    m, n = np.shape(XMat)
    data_adjust = []
    avgs = np.tile(average, (m, 1))
    data_adjust = XMat - avgs
    covX = np.cov(data_adjust.T)   #计算协方差矩阵
    featValue, featVec=  np.linalg.eig(covX)  #求解协方差矩阵的特征值和特征向量
    index = np.argsort(-featValue) #按照featValue进行从大到小排序
    finalData = []
    if k > n:
        print ("k must lower than feature number")
        return
    else:
        #注意特征向量时列向量，而numpy的二维矩阵(数组)a[m][n]中，a[1]表示第1行值
        selectVec = np.matrix(featVec.T[index[:k]]) #所以这里需要进行转置
        finalData = data_adjust * selectVec.T
        #reconData = (finalData * selectVec) + average
    print(finalData)
    t={}
    t['data']=finalData
    return json.dumps(t, cls=MyEncoder) 
#输入文件的每行数据都以\t隔开
def loaddata(datafile):
    print("loaddata")
    dfg = pd.read_csv(datafile)
    datag = dfg.iloc[:, :].values
    for i in range(datag.shape[0]):
        for j in range(datag.shape[1]):
            if math.isnan(datag[i,j]):  
                datag[i,j]=datag[i-1,j]
    return datag
# def main(datafile):
#     print("main")
#     XMat = loaddata(datafile)
#     k = 10
#     return pca(XMat, k)
@app.route('/yrr')
def returnData():
    print("main")
    XMat = loaddata( "biwen15.csv")
    k = 10
    print("pca")
    average = meanX(XMat)
    m, n = np.shape(XMat)
    data_adjust = []
    avgs = np.tile(average, (m, 1))
    data_adjust = XMat - avgs
    covX = np.cov(data_adjust.T)   #计算协方差矩阵
    featValue, featVec=  np.linalg.eig(covX)  #求解协方差矩阵的特征值和特征向量
    index = np.argsort(-featValue) #按照featValue进行从大到小排序
    finalData = []
    if k > n:
        print ("k must lower than feature number")
        return
    else:
        #注意特征向量时列向量，而numpy的二维矩阵(数组)a[m][n]中，a[1]表示第1行值
        selectVec = np.matrix(featVec.T[index[:k]]) #所以这里需要进行转置
        finalData = data_adjust * selectVec.T
        #reconData = (finalData * selectVec) + average
    print(finalData)
    t={}
    t['data']=finalData
    return json.dumps(t, cls=MyEncoder) 
if __name__ == "__main__":
    np.set_printoptions(suppress=True)  # 取消科学计数法输出
    CORS(app,support_credentials=True)
    app.run(host='0.0.0.0', port=8001, debug=True)
    # datafile = "biwen15.csv"
    # main(datafile)
    
    