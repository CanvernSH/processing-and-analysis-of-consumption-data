from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# -------------------- Routes ------------------W

@app.route("/")
def hello_world():
    return {'message': "Hello, World"}

@app.route("/validate-data")
def validate_data():
    valid = False
    if valid == False:
        return {'message': 'error'}
    
    if valid == True:
        return {'message': 'data is valid'}

# Start the server
if __name__ == '__main__':
    app.run()