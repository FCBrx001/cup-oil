import requests
import json
from datetime import datetime
import os
import time

def get_next_month_date(date_str):
    """
    获取下一个月的日期（仅增加月份，保持日期不变）
    
    :param date_str: 格式为 'YYYY-MM-DD' 的日期字符串
    :return: 下一个月的相同日期（字符串格式）
    """
    date = datetime.strptime(date_str, '%Y-%m-%d')
    
    # 获取当前月的月份和年份
    year = date.year
    month = date.month
    day = date.day
    
    # 计算下一个月
    if month == 12:
        next_month = 1
        next_year = year + 1
    else:
        next_month = month + 1
        next_year = year
    
    # 直接组合新的日期字符串
    return f"{next_year:04d}-{next_month:02d}-{day:02d}"

def fetch_weather_data(lat, lon, start_date, end_date, api_key):
    """
    从WeatherBit API获取天气数据
    
    :param lat: 纬度
    :param lon: 经度
    :param start_date: 开始日期 (YYYY-MM-DD)
    :param end_date: 结束日期 (YYYY-MM-DD)
    :param api_key: WeatherBit API密钥
    :return: 返回的JSON响应
    """
    url = f"https://api.weatherbit.io/v2.0/history/subhourly"
    
    params = {
        "lat": lat,
        "lon": lon,
        "start_date": start_date,
        "end_date": end_date,
        "tz": "local",
        "key": api_key
    }
    
    print(f"正在请求 {start_date} 至 {end_date} 的数据...")
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # 如果请求失败则抛出异常
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"请求出错: {e}")
        return None

def save_to_file(data, start_date, end_date):
    """
    将JSON数据保存到文件
    
    :param data: JSON数据
    :param start_date: 开始日期
    :param end_date: 结束日期
    """
    # 创建data目录（如果不存在）
    output_dir = "weather_data_dongguan"  # 修改为weather_data_dongguan
    os.makedirs(output_dir, exist_ok=True)
    
    # 文件名格式: weather_YYYY-MM-DD_to_YYYY-MM-DD.json
    filename = f"{output_dir}/weather_{start_date}_to_{end_date}.json"
    
    # 检查目录是否存在
    directory = os.path.dirname(filename)
    if not os.path.exists(directory):
        print(f"创建目录: {directory}")
        os.makedirs(directory, exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"数据已保存到文件: {filename}")
    # 显示绝对路径
    abs_path = os.path.abspath(filename)
    print(f"绝对路径: {abs_path}")

def main():
    # 配置参数
    lat = 23.09784102
    lon = 113.4416599
    api_key = "ee0656f0adb343c780e3aab6ab3bca86"
    
    # 初始日期范围
    start_date = "2023-01-01"  # 根据错误信息调整初始日期
    end_date = "2023-02-01"
    
    # 结束日期
    final_date = "2025-04-01"
    
    # 转换为datetime对象以便比较
    final_datetime = datetime.strptime(final_date, '%Y-%m-%d')
    
    # 循环获取数据直到结束日期
    while datetime.strptime(start_date, '%Y-%m-%d') < final_datetime:
        # 获取数据
        data = fetch_weather_data(lat, lon, start_date, end_date, api_key)
        
        if data:
            # 保存数据到文件
            save_to_file(data, start_date, end_date)
            
            # 更新日期范围为下一个月
            start_date = end_date
            end_date = get_next_month_date(end_date)
            
            # 等待一段时间，避免API请求过于频繁
            print("等待3秒后继续...")
            time.sleep(3)
        else:
            print(f"无法获取 {start_date} 至 {end_date} 的数据，跳过...")
            # 即使获取失败，也继续下一个月
            start_date = end_date
            end_date = get_next_month_date(end_date)
            
            # 如果API请求失败，等待更长时间再重试
            print("等待10秒后继续...")
            time.sleep(10)
    
    print("所有数据收集完成！")

if __name__ == "__main__":
    main() 