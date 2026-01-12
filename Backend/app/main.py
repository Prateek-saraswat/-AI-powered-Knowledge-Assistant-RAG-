from flask import Flask
from app.config import Config
from app.extensions import init_mongo
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, supports_credentials=True)

    # Initialize MongoDB
    init_mongo(app)

    # Register document routes
    from app.routes.documents import documents_bp
    app.register_blueprint(documents_bp, url_prefix="/documents")

    # Register chat routes
    from app.routes.chat import chat_bp
    app.register_blueprint(chat_bp, url_prefix="/chat")

    # 🔐 Register auth routes (THIS WAS MISSING)
    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/auth")

    @app.route("/")
    def health_check():
        return {"status": "Backend running"}, 200

    return app
