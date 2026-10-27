import os

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()


def create_app(test_config=None):
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///campus_lost_found.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get(
    "JWT_SECRET_KEY",
    "local-development-only-key-change-before-deployment-123456"
)

    if test_config:
        app.config.update(test_config)

    CORS(app, origins=["http://localhost:5173"])

    db.init_app(app)
    jwt.init_app(app)

    from app.routes import api

    app.register_blueprint(api, url_prefix="/api")

    with app.app_context():
        from app.database import User, Item
        db.create_all()

    return app
