import pandas as pd
import pymongo
from datetime import datetime
import numpy as np
from tqdm import tqdm
import sys

def excel_to_mongodb(excel_file, mongo_url, db_name, collection_name, batch_size=1000):
    """
    将Excel文件数据导入MongoDB
    
    参数:
    excel_file: Excel文件路径
    mongo_url: MongoDB连接URL
    db_name: 数据库名称
    collection_name: 集合名称
    batch_size: 批量插入的记录数，默认1000
    """
    
    try:
        # 连接MongoDB
        print("正在连接MongoDB...")
        client = pymongo.MongoClient(mongo_url)
        db = client[db_name]
        collection = db[collection_name]
        
        # 测试连接
        client.admin.command('ping')
        print("✓ MongoDB连接成功")
        
        # 读取Excel文件
        print(f"正在读取Excel文件: {excel_file}")
        df = pd.read_excel(excel_file)
        
        print(f"✓ Excel文件读取成功")
        print(f"数据行数: {len(df)}")
        print(f"数据列数: {len(df.columns)}")
        print(f"列名: {list(df.columns)}")
        
        # 清空现有数据（可选）
        response = input("是否清空现有集合数据？(y/n): ")
        if response.lower() == 'y':
            result = collection.delete_many({})
            print(f"✓ 已清空 {result.deleted_count} 条现有数据")
        
        # 数据预处理
        print("正在预处理数据...")
        records = []
        
        for index, row in df.iterrows():
            # 构建文档结构 - 只包含必要字段
            document = {
                "time": int(row['time']),  # Unix时间戳
                "阀室2预测压力": float(row['阀室2预测压力']),  # 压力值
                "阀室2预测温度": float(row['阀室2预测温度'])   # 温度值
            }
            
            records.append(document)
        
        print(f"✓ 数据预处理完成，共 {len(records)} 条记录")
        
        # 批量插入数据
        print("正在批量插入数据到MongoDB...")
        total_batches = (len(records) + batch_size - 1) // batch_size
        
        with tqdm(total=len(records), desc="插入进度") as pbar:
            for i in range(0, len(records), batch_size):
                batch = records[i:i + batch_size]
                try:
                    result = collection.insert_many(batch)
                    pbar.update(len(batch))
                except Exception as e:
                    print(f"批量插入错误 (批次 {i//batch_size + 1}): {e}")
                    continue
        
        # 验证插入结果
        total_count = collection.count_documents({})
        print(f"\n✓ 数据插入完成！")
        print(f"数据库中总记录数: {total_count}")
        
        # 创建索引以提高查询性能
        print("正在创建索引...")
        try:
            collection.create_index("time")
            print("✓ 索引创建成功")
        except Exception as e:
            print(f"索引创建警告: {e}")
        
        # 显示一些示例数据
        print("\n数据样例（前3条）:")
        sample_docs = list(collection.find().limit(3))
        for i, doc in enumerate(sample_docs, 1):
            print(f"记录 {i}:")
            print(f"  时间戳: {doc['time']}")
            print(f"  压力: {doc['阀室2预测压力']} MPa")
            print(f"  温度: {doc['阀室2预测温度']} °C")
            print()
        
        # 统计信息
        print("数据统计:")
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "avg_pressure": {"$avg": "$阀室2预测压力"},
                    "min_pressure": {"$min": "$阀室2预测压力"},
                    "max_pressure": {"$max": "$阀室2预测压力"},
                    "avg_temperature": {"$avg": "$阀室2预测温度"},
                    "min_temperature": {"$min": "$阀室2预测温度"},
                    "max_temperature": {"$max": "$阀室2预测温度"},
                    "count": {"$sum": 1}
                }
            }
        ]
        
        stats = list(collection.aggregate(pipeline))
        if stats:
            stat = stats[0]
            print(f"  总记录数: {stat['count']}")
            print(f"  压力范围: {stat['min_pressure']:.3f} - {stat['max_pressure']:.3f} MPa")
            print(f"  平均压力: {stat['avg_pressure']:.3f} MPa")
            print(f"  温度范围: {stat['min_temperature']:.2f} - {stat['max_temperature']:.2f} °C")
            print(f"  平均温度: {stat['avg_temperature']:.2f} °C")
        
        client.close()
        print("\n✓ 数据导入完成，连接已关闭")
        
        return True
        
    except FileNotFoundError:
        print(f"❌ 错误: 找不到文件 {excel_file}")
        return False
    except pymongo.errors.ConnectionFailure:
        print("❌ 错误: 无法连接到MongoDB服务器")
        return False
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False

def query_sample_data(mongo_url, db_name, collection_name, limit=5):
    """
    查询示例数据
    """
    try:
        client = pymongo.MongoClient(mongo_url)
        db = client[db_name]
        collection = db[collection_name]
        
        print(f"查询 {collection_name} 集合中的前 {limit} 条数据:")
        
        docs = list(collection.find().limit(limit))
        for i, doc in enumerate(docs, 1):
            readable_time = datetime.fromtimestamp(doc['time']).strftime('%Y-%m-%d %H:%M:%S')
            print(f"记录 {i}: {readable_time} - 压力:{doc['阀室2预测压力']}MPa 温度:{doc['阀室2预测温度']}°C")
        
        total = collection.count_documents({})
        print(f"\n总记录数: {total}")
        
        client.close()
        
    except Exception as e:
        print(f"查询错误: {e}")

if __name__ == "__main__":
    # MongoDB配置
    mongo_url = 'mongodb://root:examplepassword@10.1.16.50:9101'
    db_name = "计算结果"
    collection_name = "阀室2预测数据"
    
    # Excel文件路径
    excel_file = "fashi2_station_2023_jan_mar.xlsx"
    
    print("=== Excel数据导入MongoDB ===")
    print(f"MongoDB URL: {mongo_url}")
    print(f"数据库: {db_name}")
    print(f"集合: {collection_name}")
    print(f"Excel文件: {excel_file}")
    print()
    
    # 检查文件是否存在
    import os
    if not os.path.exists(excel_file):
        print(f"❌ 错误: 找不到文件 {excel_file}")
        print("请确认文件路径正确，或先运行 generate_fake_data.py 生成数据文件")
        sys.exit(1)
    
    # 执行导入
    success = excel_to_mongodb(excel_file, mongo_url, db_name, collection_name)
    
    if success:
        print("\n=== 查询验证 ===")
        query_sample_data(mongo_url, db_name, collection_name)
    else:
        print("❌ 数据导入失败") 