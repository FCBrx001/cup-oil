import numpy as np
import pandas as pd
import matplotlib.pyplot as plt  #2D绘图库
import math
#计算均值,要求输入数据为numpy的矩阵格式，行表示样本数，列表示特征
def meanX(dataX):
    return np.mean(dataX,axis=0)#axis=0表示按照列来求均值，如果输入list,则axis=1
def pca(XMat, k):
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
        reconData = (finalData * selectVec) + average
    return finalData, reconData
#输入文件的每行数据都以\t隔开
def loaddata(datafile):
    dfg = pd.read_csv('biwen15.csv')
    datag = dfg.iloc[:, :].values
    for i in range(datag.shape[0]):
        for j in range(datag.shape[1]):
            if math.isnan(datag[i,j]):
                datag[i,j]=datag[i-1,j]
    return datag
# def plotBestFit(data1, data2):
#     dataArr1 = np.array(data1)
#     dataArr2 = np.array(data2)

#     m = np.shape(dataArr1)[0]
#     axis_x1 = []
#     axis_y1 = []
#     axis_x2 = []
#     axis_y2 = []
#     for i in range(m):
#         axis_x1.append(dataArr1[i,0])
#         axis_y1.append(dataArr1[i,1])
#         axis_x2.append(dataArr2[i,0])
#         axis_y2.append(dataArr2[i,1])
#     fig = plt.figure()
#     ax = fig.add_subplot(111)
#     ax.scatter(axis_x1, axis_y1, s=50, c='red', marker='s')
#     ax.scatter(axis_x2, axis_y2, s=50, c='blue')
#     plt.xlabel('x1'); plt.ylabel('x2');
#     plt.savefig("outfile.png")
#     plt.show()
#根据数据集data.txt
def main():
    datafile = "biwen15.csv"
    XMat = loaddata(datafile)
    k = 10
    return pca(XMat, k)
if __name__ == "__main__":
    np.set_printoptions(suppress=True)  # 取消科学计数法输出
    finalData, reconMat = main()
    print(finalData)
    #plotBestFit(finalData, reconMat)
