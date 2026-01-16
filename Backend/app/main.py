from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import init_mongo , limiter

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        origins=app.config["CORS_ORIGINS"],
        supports_credentials=True
    )

    init_mongo(app)
    limiter.init_app(app)

    # Register routes
    from app.routes.auth import auth_bp
    from app.routes.documents import documents_bp
    from app.routes.chat import chat_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(documents_bp, url_prefix="/documents")
    app.register_blueprint(chat_bp, url_prefix="/chat")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    @app.route("/")
    def health():
        return {"status": "Backend running"}, 200

    return app
