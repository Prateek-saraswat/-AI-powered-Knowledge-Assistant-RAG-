from pymongo import MongoClient
from pymongo.errors import PyMongoError , ServerSelectionTimeoutError
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

mongo_client = None
db = None
mongo_connected = False

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[]
)

def init_mongo(app):
    global mongo_client, db , mongo_connected

    try:
        mongo_uri = app.config["MONGO_URI"]
        mongo_client = MongoClient(mongo_uri , serverSelectionTimeoutMS=5000)

        mongo_client.admin.command("ping")
        
        db = mongo_client.get_default_database()
        mongo_connected = True
        print("MongoDB connected sucessfully")


    except (PyMongoError, ServerSelectionTimeoutError) as e:
            db = None
            mongo_connected = False
            print("MongoDB connection failed")
            print(e)