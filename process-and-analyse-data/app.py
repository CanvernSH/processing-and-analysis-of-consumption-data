import os
from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from werkzeug.security import check_password_hash
from datetime import datetime
import statistics
from data_consumption import ValidateData, create_data

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECURE_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -------------------- Routes ------------------W

# Route: Upload the consumption data
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
                query = text("SELECT ID FROM house WHERE ID = :household_id")
                result = db.session.execute(query, {'household_id': data['household_id']}).fetchone()
                # print(result)
                if not result:
                    query2 = text("INSERT INTO house (ID) VALUES (:household_id)")
                    db.session.execute(query2, {'household_id': data['household_id']})
                    # db.session.commit()
                    # print("uploaded household_id")
                # else:
                    # print("household_id is already there" + str(result))
                
                # 2. Check if the meter_point_id is already stored in the database
                query = text("SELECT ID FROM meter_point WHERE ID = :meter_point_id")
                result = db.session.execute(query, {'meter_point_id': data['meter_point_id']}).fetchone()
                if not result:
                    query2 = text("INSERT INTO meter_point (ID, household_id) VALUES (:meter_point_id, :household_id)")
                    db.session.execute(query2, {'meter_point_id': data['meter_point_id'], 'household_id': data['household_id']})
                    # db.session.commit()
                    # print("uploaded meter_point_id")
                # else:
                    # print("meter_point_id is already there" + str(result))


                # 3. Upload the consumption data
                query = text("INSERT INTO consumption (household_id, meter_point_id, consumption_type, consumption_value, consumption_date) VALUES (:household_id, :meter_point_id, :consumption_type, :consumption_value, :consumption_date)")
                db.session.execute(query, { 'household_id': data['household_id'], 'meter_point_id': data['meter_point_id'], 'consumption_type': data['consumption'][0]['consumption_type'], 'consumption_value': data['consumption'][0]['consumption_value'], 'consumption_date': data['consumption'][0]['consumption_date'] })
                # db.session.commit()
                # print("consumption_data has been uploaded")

                # Append the data that has been uploaded
                uploaded_data.append(data)
            else:
                bad_data.append(data)
                
        db.session.commit()

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
    return {'error': 'Incorrect Method'}, 405

# --------------------------------------
# Route: Delete all data from all tables
@app.route('/delete-data-from-all-sql-tables', methods=['POST', 'GET'])
def delete_all_data():
    if request.method == 'POST':
        try: 
            input = request.json
            password = input['reset_password']
        except:
            print("Error: No password received")
            return {'error': 'No password received'}, 400
        
        # If the input matches the reset password, then delete all data from the tables
        if check_password_hash(os.getenv('RESET_PASSWORD'), password):
            # Delete all data from the consumption table
            db.session.execute(text("DELETE FROM consumption"))
            db.session.commit()
            # Delete all data from the meter_point table
            db.session.execute(text("DELETE FROM meter_point"))
            db.session.commit()
            # Delete all data from the house table
            db.session.execute(text("DELETE FROM house"))
            db.session.commit()
            
            print("Successfully deleted all table data")
            return {'message': 'All table data has been deleted'}
        else:
            print("The Reset Password is in Incorrect")
            return {'error': 'Reset Password is Incorrect'}, 400

    
    print("Error: Incorrect Method")
    return {'error': 'Incorrect Method'}, 405

# -------------------------------------
# Route: Collect data from the consumption table
@app.route("/collect-consumption-data", methods=['GET'])
def collect_consumption_data():
    if request.method == 'GET':

        try:
            # Collect all data from the SQL consumption table
            consumption_data = db.session.execute(text("SELECT ID, household_id, meter_point_id, consumption_type, consumption_value, consumption_date FROM consumption"))

            if consumption_data.rowcount == 0:
                return {'consumption_data': []}
            
            data_lst = []
            data_values = []
            
            earliest_consumption_date = datetime.now().date()
            max_consumption_value = 0
            for row in consumption_data:
                # Note here that we also append the id of the consumption data
                data_row = {'id': int(row[0]), 'household_id': str(row[1]), 'meter_point_id': int(row[2]), 'consumption': [{'consumption_type': str(row[3]), 'consumption_value': float(row[4]), 'consumption_date': str(row[5])}] }
                data_lst.append(data_row)

                # Get the earliest consumption date
                earliest_consumption_date = min(earliest_consumption_date, row[5])
                
                # Get the maximum consumption value
                max_consumption_value = max(max_consumption_value, row[4])

                # Update the data values sample data
                data_values.append(row[4])

            # Determine the mean of the data values
            mean_consumption_value = statistics.mean(data_values)

            # Determine the mean and standard deviation from the data values - deal with case n=1 separately
            if len(data_values) <= 1:
                std_consumption_value = 0
            else:
                std_consumption_value = statistics.stdev(data_values)

            return { 'consumption_data': data_lst, 'max_consumption_value': float(max_consumption_value), 'earliest_consumption_date': str(earliest_consumption_date), 'mean_consumption_value': float(mean_consumption_value), 'std_consumption_value': float(std_consumption_value) }
        
        except:
            print("Error: Failed to collect the consumption data from the database")
            return {'error' : 'Failed to collect and return the consumption data from the database'}, 500

    print("Error: Incorrect Method")
    return {'error': 'Incorrect Method'}, 405

# ---------------------------------
# Route: Generate Consumption Data
@app.route("/generate-consumption-data/<N>", methods=['GET'])
def generate_consumption_data(N):
    if request.method == 'GET':
        # Check if user input is a valid integer
        try:
            if int(N) < 0:
                print("Error: Integer should be greater than zero")
                return {'error': 'Integer should be greater than or equal to zero'}, 400
        except:
            print("Error: Input should be an integer")
            return {'error': 'Input should be an integer'}, 400
        
        # Return the N Lots of consumption data
        generated_consumption_data = create_data(int(N))
        print("Consumption Data has been generated")
        return {'generated_consumption_data': generated_consumption_data}


    print("Error: Incorrect Method")
    return {'error': 'Incorrect Method'}, 405

# ------------------------------
# Delete consumption data by IDs
@app.route('/delete-data-by-ids', methods=['POST'])
def delete_data_by_ids():
    if request.method == 'POST':
        try:
            ids = request.json['ids']
            # Ensure all ids are integers -
            for id in ids:
                temp = int(id)
        except:
            print("Error Failed to extract JSON for the consumption data ids to delete")
            return {'error' : 'Failed to extract JSON for the consumption data ids to delete'}, 500
        
        try:
            for id in ids:
                query = text("DELETE FROM consumption WHERE ID = (:id)")
                db.session.execute(query, {'id': id})
            db.session.commit()

            print("All consumption data with the requested ids have been deleted")
            return { 'message' : 'All consumption data with the requested ids have been deleted'}
        except:
            print("Failed to delete all of the IDs")
            return { 'message' : 'Failed to delete all of the IDs' }, 500

    print("Error: Incorrect Method")
    return {'error': 'Incorrect Method'}, 405

# ------------------------------


# Start the server
if __name__ == '__main__':
    app.run()