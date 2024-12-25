import React, { useState } from 'react';
import axios from 'axios';

function PredictionForm2() {
  // State to manage form inputs and prediction results
  const [modelType, setModelType] = useState('');
  const [inputData, setInputData] = useState({
    LATITUDE: '',
    LONGITUDE: '',
    ELEVATION: '',
    TEMP: '',
    DEWP: '',
    SLP: '',
    STP: '',
    VISIB: '',
    MXSPD: '',
    GUST: '',
    MAX: '',
    MIN: '',
    PRCP: '',
    Month: '',
    Day: '',
    Humidity: '',
    TEMP_HUMIDITY: '',
    MXSPD_LAG1: '',
    MXSPD_LAG2: '',
    MXSPD_ROLL3: '',
    STATION: '',
    TEMP_ATTRIBUTES: '',
    DEWP_ATTRIBUTES: '',
    SLP_ATTRIBUTES: '',
    STP_ATTRIBUTES: '',
    VISIB_ATTRIBUTES: '',
    WDSP_ATTRIBUTES: '',
    FRSHTT: '',
    Temp_Range: '',
    Wind_Range: '',
    Humidity_Index: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  // Handle model selection change
  const handleModelChange = (e) => {
    setModelType(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create an object to store the selected model's relevant input data
    let filteredInputData = {};

    if (modelType === 'lgbm') {
      filteredInputData = {
        TEMP: inputData.TEMP,
        DEWP: inputData.DEWP,
        PRCP: inputData.PRCP,
        Humidity: inputData.Humidity,
        Month: inputData.Month,
        Day: inputData.Day,
        TEMP_HUMIDITY: inputData.TEMP_HUMIDITY,
        MXSPD_LAG1: inputData.MXSPD_LAG1,
        MXSPD_LAG2: inputData.MXSPD_LAG2,
        MXSPD_ROLL3: inputData.MXSPD_ROLL3
      };
    } else if (modelType === 'xgboost') {
      filteredInputData = {
        MXSPD: inputData.MXSPD,
        Wind_Range: inputData.Wind_Range,
        TEMP: inputData.TEMP,
        GUST: inputData.GUST,
        PRCP: inputData.PRCP,
        VISIB: inputData.VISIB,
        Humidity: inputData.Humidity
      };
    } else if (modelType === 'gbm') {
      filteredInputData = {
        TEMP: inputData.TEMP,
        DEWP: inputData.DEWP,
        MAX: inputData.MAX,
        MIN: inputData.MIN,
        PRCP: inputData.PRCP,
        MXSPD: inputData.MXSPD,
        GUST: inputData.GUST
      };
    } else if (modelType === 'transformer') {
      filteredInputData = {
        STATION: inputData.STATION,
        LATITUDE: inputData.LATITUDE,
        LONGITUDE: inputData.LONGITUDE,
        ELEVATION: inputData.ELEVATION,
        TEMP: inputData.TEMP,
        TEMP_ATTRIBUTES: inputData.TEMP_ATTRIBUTES,
        DEWP: inputData.DEWP,
        DEWP_ATTRIBUTES: inputData.DEWP_ATTRIBUTES,
        SLP: inputData.SLP,
        SLP_ATTRIBUTES: inputData.SLP_ATTRIBUTES,
        STP: inputData.STP,
        STP_ATTRIBUTES: inputData.STP_ATTRIBUTES,
        VISIB: inputData.VISIB,
        VISIB_ATTRIBUTES: inputData.VISIB_ATTRIBUTES,
        WDSP_ATTRIBUTES: inputData.WDSP_ATTRIBUTES,
        MXSPD: inputData.MXSPD,
        GUST: inputData.GUST,
        MAX: inputData.MAX,
        MIN: inputData.MIN,
        PRCP: inputData.PRCP,
        FRSHTT: inputData.FRSHTT,
        Humidity: inputData.Humidity,
        Temp_Range: inputData.Temp_Range,
        Wind_Range: inputData.Wind_Range,
        Humidity_Index: inputData.Humidity_Index
      };
    } else if (modelType === 'gru') {
      filteredInputData = {
        LATITUDE: inputData.LATITUDE,
        LONGITUDE: inputData.LONGITUDE,
        ELEVATION: inputData.ELEVATION,
        TEMP: inputData.TEMP,
        DEWP: inputData.DEWP,
        SLP: inputData.SLP,
        STP: inputData.STP,
        VISIB: inputData.VISIB,
        WDSP: inputData.WDSP,
        MXSPD: inputData.MXSPD,
        GUST: inputData.GUST,
        MAX: inputData.MAX,
        MIN: inputData.MIN,
        PRCP: inputData.PRCP,
        Month: inputData.Month,
        Day: inputData.Day,
        Humidity: inputData.Humidity
      };
    }

    try {
      const response = await axios.post('http://localhost:5000/predict', {
        model_type: modelType,
        input_data: filteredInputData
      });
      setPrediction(response.data.prediction);
    } catch (err) {
      setError('Error fetching prediction');
      console.log(err);
    }
  };

  // Render model-specific input fields based on selected model
  const renderModelInputs = () => {
    if (modelType === '') return null; // No input fields if no model is selected
    // Dynamically render fields for each model type
    const fields = Object.keys(inputData);
    return fields.map((field) => (
      <div key={field}>
        <label>
          {field}:
          <input
            type="text"
            name={field}
            value={inputData[field]}
            onChange={handleChange}
          />
        </label>
      </div>
    ));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Select Model:
          <select value={modelType} onChange={handleModelChange}>
            <option value="">Select Model</option>
            <option value="lgbm">LightGBM</option>
            <option value="xgboost">XGBoost</option>
            <option value="gbm">GBM</option>
            <option value="transformer">Transformer</option>
            <option value="gru">GRU</option>
          </select>
        </label>
      </div>
      
      {renderModelInputs()}  {/* Render the inputs for selected model */}
      
      <button type="submit">Submit</button>
      
      {prediction && <div>Prediction: {prediction}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}

export default PredictionForm2;
