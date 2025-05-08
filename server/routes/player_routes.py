from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import db
player_routes = Blueprint("player_routes", __name__)
def serialize_player(player):
    return {
        "_id": str(player["_id"]),
        "name": player["name"],
        "age": player["age"],
        "role": player["role"],
        "team_id": str(player["team_id"]),
        "runs": player.get("runs", 0),
        "wickets": player.get("wickets", 0),
        "matches_played": player.get("matches_played", 0)
    }
@player_routes.route("/players", methods=["GET"])
def get_players():
    players = list(db.players.find())
    return jsonify([serialize_player(player) for player in players])
@player_routes.route("/players", methods=["POST"])
def create_player():
    data = request.get_json()
    required_fields = ["name", "age", "role", "team_id"]
    if not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400
    team = db.teams.find_one({"_id": ObjectId(data["team_id"])})
    if not team:
        return {"error": "Invalid team ID"}, 400
    new_player = {
    "name": data["name"],
    "age": data["age"],
    "role": data["role"],
    "team_id": ObjectId(data["team_id"]),
    "runs": data.get("runs", 0),
    "wickets": data.get("wickets", 0),
    "matches_played": data.get("matches_played", 0)
    }
    result = db.players.insert_one(new_player)
    return {"message": "Player created", "player_id": str(result.inserted_id)}
@player_routes.route("/players/<player_id>", methods=["PUT"])
def update_player(player_id):
    data = request.get_json()
    update_data = {
    "name": data.get("name"),
    "age": data.get("age"),
    "role": data.get("role"),
    "runs": data.get("runs", 0),
    "wickets": data.get("wickets", 0),
    "matches_played": data.get("matches_played", 0),
    }
    if data.get("team_id"):
        update_data["team_id"] = ObjectId(data["team_id"])
    result = db.players.update_one(
        {"_id": ObjectId(player_id)},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        return {"error": "Player not found"}, 404
    return {"message": "Player updated"}
@player_routes.route("/players/<player_id>", methods=["DELETE"])
def delete_player(player_id):
    result = db.players.delete_one({"_id": ObjectId(player_id)})
    if result.deleted_count == 0:
        return {"error": "Player not found"}, 404
    return {"message": "Player deleted"}
