from flask import Flask, jsonify
import joblib
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

index = 0
df = pd.read_csv('../data/simula_sensor.csv')
model = joblib.load('../models/arvore_workada_certo.joblib')

@app.route('/api/predict', methods=['POST'])
def predict():
    global index, model
    
    row = df.iloc[index]
    array = row.values.reshape(1, -1)
    
    prediction = model.predict(array)

    print(prediction)

    index += 1

    if index == 364:
        index = 0

    prediction_list = prediction.tolist()
    row_dict = row.to_dict()
    
    print('row_data:', row_dict)

    return jsonify({'prediction': prediction_list, 'row_data': row_dict})

if __name__ == '__main__':
    app.run(debug=True)