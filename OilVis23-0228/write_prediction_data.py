import pymongo
import time
from datetime import datetime
import random

def write_prediction_data():
    """
    每5秒向MongoDB数据库写入一条预测数据
    """
    try:
        # 连接MongoDB数据库
        client = pymongo.MongoClient("mongodb://localhost:27017/")
        db = client["计算结果"]
        collection = db["黄埔站预测数据"]
        
        print("成功连接到MongoDB数据库")
        print("开始写入预测数据...")
        
        while True:
            # 生成当前时间戳
            current_timestamp = int(time.time())
            
            # 生成模拟的预测数据
            # 压力范围：2.5-4.0 MPa
            predicted_pressure = round(random.uniform(2.5, 4.0), 3)
            # 温度范围：20-30 摄氏度
            predicted_temperature = round(random.uniform(20.0, 30.0), 1)
            
            # 构建数据文档
            data_doc = {
                "time": current_timestamp,
                "黄埔站预测压力": predicted_pressure,
                "黄埔站预测温度": predicted_temperature
            }
            
            # 插入数据到数据库
            result = collection.insert_one(data_doc)
            
            # 打印插入结果
            current_time = datetime.fromtimestamp(current_timestamp).strftime('%Y-%m-%d %H:%M:%S')
            print(f"[{current_time}] 插入数据成功 - ID: {result.inserted_id}")
            print(f"  预测压力: {predicted_pressure} MPa")
            print(f"  预测温度: {predicted_temperature} °C")
            print("-" * 50)
            
            # 等待5秒
            time.sleep(5)
            
    except pymongo.errors.ConnectionFailure:
        print("错误：无法连接到MongoDB数据库，请确保MongoDB服务正在运行")
    except KeyboardInterrupt:
        print("\n程序被用户中断")
    except Exception as e:
        print(f"发生错误: {e}")
    finally:
        if 'client' in locals():
            client.close()
            print("数据库连接已关闭")

if __name__ == "__main__":
    print("启动预测数据写入程序...")
    print("按 Ctrl+C 停止程序")
    write_prediction_data() 