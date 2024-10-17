from flask import Flask,make_response,request
from flask_migrate import Migrate
from models import *

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel.db'

migrate = Migrate(app,db)
db.init_app(app)




if __name__ == '__main__':
    app.run(port=5000,debug=True)