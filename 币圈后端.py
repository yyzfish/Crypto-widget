from flask import Flask, jsonify
from flask_caching import Cache
import requests
from datetime import datetime

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

def get_data_from_api_1():
    headers = {
        'accept': 'application/json',
        'coinglassSecret': '7f950b38ae72492c81a8776be8141cc5'
    }
    try:
        response = requests.get('https://open-api.coinglass.com/public/v2/index/ahr999', headers=headers)
        response.raise_for_status()
        data = response.json()
        
         # 只返回 "data" 字段下的最后一条数据
        last_data = data['data'][-1] if data['data'] else None
        return last_data
    except requests.RequestException:
        return None

def get_data_from_api_2():
    headers = {
        'accept': 'application/json',
        'Ok-Access-Key': '12c9e7fd-7cb3-40ce-a194-65a3acc4c330'
    }
    try:
        response = requests.get('https://www.oklink.com/api/v5/explorer/blockchain/fee?chainShortName=eth', headers=headers)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.RequestException:
        return None

def get_data_from_api_3():
    
    try:
        response = requests.get('https://mempool.space/api/v1/fees/recommended')
        response.raise_for_status()
        data = response.json()
        return data
    except requests.RequestException:
        return None

@cache.memoize(300)
def aggregate_data():
    data1 = get_data_from_api_1()
    data2 = get_data_from_api_2()
    data3 = get_data_from_api_3()
    
    aggregated_data = {}
    
    if data1:
        aggregated_data['data1'] = data1
    if data2:
        aggregated_data['data2'] = data2
    if data3:
        aggregated_data['data3'] = data3

    # 获取当前时间，并将其格式化为字符串
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return {
        'last_update': timestamp,
        'data': aggregated_data
    }

@app.route('/get-aggregated-data', methods=['GET'])
def get_aggregated_data_route():
    data = aggregate_data()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
