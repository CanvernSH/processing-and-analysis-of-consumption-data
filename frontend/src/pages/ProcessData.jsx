import { useState } from 'react';

const UploadData = () => {
    // Store the user input
    const [consumptionData, setConsumptionData] = useState();
    const [uploadedData, setUploadedData] = useState();
    const [notUploadedData, setNotUploadedData] = useState();

    // Enhance readability with text
    const [textNotUploaded, setTextNotUploaded] = useState("has not been");

    // Create an example of the user input - to use as a placeholder
    const example_user_input = "[{\"household_id\": \"Abcdefghij\", \"meter_point_id\": 12345678910123, \"consumption\": [{\"consumption_type\":\"Import\", \"consumption_value\": 18.2421, \"consumption_date\": \"2025-11-01\"}]}, {\"household_id\": \"Bcdefghijk\", \"meter_point_id\": 1122334455667, \"consumption\": [{\"consumption_type\":\"Export\", \"consumption_value\": 11.9232, \"consumption_date\": \"2025-11-02\"}]}]"
    // [{"household_id": "Abcdefghij", "meter_point_id": 12345678910123, "consumption": [{"consumption_type":"Import", "consumption_value": 18.2421, "consumption_date": "2025-11-01"}]}, {"household_id": "Bcdefghijk", "meter_point_id": 1122334455667, "consumption": [{"consumption_type":"Export", "consumption_value": 11.9232, "consumption_date": "2025-11-02"}]}]
    // [{"household_id": "Abcdefghij", "meter_point_id": 12345678910123, "consumption": [{"consumption_type":"Import", "consumption_value": 18.2421, "consumption_date": "2025-11-01"}]}, {"household_id": "Bcdefghijk", "meter_point_id": 1122334455667, "consumption": [{"consumption_type":"Export", "consumption_value": 11.9232, "consumption_date": "2025-11-02"}]}, {"household_id": "cdefghijk", "meter_point_id": 1122334455667, "consumption": [{"consumption_type":"Export", "consumption_value": 11.9232, "consumption_date": "2025-11-02"}]}]
    const handleUploadData = async () => {
        try {
            const consumption_data = JSON.parse(consumptionData);
        } catch {
            // Reset updated data
            setUploadedData("");
            alert("Invalid Format - Please Try again");
            return;
        }

        const consumption_data = JSON.parse(consumptionData);
        
        const response = await fetch("http://127.0.0.1:5000/upload-consumption-data", {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({'consumption_data': consumption_data})
        });

        const result = await response.json();

        // Reset the consumption data
        setConsumptionData("");
        // Clear the input box
        document.getElementById("input_consumption_data").value="";
        document.getElementById("input_consumption_data").placeholder="";

        if (response.ok) {
            console.log(result);
            setUploadedData(result.uploaded_data)
            setNotUploadedData("");
            alert("Consumption Data has been uploaded");
        } else {
            console.log(result);
            alert("Error: " + result.error);

            // Disable input text area and the ability to upload Consumption data
            document.getElementById('input_consumption_data').disabled=true;
            document.getElementById('upload_button').disabled=true;

            // Show reset button
            document.getElementById('reset_button').hidden=false;
            // Update the data that has or has not been uploaded
            setUploadedData(result.uploaded_data);
            setNotUploadedData(result.incorrect_data);
            // Reupdate the text from was not to has not been
            setTextNotUploaded("has not been");
        }
    }
    const handleReset = () => {
        // Reset uploaded data
        setUploadedData("");

        // Update textNotUpdated from "has not been" to "was not"
        setTextNotUploaded("was not");

        // Reset the input text area and upload button
        document.getElementById('input_consumption_data').disabled=false;
        document.getElementById('upload_button').disabled=false;

        // Hide the reset button
        document.getElementById('reset_button').hidden=true;

    }

    return (
        <div>

            <textarea id="input_consumption_data" placeholder={"Example: " + example_user_input} style={{width: '90vw', height: '10vh'}} onChange={(e) => {setConsumptionData(e.target.value)}}></textarea>
            <br></br>

            <div style={{display: 'flex'}}>
                <button id="upload_button" onClick={handleUploadData}>Upload Consumption Data</button>
                <button id="reset_button" hidden onClick={handleReset}>Reset</button>
                <br></br>
            </div>

            {uploadedData && 
            <div>
                <p>The following data has been uploaded</p>
                <textarea readOnly value={JSON.stringify(uploadedData)} style={{width: '90vw', height: '10vh'}}></textarea>
                <br></br> 
            </div>}


            {notUploadedData && 
            <div>
                <p>The following data {textNotUploaded} uploaded</p>
                <textarea readOnly value={JSON.stringify(notUploadedData)} style={{width: '90vw', height: '10vh'}}></textarea>
                <br></br>
            </div>}

        </div>
    )
}

export default UploadData;