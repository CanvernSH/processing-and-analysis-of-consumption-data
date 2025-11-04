from flask import Flask, request
from flask_cors import CORS
from data_consumption import ValidateData

app = Flask(__name__)
CORS(app)


# -------------------- Routes ------------------W

# Upload the consumption data
@app.route("/upload-consumption-data", methods=['POST'])
def upload_consumption_data():
    if request.method == 'POST':
        # Collect the input data
        try:
            consumption_data = request.json['consumption_data']
        except:
            return {'error': 'Failed to collect the requested consumption data'}

        uploaded_data = []
        bad_data = []

        # Go through each individual consumption data
        for data in consumption_data:
            # Create an object of the ValidateData class
            data_object = ValidateData(data)

            # Ensure the data is valid
            if data_object.validate_all_checks():
                # 1. Check if the household id is already stored in the database

                # 2. Check if the meter_point_id is already stored in the database

                # 3. Upload the consumption data.

                # Append the data that has been uploaded
                uploaded_data.append(data)
            else:
                bad_data.append(data)

        if len(bad_data) == 0:
            print("All data uploaded")
            return {'message': 'success', 'uploaded_data': uploaded_data, 'incorrect_data': []}
        elif len(bad_data) == len(consumption_data):
            print("All data is in the incorrect format")
            return {'error': 'All data is in the incorrect format', 'uploaded_data': [], 'incorrect_data': bad_data}, 400
        else:
            print("Some data is in the incorrect format")
            return {'error': 'Some data is in the incorrect format', 'uploaded_data': uploaded_data, 'incorrect_data': bad_data}, 400

    print("Error: Incorrect Method")
    return {'error': 'Incorrect Method'}

# Start the server
if __name__ == '__main__':
    app.run()