import re

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from werkzeug.security import generate_password_hash, check_password_hash

from app import db
from app.database import User

from datetime import date

from app.database import Item

api = Blueprint("api", __name__)


@api.get("/health")
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Campus Lost & Found API is running"
    }), 200


@api.post("/auth/register")
def register():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be valid JSON."}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all(isinstance(value, str) for value in (name, email, password)):
        return jsonify({
            "error": "Name, email and password are required."
        }), 400

    name = name.strip()
    email = email.strip().lower()

    if not name or len(name) > 100:
        return jsonify({
            "error": "Name must contain 1–100 characters."
        }), 400

    if len(email) > 255 or not re.fullmatch(
        r"[^@\s]+@[^@\s]+\.[^@\s]+", email
    ):
        return jsonify({"error": "Enter a valid email address."}), 400

    if len(password) < 8 or len(password) > 128:
        return jsonify({
            "error": "Password must contain 8–128 characters."
        }), 400

    existing_user = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({
            "error": "An account with this email already exists."
        }), 409

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Account created successfully.",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
    }), 201


@api.post("/auth/login")
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be valid JSON."}), 400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({
            "error": "Email and password are required."
        }), 400

    email = email.strip().lower()

    user = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()

    if user is None or not check_password_hash(
        user.password_hash, password
    ):
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful.",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
    }), 200


@api.get("/auth/me")
@jwt_required()
def current_user():
    user_id = get_jwt_identity()

    user = db.session.get(User, int(user_id))

    if user is None:
        return jsonify({"error": "User not found."}), 404

    return jsonify({
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }
    }), 200


def serialize_item(item):
    return {
        "id": item.id,
        "creator_id": item.creator_id,
        "item_name": item.item_name,
        "report_type": item.report_type,
        "category": item.category,
        "description": item.description,
        "location": item.location,
        "incident_date": item.incident_date.isoformat(),
        "status": item.status,
        "created_at": (
            item.created_at.isoformat() if item.created_at else None
        ),
    }


@api.post("/items")
@jwt_required()
def create_item():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Request body must be valid JSON."}), 400

    required_fields = [
        "item_name",
        "report_type",
        "category",
        "description",
        "location",
        "incident_date",
    ]

    for field in required_fields:
        if not isinstance(data.get(field), str) or not data[field].strip():
            return jsonify({
                "error": f"{field} is required and must be a string."
            }), 400

    item_name = data["item_name"].strip()
    report_type = data["report_type"].strip().title()
    category = data["category"].strip()
    description = data["description"].strip()
    location = data["location"].strip()

    if len(item_name) > 150:
        return jsonify({"error": "Item name is too long."}), 400

    if report_type not in ("Lost", "Found"):
        return jsonify({
            "error": "report_type must be Lost or Found."
        }), 400

    if len(category) > 50 or len(location) > 200:
        return jsonify({
            "error": "Category or location exceeds the allowed length."
        }), 400

    if len(description) > 5000:
        return jsonify({"error": "Description is too long."}), 400

    try:
        incident_date = date.fromisoformat(data["incident_date"].strip())
    except ValueError:
        return jsonify({
            "error": "incident_date must use YYYY-MM-DD format."
        }), 400

    user_id = int(get_jwt_identity())

    item = Item(
        creator_id=user_id,
        item_name=item_name,
        report_type=report_type,
        category=category,
        description=description,
        location=location,
        incident_date=incident_date,
        status="Open",
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({
        "message": "Item report created successfully.",
        "item": serialize_item(item),
    }), 201


@api.get("/items")
def list_items():
    query = db.select(Item)

    keyword = request.args.get("q", "").strip()
    report_type = request.args.get("type", "").strip().title()
    category = request.args.get("category", "").strip()

    if report_type and report_type not in ("Lost", "Found"):
        return jsonify({
            "error": "type must be Lost or Found."
        }), 400

    if keyword:
        pattern = f"%{keyword}%"
        query = query.where(
            db.or_(
                Item.item_name.ilike(pattern),
                Item.description.ilike(pattern),
            )
        )

    if report_type:
        query = query.where(Item.report_type == report_type)

    if category:
        query = query.where(Item.category == category)

    query = query.order_by(Item.created_at.desc(), Item.id.desc())
    items = db.session.execute(query).scalars().all()

    return jsonify({
        "items": [serialize_item(item) for item in items],
        "count": len(items),
    }), 200


@api.get("/items/<int:item_id>")
def get_item(item_id):
    item = db.session.get(Item, item_id)

    if item is None:
        return jsonify({"error": "Item report not found."}), 404

    return jsonify({"item": serialize_item(item)}), 200
