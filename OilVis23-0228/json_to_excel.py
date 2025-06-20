import json
import pandas as pd
import os

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
        
        # 将 DataFrame 保存到 Excel 文件
        # index=False 表示我们不将 DataFrame 的索引写入 Excel 文件
        df.to_excel(excel_filename, index=False, engine='openpyxl')
        print(f"成功将数据从 '{json_file_path}' 转换并保存到 '{excel_filename}'")
        
        # 显示文件的绝对路径，方便用户找到
        abs_path = os.path.abspath(excel_filename)
        print(f"Excel 文件保存在: {abs_path}")
        
    except FileNotFoundError:
        print(f"错误: 找不到文件 '{json_file_path}'")
    except json.JSONDecodeError:
        print(f"错误: '{json_file_path}' 不是有效的 JSON 文件")
    except KeyError:
        print(f"错误: JSON 文件中没有 'data' 键")
    except Exception as e:
        print(f"发生错误: {str(e)}")


if __name__ == '__main__':
    # 输入和输出文件名
    json_file = 'response.json'
    output_file = 'weather_data.xlsx'
    
    # 执行转换
    convert_json_to_excel(json_file, output_file) 