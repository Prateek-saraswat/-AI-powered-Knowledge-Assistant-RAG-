from flask import Flask 
from app.config import Config
from app.extensions import init_mongo

def create_app() : 
    app = Flask(__name__)
    app.config.from_object(Config)

    init_mongo(app)


    @app.route('/')
    def health_check():
        return {"status" : "Backend running"} , 200



    return app