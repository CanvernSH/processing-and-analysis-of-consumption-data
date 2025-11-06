import { useState, useEffect } from 'react';
import { Plot } from '../components/Plot';

const VisualiseData = () => {
  // Store the consumption data
  const [consumptionData, setConsumptionData] = useState();
  // Create the Plot
  const [plotData, setPlotData] = useState();

  // Anomalies data
  const [anomalies, setAnomalies] = useState();
  // Text for anomalies button
  const [textAnomaliesButton, setTextAnomaliesButton] = useState('Detect')

  // Optionally Filtered by the user, consumption data - this will allow the user to filter the consumption data
  const [uConsumptionData, setUConsumptionData] = useState();

  useEffect(() => {

    const CollectConsumptionData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collect-consumption-data`, {
          method: 'GET'
        });
        const result = await response.json()

        if (response.ok) {
          // console.log(result);
          setConsumptionData(result);
          setUConsumptionData({'consumption_data': result.consumption_data, 'plot_description': 'All data'});
        } else {
          console.log(result);
          alert("Error: " + result.error);
        }
      } catch (err) {
        console.log(err);
        alert("Error: " + err);
      }
    }

    CollectConsumptionData();
    
  },[])

  useEffect(() => {
    if (uConsumptionData) {
      // console.log(uConsumption_data)
      setPlotData(<Plot consumption_data={uConsumptionData.consumption_data} max_consumption_value={consumptionData.max_consumption_value} earliest_consumption_date={consumptionData.earliest_consumption_date} mean_consumption_value={consumptionData.mean_consumption_value} std_consumption_value={consumptionData.std_consumption_value} plot_description={uConsumptionData.plot_description}></Plot>)
    }

  }, [uConsumptionData])

  const handleDetectAnomalies = () => {
    // We can only show the anomalies once the consumption data has loaded
    if (consumptionData) {
      // Perform on screen button showing or not showing
      document.getElementById('consumption_data_anomalies').hidden=!document.getElementById("consumption_data_anomalies").hidden;
      // Use updated value
      if (document.getElementById('consumption_data_anomalies').hidden==true) {
        document.getElementById('anomalies_ids').hidden=true;
        setTextAnomaliesButton("Detect");
      } else {
        document.getElementById('anomalies_ids').hidden=false;
        setTextAnomaliesButton("Hide");
      }
    
      // Filter the consumption data to find the data over or under three standard deviations from the mean
      setAnomalies(JSON.stringify(consumptionData.consumption_data.filter((d) => d.consumption[0].consumption_value > consumptionData.mean_consumption_value + 3 * consumptionData.std_consumption_value || d.consumption[0].consumption_value < consumptionData.mean_consumption_value - 3 * consumptionData.std_consumption_value)));
    } else {
      alert("Please wait for the consumption data to load")
    }
  }

  const handleDetectAnomaliesIDs = () => {
    setAnomalies('[' + JSON.parse(anomalies).map((d) => d.id) + ']');
    document.getElementById('anomalies_ids').hidden=true;
  }

  const handleSearch = () => {
    let input = document.getElementById("search_text").value;
    // meter_point_id search
    try {
      // check if input is number less than 13 digits
      if (isNaN(input) === false && input.length <= 13) {
        // assume a potential meter_point_id
        input = parseInt(input)
        // filter consumption data by meter_point_id
        let filtered_data = consumptionData.consumption_data.filter((d) => d.meter_point_id === input);
        if (filtered_data.length !== 0) {
          setUConsumptionData({'consumption_data' : filtered_data, 'plot_description': 'meter_point_id = ' + input});
          console.log("Successful filter by meter_point_id")
        } else {
          console.log("No data found")
        }
        document.getElementById('consumption_data_search').value=JSON.stringify(filtered_data);
        return;
      } 
    } catch (err) {
      console.log(err);
      alert("Error searching for data, Please ensure input is either a 10 character string, integer or 'yyyy-mm-dd' date")
    }
    // house_hold_id search
    try {
      // check if input has no dash
      if (input.length===10 && input[4] != '-') {
        // assume a potential household_id

        // filter consumption data by household_id
        let filtered_data = consumptionData.consumption_data.filter((d) => d.household_id === input);
        if (filtered_data.length !== 0) {
          setUConsumptionData({'consumption_data' : filtered_data, 'plot_description': 'household_id = ' + input});
          console.log("Successful filter by household_id")
        } else {
          console.log("No data found")
        }
        document.getElementById('consumption_data_search').value=JSON.stringify(filtered_data);
        return;
      } 
    
    } catch (err) {
      console.log(err);
      alert("Error searching for data, Please ensure input is either a 10 character string, integer or 'yyyy-mm-dd' date")
    }

    // date search
    try {
      // check if input has two dashes
      if (input.length===10 && input[4] == '-' && input[7] == '-') {
        // assume a potential date

        // filter consumption data by consumption_date
        let filtered_data = consumptionData.consumption_data.filter((d) => d.consumption[0].consumption_date === input);
        if (filtered_data.length !== 0) {
          setUConsumptionData({'consumption_data' : filtered_data, 'plot_description': 'consumption_date = ' + input });
          console.log("Successful filter by consumption_date")
        } else {
          console.log("No data found")
        }
        document.getElementById('consumption_data_search').value=JSON.stringify(filtered_data);
        return;
      } 
    } catch (err) {
      console.log(err);
      alert("Error searching for data, Please ensure input is either a 10 character string, integer or 'yyyy-mm-dd' date")
    }
    alert("Error searching for data, Please ensure input is either a 10 character string, integer or 'yyyy-mm-dd' date")
  }

  const handleDeleteDataByID = async () => {
    try {
      // get id data
      let IDs_list = JSON.parse(document.getElementById('delete_ids').value);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete-data-by-ids`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({'ids': IDs_list})
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result);
        alert(result.message);
      } else {
        console.log(result);
        alert("Error deleting the IDs: " + result.error);
      }
    } catch (err) {
        console.log(err);
        alert("Error deleting the IDs: " + err);
    }



  }

  return (
    <div>
      <p> Here is the data </p>
      <br></br>

      <div>
        {uConsumptionData && plotData}
      </div>

      <div style={{marginTop: '10vh', marginBottom: '5vh', borderTop: '1px', borderBottom: '1px', width:'90vh', borderStyle: 'solid'}}>

      </div>
        <p> Detect anomalies in the consumption data </p>
        <button onClick={handleDetectAnomalies}> {textAnomaliesButton} anomalies </button>
        <button id="anomalies_ids" onClick={handleDetectAnomaliesIDs} hidden> Get anomaly IDs </button>
        <textarea id="consumption_data_anomalies" readOnly hidden value={anomalies} style={{width: '90vw', height: '10vh'}}></textarea>
      <div>

      </div>

      <div style={{marginTop: '10vh', marginBottom: '5vh', borderTop: '1px', borderBottom: '1px', width:'90vh', borderStyle: 'solid'}}></div>

      <div>
        <p> Delete consumption data </p>
        <textarea id="delete_ids" style={{width: '60vw', height: '10vh'}}></textarea>
        <br></br>

        <button onClick={handleDeleteDataByID}>Delete data by ID</button>
      </div>

      <div style={{marginTop: '10vh', marginBottom: '5vh', borderTop: '1px', borderBottom: '1px', width:'90vh', borderStyle: 'solid'}}></div>

      <div>
        <p> Search consumption data </p>
        <input id="search_text" placeholder="A1B2C3D4E5 or 1234567890123 or 2025-11-05" style={{width: '40vw'}}></input>
        <button onClick={handleSearch}> Search for data </button>
        <textarea id="consumption_data_search" readOnly value={anomalies} style={{width: '90vw', height: '10vh'}}></textarea>
      </div>

    </div>
  )
}

export default VisualiseData;