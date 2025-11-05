import { useState } from 'react';

const UploadData = () => {
    // Store the user input
    const [consumptionData, setConsumptionData] = useState();
    const [uploadedData, setUploadedData] = useState();
    const [notUploadedData, setNotUploadedData] = useState();

    // Enhance readability with text
    const [textNotUploaded, setTextNotUploaded] = useState("has not been");

    // Generated Data
    const [generatedConsumptionData, setGeneratedConsumptionData] = useState();

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
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload-consumption-data`, {
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

    const handleResetTableData = async () => {
        try {
            // Call backend to clear table data if the reset text is correct
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/delete-data-from-all-sql-tables`, {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ 'reset_password': document.getElementById('reset_text').value })
            });
            const result = await response.json();

            if (response.ok) {
                console.log(result);
                alert("All data has been deleted");
            } else {
                console.log(result)
                alert("Error: " + result.error);
            }
            // Reset the input box
            document.getElementById('reset_text').value=""
        } catch (err) {
            console.log(err);
            alert("Error: " + err);
        }
    }

    const handleGenerateConsumptionData = async () => {
            let number = document.getElementById('int_N').value

            try {
                if (number < 0) {
                    alert("Number must be greater than 0");
                    return
                }

                // Call backend: Generate Consumption Data
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-consumption-data/${number}`, {
                    method: 'GET'
                });
                const result = await response.json();

                if (response.ok) {
                    console.log(result)
                    console.log("Data has been generated");
                    alert("Data has been generated");
                    setGeneratedConsumptionData(result.generated_consumption_data);
                } else {
                    console.log(result);
                    alert("Error: " + result.error);
                }

            } catch (err) {
                console.log(err);
                alert("Error: " + err)
            }
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

            <div style={{marginTop: '10vh', borderTop: '1px solid #9E9E9E', borderBottom: '1px solid #9E9E9E'}}></div>
            <br></br>

            <p style={{color: 'grey'}}> Generate N Lots of Consumption Data </p>
            <input id="int_N" type="number" placeholder="Enter Integer"></input>
            <button onClick={handleGenerateConsumptionData}> Generate Consumption Data </button>

            {generatedConsumptionData && 
            <div>
                <textarea readOnly value={JSON.stringify(generatedConsumptionData)} style={{width: '90vw', height: '10vh'}}></textarea>
            </div>}
                
            <div style={{marginTop: '10vh', borderTop: '1px solid #9E9E9E', borderBottom: '1px solid #9E9E9E'}}></div>
            <br></br>

            <p style={{color: 'grey'}}> Optional: Enter password to clear all table data</p>
            <input id="reset_text"></input>
            <button onClick={handleResetTableData}>Reset table data</button>

        </div>
    )
}

export default UploadData;