# -*- coding: utf-8 -*-   
# import os
# def getFlist(file_dir):
#     for root, dirs, files in os.walk(file_dir):
#         print('root_dir:', root)
#         print('sub_dirs:', dirs)
#         print('files:', files)
#     return files

# if __name__ == "__main__":
#    resDir = 'res'
#    flist = getFlist('./')
from genericpath import isdir
import os
import json
def read_directory(path,result):
    paths=os.listdir(path)
    for i,item in enumerate(paths):
        #print(item)
        sub_path=os.path.join(path,item);
        if(os.path.isdir(sub_path)):
            result[item]={}
            read_directory(sub_path,result[item])
        else:
            result[item]=item
if __name__=='__main__':
    fpath='./'
    filename='./json.txt'
    result={}
    read_directory(fpath,result)
    json_res=json.dumps(result,indent=2)
    #print(json_res)
    with open(filename,'w') as fp:
        fp.write(json_res)
