import joblib
import torch
import torch.nn as nn
import numpy as np
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load the models
lgbm_model = joblib.load('../models/lgbm_model.pkl')

xgb_model = joblib.load('../models/optimized_xgb_model_new.pkl')

gbm_model = joblib.load('../models/gbm/gbm_model.joblib')
gbm_poly_features = joblib.load('../models/gbm/poly_features.joblib')
gbm_scaler = joblib.load('../models/gbm/scaler.joblib')


class TimeSeriesTransformer(nn.Module):
    def __init__(self, input_dim, output_dim, num_heads=4, num_layers=2, hidden_dim=64, dropout=0.1):
        super(TimeSeriesTransformer, self).__init__()

        self.embedding = nn.Linear(input_dim, hidden_dim)
        self.positional_encoding = nn.Parameter(torch.rand(1, 1000, hidden_dim))  # Positional encodings

        self.transformer = nn.Transformer(
            d_model=hidden_dim,
            nhead=num_heads,
            num_encoder_layers=num_layers,
            num_decoder_layers=num_layers,
            dim_feedforward=hidden_dim,
            dropout=dropout
        )

        self.fc_out = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        batch_size, seq_len, input_dim = x.shape
        x = self.embedding(x) + self.positional_encoding[:, :seq_len, :]
        x = x.permute(1, 0, 2)  # Reshape for transformer: (seq_len, batch_size, features)
        transformer_out = self.transformer(x, x)
        out = self.fc_out(transformer_out[-1, :, :])  # Output from last time step
        return out

# Load the model
transformer_model = torch.load(
    '../models/transformer_model_complete.pth',
     weights_only=False
)
transformer_model.eval()


gru_model = load_model('../models/gru_wind_speed_best_model.keras')



@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    model_type = data.get('model_type')
    input_data_dict = data.get('input_data')

    # Convert the input data into a list of numeric values
    input_data = np.array([list(input_data_dict.values())], dtype=float) 
    
    
    if model_type == 'lgbm':
        new_data_df = pd.DataFrame(input_data)
        scaler=StandardScaler()
        new_data_scaled = scaler.fit_transform(new_data_df)
        prediction = lgbm_model.predict(new_data_scaled)
        
    elif model_type == 'xgboost':
        input_df = pd.DataFrame([input_data_dict])
        input_df = input_df.apply(pd.to_numeric, errors='coerce')
        prediction = xgb_model.predict(input_df)
        if isinstance(prediction, np.ndarray):
            prediction = float(prediction[0])
        return jsonify({'prediction': prediction})
        
    elif model_type == 'gbm':
        input_data_poly = gbm_poly_features.transform(input_data)
        input_data_scaled = gbm_scaler.transform(input_data_poly)
        prediction = gbm_model.predict(input_data_scaled)

    elif model_type == 'transformer':
        scaler = StandardScaler()
        input_data_scaled = scaler.fit_transform(input_data)
        input_data_tensor = torch.tensor(input_data_scaled, dtype=torch.float32)
        input_data_tensor = input_data_tensor.unsqueeze(1) 
        transformer_model.eval()
        with torch.no_grad():
            prediction = transformer_model(input_data_tensor)
        prediction_value = prediction.item()
        return jsonify({'prediction': prediction_value})
        

    elif model_type == 'gru':
        scaler = MinMaxScaler()
        input_data_scaled = scaler.fit_transform(input_data)
        input_data_scaled = input_data_scaled.reshape((input_data_scaled.shape[0], 1, input_data_scaled.shape[1]))
        predicted_wind_speed = gru_model.predict(input_data_scaled)
        prediction = predicted_wind_speed.flatten()[0]
        prediction = float(prediction)
        return jsonify({'prediction': prediction})

        
    
    return jsonify({'prediction': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
   