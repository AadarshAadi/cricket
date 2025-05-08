from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import db
team_routes = Blueprint("team_routes", __name__)
def serialize_team(team):
    return {
        "_id": str(team["_id"]),
        "name": team["name"],
        "city": team["city"]
    }
@team_routes.route("/teams", methods=["GET"])
def get_teams():
    teams = list(db.teams.find())
    return jsonify([serialize_team(team) for team in teams])
@team_routes.route("/teams", methods=["POST"])
def create_team():
    data = request.get_json()
    if not data.get("name") or not data.get("city"):
        return {"error": "Name and city are required"}, 400
    new_team = {
        "name": data["name"],
        "city": data["city"]
    }
    result = db.teams.insert_one(new_team)
    return {"message": "Team created", "team_id": str(result.inserted_id)}
@team_routes.route("/teams/<team_id>", methods=["PUT"])
def update_team(team_id):
    data = request.get_json()
    result = db.teams.update_one(
        {"_id": ObjectId(team_id)},
        {"$set": {"name": data.get("name"), "city": data.get("city")}}
    )
    if result.matched_count == 0:
        return {"error": "Team not found"}, 404
    return {"message": "Team updated"}
@team_routes.route("/teams/<team_id>", methods=["DELETE"])
def delete_team(team_id):
    result = db.teams.delete_one({"_id": ObjectId(team_id)})
    if result.deleted_count == 0:
        return {"error": "Team not found"}, 404
    return {"message": "Team deleted"}
@team_routes.route("/teams/<team_id>/match-history", methods=["GET"])
def get_team_match_history(team_id):
    team = db.teams.find_one({"_id": ObjectId(team_id)})
    if not team:
        return {"error": "Team not found"}, 404
    players = list(db.players.find({"team_id": ObjectId(team_id)}))
    player_ids = [player["_id"] for player in players]
    player_map = {str(player["_id"]): player for player in players}
    matches = list(db.matches.find({
        "$or": [{"team1_id": ObjectId(team_id)}, {"team2_id": ObjectId(team_id)}]
    }))
    match_data = []
    for match in matches:
        stats = []
        for pid in player_ids:
            stat = db.player_stats.find_one({
                "match_id": match["_id"],
                "player_id": pid
            })
            if stat:
                stats.append({
                    "player_id": str(pid),
                    "name": player_map[str(pid)]["name"],
                    "runs": stat.get("runs", 0),
                    "wickets": stat.get("wickets", 0)
                })
        match_data.append({
            "match_id": str(match["_id"]),
            "date": match.get("date", ""),
            "opponent": str(match["team2_id"]) if match["team1_id"] == ObjectId(team_id) else str(match["team1_id"]),
            "stats": stats
        })
    return jsonify({
        "team": {
            "id": str(team["_id"]),
            "name": team["name"]
        },
        "players": [{
            "id": str(p["_id"]),
            "name": p["name"],
            "runs": p.get("runs", 0),
            "wickets": p.get("wickets", 0),
            "matches_played": p.get("matches_played", 0)
        } for p in players],
        "matches": match_data
    })
