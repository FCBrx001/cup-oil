import json
import pandas as pd
import os
import glob

def convert_json_to_excel(json_file_path, excel_filename):
    """
    将 JSON 文件中的数据转换为 Excel 文件。

    :param json_file_path: JSON 文件的路径。
    :param excel_filename: 输出的 Excel 文件名。
    """
    try:
        # 从 JSON 文件加载数据
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # 提取 "data" 键中的列表，这是我们表格的主体数据
        # 使用 pd.json_normalize 可以很好地处理嵌套的 JSON，比如 "weather" 字段
        df = pd.json_normalize(data['data'])
        
        # 添加城市信息作为额外列
        df['city_id'] = data.get('city_id', '')
        df['city_name'] = data.get('city_name', '')
        df['country_code'] = data.get('country_code', '')
        df['latitude'] = data.get('lat', '')
        df['longitude'] = data.get('lon', '')
        
        # 将 DataFrame 保存到 Excel 文件
        df.to_excel(excel_filename, index=False, engine='openpyxl')
        print(f"成功将数据从 '{json_file_path}' 转换并保存到 '{excel_filename}'")
        
    except FileNotFoundError:
        print(f"错误: 找不到文件 '{json_file_path}'")
    except json.JSONDecodeError:
        print(f"错误: '{json_file_path}' 不是有效的 JSON 文件")
    except KeyError:
        print(f"错误: JSON 文件中没有 'data' 键")
    except Exception as e:
        print(f"处理 '{json_file_path}' 时发生错误: {str(e)}")

def batch_convert_json_to_excel():
    """
    批量转换 weather_data_dongguan 目录下的所有 JSON 文件为 Excel 文件
    """
    # 输入和输出目录
    input_dir = "weather_data_dongguan"  # 修改为weather_data_dongguan
    output_dir = "weather_excel_dongguan"  # 修改为weather_excel_dongguan
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 获取 weather_data_dongguan 目录下的所有 JSON 文件
    json_files = glob.glob(f"{input_dir}/*.json")
    
    if not json_files:
        print(f"未找到任何 JSON 文件在 '{input_dir}' 目录！")
        return
    
    print(f"找到 {len(json_files)} 个 JSON 文件，开始转换...")
    
    # 遍历并转换每个文件
    for json_file in json_files:
        # 从文件名中提取日期信息
        base_name = os.path.basename(json_file)
        excel_name = base_name.replace(".json", ".xlsx")
        excel_path = os.path.join(output_dir, excel_name)
        
        # 转换文件
        convert_json_to_excel(json_file, excel_path)
    
    print("批量转换完成！")
    print(f"Excel 文件已保存在 '{os.path.abspath(output_dir)}' 目录")

if __name__ == "__main__":
    batch_convert_json_to_excel() 