
from datetime import datetime, timezone
from app import db


def utc_now():
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=utc_now)


class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(
        db.Integer, db.ForeignKey("users.id"), nullable=False, index=True
    )
    item_name = db.Column(db.String(150), nullable=False)
    report_type = db.Column(db.String(10), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    incident_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(10), nullable=False, default="Open")
    created_at = db.Column(db.DateTime(timezone=True), default=utc_now)

    creator = db.relationship("User", backref="items")
