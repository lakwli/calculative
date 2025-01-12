from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from fin.run_yahoo import StockCal

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return 'Hello, Flask! 123'

@app.route('/test1', methods=['GET'])
def test1():
    print("Received data:test1")
    return 'test1'

@app.route('/getCal', methods=['POST', 'OPTIONS'])
def get_cal():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    else:
        data = request.json
        print("Received data:", data)

        # Extracting JSON data into separate variables
        age = data.get('age')
        initial_capital = data.get('initialCapital')
        yearly_withdraw = data.get('yearlyWithdraw')
        inflation = data.get('inflation')
        return_type = data.get('returnType') #S (Simple), M (Market index), I (Investment)
        back_test_year = int(data.get('backTestYear'))
        index = data.get('index')  
        portfolio=None
        if return_type == "M":
            return_type = "I"
            portfolio={index: 1.0}
        elif return_type == "I":
            portfolio = data.get('portfolio')
        fix_return = data.get('fixReturn')
        div_withhold_tax = data.get('divWithholdTax')
        print(f"Age: {age}, Initial Capital: {initial_capital}, Yearly Withdraw: {yearly_withdraw}, Portfolio: {portfolio}, Inflation: {inflation}, Back Test Year: {back_test_year},return type:{return_type} Index: {index}, fix Return: {fix_return}, Div Tax: {div_withhold_tax}")
        
        stockCal = StockCal()
        df = stockCal.get_yearly_investment_return(
            portfolio,  
            initial_investment=float(initial_capital),
            initial_withdrawal=float(yearly_withdraw),
            withdrawal_inflation_rate=float(inflation)/100,
            dividend_tax_rate=float(div_withhold_tax)/100,
            start_year=back_test_year,
            starting_age=int(age),
            return_type=return_type,
            expected_return=float(fix_return)/100,
            initial_dividend_yield=0, 
            dividend_growth=0
        )

        # To JSON:
        #json_data = df.to_dict(orient='records')
        print(df)
        
        #return jsonify(df)
        print('change.....ccc................')
        return df

def _build_cors_preflight_response():
    response = jsonify(success=True)
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == '__main__':
    #app.run(debug=True)
    #app.run(port=5000) //doesn't work in codespace with docker
    app.run(debug=True, host='0.0.0.0',port=5000) 
    #app.run()