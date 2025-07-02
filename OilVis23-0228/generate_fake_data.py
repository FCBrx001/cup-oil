import pandas as pd
import numpy as np
import time
from datetime import datetime, timedelta
import random


def generate_fake_data_with_time_range(start_date, end_date, interval_seconds=5, output_file="fake_data.xlsx"):
    """
    生成指定时间范围的假数据并保存为Excel文件

    参数:
    start_date: 开始时间，格式为"YYYY-MM-DD HH:MM:SS"
    end_date: 结束时间，格式为"YYYY-MM-DD HH:MM:SS"
    interval_seconds: 数据间隔秒数，默认5秒
    output_file: 输出文件名
    """

    # 设置随机种子，保证可重现性
    np.random.seed(42)
    random.seed(42)

    # 解析日期
    start_dt = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S")

    # 计算总秒数和记录数量
    total_seconds = int((end_dt - start_dt).total_seconds())
    num_records = total_seconds // interval_seconds + 1

    print(f"时间范围: {start_date} 到 {end_date}")
    print(f"数据间隔: {interval_seconds} 秒")
    print(f"预计生成: {num_records} 条记录")
    print(f"数据量较大，请稍等...")

    # 生成时间戳数据
    timestamps = []
    readable_times = []

    for i in range(num_records):
        current_time = start_dt + timedelta(seconds=i * interval_seconds)
        # Unix时间戳
        timestamp = int(current_time.timestamp())
        timestamps.append(timestamp)
        # 可读时间格式
        readable_times.append(current_time.strftime('%Y-%m-%d %H:%M:%S'))

    # 生成黄埔站预测压力数据（单位：MPa）
    base_pressure = 3.2
    pressure_data = []

    # 计算一天有多少个数据点 (24小时 * 3600秒 / interval_seconds)
    points_per_day = 24 * 3600 // interval_seconds

    for i in range(num_records):
        # 缓慢趋势变化
        trend = 0.001 * np.sin(i * 0.0001)
        # 日周期变化
        daily_cycle = 0.2 * np.sin(i * 2 * np.pi / points_per_day)
        # 随机噪声
        noise = np.random.normal(0, 0.05)

        pressure = base_pressure + trend + daily_cycle + noise
        # 确保压力值在合理范围内
        pressure = max(2.0, min(5.0, pressure))
        pressure_data.append(round(pressure, 3))

    # 生成黄埔站预测温度数据（单位：°C）
    base_temperature = 25
    temperature_data = []

    # 计算一年有多少个数据点
    points_per_year = 365 * 24 * 3600 // interval_seconds

    for i in range(num_records):
        # 季节性变化（年周期）
        seasonal = 8 * np.sin(i * 2 * np.pi / points_per_year)
        # 日温差
        daily_cycle = 5 * np.sin(i * 2 * np.pi / points_per_day)
        # 随机波动
        noise = np.random.normal(0, 1.0)

        temperature = base_temperature + seasonal + daily_cycle + noise
        # 确保温度在合理范围内
        temperature = max(5, min(45, temperature))
        temperature_data.append(round(temperature, 2))

    # 创建DataFrame
    data = {
        'time': timestamps,
        'readable_time': readable_times,
        '阀室2预测压力': pressure_data,
        '阀室2预测温度': temperature_data
    }

    df = pd.DataFrame(data)

    # 保存为Excel文件
    try:
        df.to_excel(output_file, index=False, engine='openpyxl')
        print(f"\n成功生成文件: {output_file}")
        print(f"总记录数: {len(df)}")
        print(f"文件大小: 约 {len(df) * 0.1:.1f} KB")

        # 显示前5行和后5行数据预览
        print("\n数据预览（前5行）:")
        print(df.head()[['readable_time', '阀室2预测压力', '阀室2预测温度']].to_string(index=False))

        print("\n数据预览（后5行）:")
        print(df.tail()[['readable_time', '阀室2预测压力', '阀室2预测温度']].to_string(index=False))

        # 验证时间间隔
        if len(df) > 1:
            time_diff = df['time'].iloc[1] - df['time'].iloc[0]
            print(f"\n验证: 实际时间间隔为 {time_diff} 秒")

        return df

    except Exception as e:
        print(f"保存文件时出错: {e}")
        return None


def generate_fake_data(num_records=1000, output_file="fake_data.xlsx"):
    """
    生成指定数量的假数据（向前推算时间）
    """
    # 从当前时间向前推算
    end_time = datetime.now()
    start_time = end_time - timedelta(seconds=num_records * 5)

    start_date = start_time.strftime("%Y-%m-%d %H:%M:%S")
    end_date = end_time.strftime("%Y-%m-%d %H:%M:%S")

    return generate_fake_data_with_time_range(start_date, end_date, 5, output_file)


def generate_custom_data(start_date=None, end_date=None, interval_seconds=5, output_file="custom_fake_data.xlsx"):
    """
    生成自定义时间范围的假数据

    参数:
    start_date: 开始日期，格式为"YYYY-MM-DD HH:MM:SS"
    end_date: 结束日期，格式为"YYYY-MM-DD HH:MM:SS"
    interval_seconds: 数据间隔秒数，默认5秒
    output_file: 输出文件名
    """

    if start_date is None:
        start_date = "2023-01-01 00:00:00"
    if end_date is None:
        end_date = "2023-03-01 00:00:00"

    # 解析日期
    start_dt = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d %H:%M:%S")

    # 计算记录数量
    total_seconds = int((end_dt - start_dt).total_seconds())
    num_records = total_seconds // interval_seconds + 1

    print(f"将生成从 {start_date} 到 {end_date} 的数据")
    print(f"数据间隔：{interval_seconds} 秒")
    print(f"预计生成 {num_records} 条记录")

    return generate_fake_data(num_records, output_file)


if __name__ == "__main__":
    # 示例1：生成默认的1000条数据
    # print("=== 生成默认假数据 ===")
    # generate_fake_data(1000, "fashi1_station_data.xlsx")

    print("\n" + "=" * 50 + "\n")

    # 示例2：生成自定义时间范围的数据
    print("=== 生成自定义时间范围假数据 ===")
    generate_fake_data_with_time_range(
        start_date="2023-01-01 00:00:00",
        end_date="2023-03-01 00:00:00",
        interval_seconds=5,
        output_file="fashi2_station_2023_jan_mar.xlsx"
    ) 