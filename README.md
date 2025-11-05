# Processing and Analysis of Consumption Data App

This full-stack app aims to process and analyse consumption data, displaying the results to the end user.

1. Project Start - Validate Data, Test Validation and Create Data
- To start this project, I am utilising test-driven development to ensure that the consumption data is in the correct format. In the backend, in data_consumption.py, the class ValidateData allows the user to input data. The validity of the data can then be tested using the methods within this class. Some initial tests for valid and invalid data can be found in test.py, where I use pytest to assert that the data is processed correctly.

- Additionally, I have added the ability to generate random data using the create_data function in data_consumption.py.

- Finally, I have added two simple routes in app.py to connect the frontend to the backend as an initial start to the full-stack app.

2. Introduced an initial design of the plot of the consumption data 
- Progressing the application, I have added a simple example of a plot for the frontend using d3.js. The plot distinguishes Imports and Exports using separate colours, uses the x-axis for the consumption date and the y-axis for the consumption value. Additionally, on hover of a point it displays information about the point such as the household_id. 
- Next Steps: Create an SQL database to store the data; connect the frontend, backend and database; and introduce robust error handling for invalid operations.

3. Updated: Improved the plot: Now using dates rather than integers for the x-axis, and more details are shown on hover over a data point. 

    Added: PostgreSQL Database
- PostgreSQL Schema:
    - CREATE TABLE house(
        - ID CHAR(10) NOT NULL,
        - house_address VARCHAR(20),

        -PRIMARY KEY (ID)
        
        );
    
    - CREATE TABLE meter_point(
        - ID BIGINT NOT NULL,
        - meter_point_address VARCHAR(20),

        -PRIMARY KEY (ID)
        
        );
    
    - CREATE TABLE consumption(
        - ID SERIAL, 
        - household_ID CHAR(10) NOT NULL,
        - meter_point_ID BIGINT NOT NULL,
        - consumption_type ENUM ('Import', 'Export') NOT NULL,
        - consumption_value DECIMAL(30, 12) NOT NULL,
        - consumption_date DATE NOT NULL,

        -PRIMARY KEY (ID),

        -FOREIGN KEY (household_ID) REFERENCES house(ID),

        -FOREIGN KEY (meter_point_ID) REFERENCES meter_point(ID)
        
        );  

    Added: ProcessData.jsx - A page for the user to upload the consumption data. This page: allows the user to input consumption data, sends the input data to the route "/upload-consumption-data", and informs the user of: the data which has been (or will be) uploaded, and the data that could not be uploaded due to an incorrect format.

    Added: Route "/upload-consumption-data" to upload the consumption data. This route receives the input array of consumption data from the frontend. It then iterates through each JSON consumption data in the array, creating an object of the ValidateData class and uses its validate_all_checks() method to ensure that the consumption data is in a valid format. The valid JSON data and invalid JSON data are then returned to the frontend to inform the user of the data that has been (or will be) uploaded, and the data that has not been uploaded due to an invalid format.  
    - Next Steps: Finish this route to upload the data to the SQL database.

    Added: Ability to switch between the plot data page and the upload date page

    Additionally, I have separated the 'src' folder into a 'pages' and 'components' folder for improved readability and clean code.

4. The following has been Implemented:
- Implemented the uploading of the consumption data to the three tables in the online SQL database. 

- Added Route '/delete-data-from-all-sql-tables': Provides the ability to delete all data from all tables in the SQL database. This deletion of all data is secured by a hashed password.

- Added Route '/collect-consumption-data': Collects the consumption data from the consumption table in the online SQL database. The consumption data is then transferred to the frontend, and the data is displayed in a scatter plot.

- Added Route '/generate-consumption-data/\<N>': Generates N lots of consumption data returned in an array. This Route makes use of the create_data function in data_consumption.py to generate the data. The consumption data can then be uploaded to the SQL database if the user chooses to do so.

- Adjusted the Frontend to utilise the implemented backend routes

At this point, we have a functioning full-stack application which:  
- Has the ability to Receive consumption data and Validate it against the provided API schemas, providing accurate responses.
- Uses OOP principles for some of the system's core components
- Implements Robust Error handling for Invalid Operations
- Utilises Unit Testing to ensure all validation methods function correctly
- Illustrates the data and displays analytical results.

Next Steps: Display statistical information about the consumption data; allow users to search consumption data by ID, date, or other; Detect anomalies in the consumption data and expose them.