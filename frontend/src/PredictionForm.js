import React, { useState } from 'react';
import axios from 'axios';

function PredictionForm() {
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
    if (modelType === 'lgbm') {
      return (
        <>
          <div>
            <label>
              TEMP:
              <input type="text" name="TEMP" value={inputData.TEMP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              DEWP:
              <input type="text" name="DEWP" value={inputData.DEWP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              PRCP:
              <input type="text" name="PRCP" value={inputData.PRCP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Humidity:
              <input type="text" name="Humidity" value={inputData.Humidity} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Month:
              <input type="text" name="Month" value={inputData.Month} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Day:
              <input type="text" name="Day" value={inputData.Day} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              TEMP_HUMIDITY:
              <input type="text" name="TEMP_HUMIDITY" value={inputData.TEMP_HUMIDITY} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MXSPD_LAG1:
              <input type="text" name="MXSPD_LAG1" value={inputData.MXSPD_LAG1} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MXSPD_LAG2:
              <input type="text" name="MXSPD_LAG2" value={inputData.MXSPD_LAG2} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MXSPD_ROLL3:
              <input type="text" name="MXSPD_ROLL3" value={inputData.MXSPD_ROLL3} onChange={handleChange} />
            </label>
          </div>
        </>
      );
    }

    if (modelType === 'xgboost') {
      return (
        <>
          <div>
            <label>
              MXSPD:
              <input type="text" name="MXSPD" value={inputData.MXSPD} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Wind_Range:
              <input type="text" name="Wind_Range" value={inputData.Wind_Range} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              TEMP:
              <input type="text" name="TEMP" value={inputData.TEMP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              GUST:
              <input type="text" name="GUST" value={inputData.GUST} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              PRCP:
              <input type="text" name="PRCP" value={inputData.PRCP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              VISIB:
              <input type="text" name="VISIB" value={inputData.VISIB} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Humidity:
              <input type="text" name="Humidity" value={inputData.Humidity} onChange={handleChange} />
            </label>
          </div>
        </>
      );
    }

    if (modelType === 'gbm') {
      return (
        <>
          <div>
            <label>
              TEMP:
              <input type="text" name="TEMP" value={inputData.TEMP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              DEWP:
              <input type="text" name="DEWP" value={inputData.DEWP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MAX:
              <input type="text" name="MAX" value={inputData.MAX} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MIN:
              <input type="text" name="MIN" value={inputData.MIN} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              PRCP:
              <input type="text" name="PRCP" value={inputData.PRCP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MXSPD:
              <input type="text" name="MXSPD" value={inputData.MXSPD} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              GUST:
              <input type="text" name="GUST" value={inputData.GUST} onChange={handleChange} />
            </label>
          </div>
        </>
      );
    }

    if (modelType === 'transformer') {
      return (
        <>
          <div>
            <label>
              STATION:
              <input type="text" name="STATION" value={inputData.STATION} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              LATITUDE:
              <input type="text" name="LATITUDE" value={inputData.LATITUDE} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              LONGITUDE:
              <input type="text" name="LONGITUDE" value={inputData.LONGITUDE} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              ELEVATION:
              <input type="text" name="ELEVATION" value={inputData.ELEVATION} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              TEMP:
              <input type="text" name="TEMP" value={inputData.TEMP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              TEMP_ATTRIBUTES:
              <input type="text" name="TEMP_ATTRIBUTES" value={inputData.TEMP_ATTRIBUTES} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              DEWP:
              <input type="text" name="DEWP" value={inputData.DEWP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              DEWP_ATTRIBUTES:
              <input type="text" name="DEWP_ATTRIBUTES" value={inputData.DEWP_ATTRIBUTES} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              SLP:
              <input type="text" name="SLP" value={inputData.SLP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              SLP_ATTRIBUTES:
              <input type="text" name="SLP_ATTRIBUTES" value={inputData.SLP_ATTRIBUTES} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              STP:
              <input type="text" name="STP" value={inputData.STP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              STP_ATTRIBUTES:
              <input type="text" name="STP_ATTRIBUTES" value={inputData.STP_ATTRIBUTES} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              VISIB:
              <input type="text" name="VISIB" value={inputData.VISIB} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              VISIB_ATTRIBUTES:
              <input type="text" name="VISIB_ATTRIBUTES" value={inputData.VISIB_ATTRIBUTES} onChange={handleChange} />
            </label>
          </div>
          {/* <div>
            <label>
              WDSP:
              <input type="text" name="WDSP" value={inputData.WDSP} onChange={handleChange} />
            </label>
          </div> */}
          <div>
            <label>
              WDSP_ATTRIBUTES:
              <input type="text" name="WDSP_ATTRIBUTES" value={inputData.WDSP_ATTRIBUTES} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MXSPD:
              <input type="text" name="MXSPD" value={inputData.MXSPD} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              GUST:
              <input type="text" name="GUST" value={inputData.GUST} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MAX:
              <input type="text" name="MAX" value={inputData.MAX} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MIN:
              <input type="text" name="MIN" value={inputData.MIN} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              PRCP:
              <input type="text" name="PRCP" value={inputData.PRCP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              FRSHTT:
              <input type="text" name="FRSHTT" value={inputData.FRSHTT} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Humidity:
              <input type="text" name="Humidity" value={inputData.Humidity} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Temp_Range:
              <input type="text" name="Temp_Range" value={inputData.Temp_Range} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Wind_Range:
              <input type="text" name="Wind_Range" value={inputData.Wind_Range} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Humidity_Index:
              <input type="text" name="Humidity_Index" value={inputData.Humidity_Index} onChange={handleChange} />
            </label>
          </div>
        </>
      );
    }

    if (modelType === 'gru') {
      return (
        <>
          <div>
            <label>
              LATITUDE:
              <input type="text" name="LATITUDE" value={inputData.LATITUDE} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              LONGITUDE:
              <input type="text" name="LONGITUDE" value={inputData.LONGITUDE} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              ELEVATION:
              <input type="text" name="ELEVATION" value={inputData.ELEVATION} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              TEMP:
              <input type="text" name="TEMP" value={inputData.TEMP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              DEWP:
              <input type="text" name="DEWP" value={inputData.DEWP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              SLP:
              <input type="text" name="SLP" value={inputData.SLP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              STP:
              <input type="text" name="STP" value={inputData.STP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              VISIB:
              <input type="text" name="VISIB" value={inputData.VISIB} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              WDSP:
              <input type="text" name="WDSP" value={inputData.WDSP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MXSPD:
              <input type="text" name="MXSPD" value={inputData.MXSPD} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              GUST:
              <input type="text" name="GUST" value={inputData.GUST} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MAX:
              <input type="text" name="MAX" value={inputData.MAX} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              MIN:
              <input type="text" name="MIN" value={inputData.MIN} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              PRCP:
              <input type="text" name="PRCP" value={inputData.PRCP} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Month:
              <input type="text" name="Month" value={inputData.Month} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Day:
              <input type="text" name="Day" value={inputData.Day} onChange={handleChange} />
            </label>
          </div>
          <div>
            <label>
              Humidity:
              <input type="text" name="Humidity" value={inputData.Humidity} onChange={handleChange} />
            </label>
          </div>
          
          
        </>
      );
    }

    return null;
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
};

export default PredictionForm;
