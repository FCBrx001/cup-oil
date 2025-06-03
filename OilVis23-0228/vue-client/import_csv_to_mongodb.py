import pandas as pd
from pymongo import MongoClient
import os

# MongoDB configuration
mongo_url = 'mongodb://root:examplepassword@10.1.16.50:9101'
client = MongoClient(mongo_url)
db = client["黄埔-东莞管段"]
collection = db["2023年3月-4月"]

# CSV file path
file_path = r'C:\Users\lenovo\Desktop\项目二期\数据\副本2023年3月&4月.csv'

# Print file size and existence check
if os.path.exists(file_path):
    print(f"File exists. Size: {os.path.getsize(file_path) / (1024*1024):.2f} MB")
else:
    print(f"File does not exist: {file_path}")
    exit(1)

# Column mapping
column_mapping = {
    "时间": "time",
    "STN11_00_PI001": "STN11_00_PI001",
    "STN10_00_PI019A": "STN10_00_PI019A",
    "STN10_00_II002": "STN10_00_II002",
    "STN11_00_DI001A": "STN11_00_DI001A",
    "STN10_05_TI501": "STN10_05_TI501",
    "STN10_00_PI019": "STN10_00_PI019",
    "STN11_00_FI004": "STN11_00_FI004",
    "STN10_00_II002B": "STN10_00_II002B",
    "STN11_00_PI001A": "STN11_00_PI001A",
    "STN10_05_PI501": "STN10_05_PI501",
    "STN10_00_PI018A": "STN10_00_PI018A",
    "STN10_00_II001": "STN10_00_II001",
    "STN10_00_TI002": "STN10_00_TI002",
    "STN10_05_PI502": "STN10_05_PI502",
    "STN10_00_PI018B": "STN10_00_PI018B",
    "STN10_00_II001B": "STN10_00_II001B",
    "STN11_00_FI001": "STN11_00_FI001",
    "STN11_00_TI001": "STN11_00_TI001",
    "STN10_05_TI502": "STN10_05_TI502",
    "STN10_00_FV016_MOUT": "STN10_00_FV016_MOUT",
    "STN10_00_ZI016": "STN10_00_ZI016",
    "STN10_00_FV017_MOUT": "STN10_00_FV017_MOUT",
    "STN10_00_ZI017A": "STN10_00_ZI017A",
    "STN11_00_ZLC011": "STN11_00_ZLC011",
    "STN11_00_ZLO011": "STN11_00_ZLO011",
    "STN10_00_ZLC017": "STN10_00_ZLC017",
    "STN10_00_ZLO017": "STN10_00_ZLO017"
}

# Try different encodings and delimiters
encodings_to_try = ['latin1', 'cp936', 'utf-8', 'utf-8-sig', 'gb18030', 'gbk', 'gb2312']
delimiters_to_try = [',', ';', '\t', '|']

# First, try to read a few lines to inspect the file
try:
    with open(file_path, 'rb') as f:
        raw_data = f.read(1000)  # Read first 1000 bytes
    print("First few bytes (hex):", raw_data.hex()[:100])
    
    # Try to detect BOM
    if raw_data.startswith(b'\xef\xbb\xbf'):
        print("UTF-8 BOM detected")
    elif raw_data.startswith(b'\xff\xfe') or raw_data.startswith(b'\xfe\xff'):
        print("UTF-16 BOM detected")
except Exception as e:
    print(f"Error reading file: {str(e)}")

success = False

for encoding in encodings_to_try:
    if success:
        break
        
    for delimiter in delimiters_to_try:
        try:
            print(f"Trying encoding: {encoding}, delimiter: '{delimiter}'")
            
            # Try reading with error handling
            df = pd.read_csv(
                file_path, 
                encoding=encoding, 
                sep=delimiter,
                error_bad_lines=False,  # Skip bad lines
                warn_bad_lines=True,    # Warn about bad lines
                low_memory=False        # Load all data into memory
            )
            
            print(f"Successfully read with encoding: {encoding}, delimiter: '{delimiter}'")
            print(f"DataFrame shape: {df.shape}")
            print("CSV actual column names:", df.columns.tolist())
            
            # Check if the required columns exist
            missing_columns = [col for col in column_mapping.keys() if col not in df.columns]
            if missing_columns:
                print(f"Missing columns in CSV: {missing_columns}")
                continue
            
            # Select and rename columns
            selected_columns = df[column_mapping.keys()].rename(columns=column_mapping)

            # Process the "time" column if it exists
            if 'time' in selected_columns.columns:
                selected_columns['time'] = pd.to_datetime(selected_columns['time'], errors='coerce', utc=False)
                # Drop rows with invalid dates
                selected_columns = selected_columns.dropna(subset=['time'])
                selected_columns['time'] = selected_columns['time'].astype('int64') // 10 ** 9
                selected_columns['time'] -= 8 * 3600  # Adjust to UTC

            # Convert to MongoDB documents
            data = selected_columns.to_dict("records")

            # Insert data into MongoDB
            if data:
                collection.insert_many(data)
                print(f"Successfully imported {len(data)} records (timestamps in seconds).")
                success = True
            else:
                print("No valid data to import.")
            
            # If we got here without errors, break the loop
            break
            
        except KeyError as e:
            print(f"Column missing in CSV: {e}")
        except Exception as e:
            print(f"Error with encoding {encoding}, delimiter '{delimiter}': {str(e)}")

if not success:
    print("\nAll attempts failed. Let's try a different approach.")
    try:
        # Try to read the file with the most permissive settings
        print("Trying to read with engine='python' and most permissive settings...")
        df = pd.read_csv(
            file_path,
            encoding='latin1',  # Latin1 can read any byte
            engine='python',    # More flexible but slower engine
            sep=None,           # Auto-detect separator
            error_bad_lines=False,
            warn_bad_lines=True,
            low_memory=False
        )
        print("Successfully read the file with python engine!")
        print(f"DataFrame shape: {df.shape}")
        print("Columns:", df.columns.tolist())
        print("First few rows:")
        print(df.head())
    except Exception as e:
        print(f"Error with python engine approach: {str(e)}")

client.close()
print("Connection closed.") 