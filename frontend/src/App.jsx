import { useState } from 'react';
import { Plot } from './Plot';

const visualiseData = () => {
  const textMessage = "Consumption Data";
  const [apiMessage, setApiMessage] = useState("press Button")

  // Call the backend
  const handleButton = async () => {
    const response = await fetch('http://127.0.0.1:5000', {
      method: 'GET'
    });
    const result = await response.json();

    if (!response.ok) {
      setApiMessage("Error");
    } else {
      setApiMessage(result.message)
    }
  }

  return (
    <div>
      <p> Here is the data </p>
      <button onClick={handleButton}> Press to call backend </button>
      
      <br></br>

      {apiMessage}

      <div id="consumption_data_plot"></div>
      <Plot></Plot>

    </div>
  )
}

export default visualiseData;