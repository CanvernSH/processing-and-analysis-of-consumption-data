import { useState, useEffect } from 'react';
import { Plot } from '../components/Plot';

const VisualiseData = () => {
  // Store the consumption data
  const [consumption_data, setConsumptionData] = useState();
  // Create the Plot
  const [plotData, setPlotData] = useState();

  useEffect(() => {

    const CollectConsumptionData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/collect-consumption-data", {
          method: 'GET'
        });
        const result = await response.json()

        if (response.ok) {
          // console.log(result);
          setConsumptionData(result);
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
    if (consumption_data) {
      setPlotData(<Plot consumption_data={consumption_data.consumption_data} max_consumption_value={consumption_data.max_consumption_value} earliest_consumption_date={consumption_data.earliest_consumption_date}></Plot>)
    }

  }, [consumption_data])


  return (
    <div>
      <p> Here is the data </p>
      <br></br>

      <div>
        {consumption_data && plotData}
      </div>

    </div>
  )
}

export default VisualiseData;