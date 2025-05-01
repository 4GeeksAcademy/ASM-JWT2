"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body.get('email', None)
    password = body.get('password', None)
    username = body.get('username', None)

    if not email or not password or not username:
        return jsonify({"msg": "Falta campo requerido"}), 400

    user_by_email = User.query.filter_by(email=email).first()
    user_by_username = User.query.filter_by(username=username).first()

    if user_by_email:
        return jsonify({"msg": "El email ya está registrado"}), 400
    
    if user_by_username:
        return jsonify({"msg": "El nombre de usuario ya está en uso"}), 400

    
    new_user = User(username=username, password=password, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario creado exitosamente"}), 201


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get('email', None)
    password = body.get('password', None)

    if not email or not password:
        return jsonify({"msg": "Falta campo requerido"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Email o password incorrectos"}), 401

    access_token = create_access_token(identity=email)

    return jsonify({
        "msg": "Login exitoso",
        "token": access_token,
        "user_id": user.id,
        "email": user.email,
        "username": user.username
    }), 200


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():

    current_user_email = get_jwt_identity()

    user = User.query.filter_by(email=current_user_email).first()
    
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "logged_in_as": user.serialize(),
        "msg": "Acceso permitido a ruta protegida"
    }), 200


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
