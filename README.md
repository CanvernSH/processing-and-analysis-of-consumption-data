# Processing and Analysis of Consumption Data App

This full-stack app aims to process and analyse consumption data, displaying the results to the end user.

1. Project Start - Validate Data, Test Validation and Create Data
- To start this project, I am utilising test-driven development to ensure that the consumption data is in the correct format. In the backend, in data_consumption.py, the class ValidateData allows the user to input data. The validity of the data can then be tested using the methods within this class. Some initial tests for valid and invalid data can be found in test.py, where I use pytest to assert that the data is processed correctly.

- Additionally, I have added the ability to generate random data using the create_data function in data_consumption.py.

- Finally, I have added two simple routes in app.py to connect the frontend to the backend as an initial start to the full-stack app.

2. Introduced an initial design of the plot of the consumption data 
- Progressing the application, I have added a simple example of a plot for the frontend using d3.js. The plot distinguishes Imports and Exports using separate colours, uses the x-axis for the consumption date and the y-axis for the consumption value. Additionally, on hover of a point it displays information about the point such as the household_id. 
- Next Steps: Create an SQL database to store the data; connect the frontend, backend and database; and introduce robust error handling for invalid operations.