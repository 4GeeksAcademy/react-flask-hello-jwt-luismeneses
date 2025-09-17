from flask import request, jsonify, Blueprint
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import datetime as dt
import jwt
from api.models import db, User
from flask import current_app

api = Blueprint("api", __name__)
CORS(api)

def create_token(user: User) -> str:
    exp = dt.datetime.utcnow() + dt.timedelta(minutes=current_app.config["JWT_EXPIRES_MIN"])
    payload = {"sub": str(user.id), "email": user.email, "exp": exp}
    token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")
    return token.decode("utf-8") if isinstance(token, bytes) else token

def decode_token(token: str):
    try:
        print("decode_token1", token)
        user = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
        print("decode_token2", user)
        return user
    except jwt.ExpiredSignatureError:
        print("Token expirado")
        return {"error": "expired"}
    except jwt.InvalidTokenError as e:
        print("Token inválido:", e)
        return {"error": "invalid"}
    
def require_auth_from_header():
    print("ENTRO")
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    print("ENTRO2")
    token = auth.split(" ", 1)[1].strip()
    data = decode_token(token)
    if not data or "error" in data:
        return None
    print("ENTRO3")
    return User.query.get(data.get("sub"))

@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son obligatorios"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El email ya está registrado"}), 409

    hashed_password = generate_password_hash(password)
    user = User(email=email, password=hashed_password, is_active=True)

    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Usuario creado. Por favor inicia sesión."}), 201

@api.route("/token", methods=["POST"])
def token():
    print("/token", current_app.config["SECRET_KEY"])
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_token(user)
    return jsonify({"token": token, "user": user.serialize()}), 200

@api.route("/verify", methods=["GET"])
def verify():
    user = require_auth_from_header()
    if not user:
        return jsonify({"ok": False}), 401
    return jsonify({"ok": True, "user": user.serialize()}), 200

@api.route("/private", methods=["GET"])
def private():
    user = require_auth_from_header()
    if not user:
        return jsonify({"msg": "No autorizado"}), 401
    return jsonify({"secret": f"Hola {user.email}. Este es el contenido privado."}), 200
