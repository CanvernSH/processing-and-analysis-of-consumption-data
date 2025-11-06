import datetime
import random2 as random
import string

# Define functions to check the consumption_type, consumption_value and consumption_date
# Check consumption_type
def check_consumption_type(consumption_type):
        # Ensure consumption type is either Import or Export
        try:
            if consumption_type in ['Import', 'Export']:
                return True
            print("Error: Consumption Type should be either 'Import' or 'Export'")
            return False
        except:
            print("Error: error occurred while validating consumption type")
            return False
        
# Check consumption_value
def check_consumption_value(consumption_value):
    # Ensure consumption value is a positive float
    try:
        if consumption_value >= 0.0:
            # Optional - produce warning if consumption value is an integer
            if type(consumption_value) == int:
                print("Warning: consumption value is an integer - expected a float")
            return True
        print("Error: Consumption value should be greater or equal to 0.0")
        return False
    except:
        print("Error: error occurred while validating the consumption value")
        return False

# Check consumption_date
def check_consumption_date(consumption_date):
    # Ensure consumption date is valid and in yyyy-mm-dd format
    try:
        datetime.date.fromisoformat(consumption_date)
        return True
    except:
        print("Error: error occurred while validating the consumption date - Consumption date should be in the yyyy-mm-dd format")
        return False

# Define the class
# Validate the Data
class ValidateData():
    def __init__(self, consumption_data):
        self.data = consumption_data

    # -------------- Validation Checks ---------------
    """
    input: data - list of data, with each row a row of consumption data
    returns: returns invalid format error message + False, OR True depending on whether the data is of the correct format
    """
    def check_household_id(self):
        # Ensure household_id is a string of length 10 characters
        try:
            if len(self.data['household_id']) == 10:
                print(len(self.data))
                # Assume household id is only to contain alphanumeric characters
                household_id = self.data['household_id']
                
                # Check if all characters are alphanumeric
                for char in household_id:
                    if char.isalnum() == False:
                        print("Error: All 10 characters in the household_id should be alphanumeric")
                        return False
                return True
            print("Error: household_id should be 10 characters")
            return False
        except:
            print("Error: error occurred while validating the household_id")
            return False

    
    def check_meter_point_id(self):
        # Ensure meter_point_id is a 13 digit positive integer
        try:
            if type(self.data['meter_point_id']) == int and 0 <= self.data['meter_point_id'] <= 10**13 - 1:
                return True
            print("Error: metering point id should be a positive integer between 0 and 10^14 - 1 (inclusive)")
            return False
        except:
            print("Error: error occurred while validating the meter_point_id")
            return False
    
    def check_consumption_property(self):
        # Check all 3 properties of each json in the array consumption 
        try:
            for json in self.data['consumption']:
                if check_consumption_type(json.consumption_type) == False or check_consumption_value(json.consumption_value) == False or check_consumption_date(json.consumption_date) == False:
                    return False
            return True
        except:
            print("Error: error occurred while validating the consumption array")
            return False

        
    def validate_all_checks(self):
        try:
            if self.check_household_id() and self.check_meter_point_id() and self.check_consumption_property:
                return True
            return False
        except:
            return False


# Create some example data following the consumption data format
def create_data(n = 1):
    """
    Inputs: 
        - n *int*: number of rows of data to create
    Outputs: 
        - data *list*: consumption data where each index represents one lot of data
            - { household_id: *string*, meter_point_id: *int*, consumption: [{ consumption_type: *'Import' OR 'Export'*, consumption_value: *float*, consumption_date: *yyyy-mm-dd* }] }
    """

    # Initalise data
    consumption_data = []

    # Repeat n times
    for i in range(n):
        # Randomly generate the data
        household_id = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(10)) # generate a 10-character alphanumeric string
        meter_point_id = random.randint(0, 10**13 - 1)
        consumption_type = random.choice(['Import', 'Export'])
        consumption_value = random.uniform(0.0, 100.0)

        # Random date over past 5 years:
        days_ago = random.randint(0, 365 * 5)
        consumption_date = str(datetime.date.today() - datetime.timedelta(days=days_ago)) # convert to a string

        # Create json of one lot of data
        consumption_data_row = {'household_id': household_id, 'meter_point_id': meter_point_id, 'consumption': [{'consumption_type': consumption_type, 'consumption_value': consumption_value, 'consumption_date': consumption_date}]}
        
        # Update consumption data
        consumption_data.append(consumption_data_row)

    return consumption_data

if __name__ == '__main__':
    print(datetime.datetime.fromisoformat("2025-11-06 10:00:00"))
    print(datetime.date.fromisoformat('2025-11-06'))
    print(datetime.datetime.fromisoformat('2025-11-06'))
    