from pymongo import MongoClient
from pymongo.errors import PyMongoError 
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

mongo_client = None
db = None
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[]
)

def init_mongo(app):
    global mongo_client, db

    try:
        mongo_uri = app.config["MONGO_URI"]
        mongo_client = MongoClient(mongo_uri)

        mongo_client.admin.command("ping")
        
        db = mongo_client.get_default_database()
        print("MongoDB connected sucessfully")


    except PyMongoError as e:
            print("MongoDB connection failed")
            print(e)