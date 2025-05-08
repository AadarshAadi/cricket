from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import db
from datetime import datetime, timezone, timedelta
match_routes = Blueprint("match_routes", __name__)
def serialize_match(match):
    return {
        "id": str(match.get("_id")),
        "team1_id": str(match.get("team1_id")),
        "team2_id": str(match.get("team2_id")),
        "team1_score": match.get("team1_score"),
        "team2_score": match.get("team2_score"),
        "winner_id": str(match.get("winner")) if match.get("winner") else None,
        "date": match["date"].isoformat() if match.get("date") else None
    }
def convert_to_ist(utc_time):
    ist_offset = timedelta(hours=5, minutes=30)
    return utc_time + ist_offset

@match_routes.route("/matches", methods=["POST"])
def create_match():
    data = request.get_json()
    required = ["team1_id", "team2_id", "team1_score", "team2_score"]
    if not all(k in data for k in required):
        return {"error": "Missing required fields"}, 400
    try:
        team1 = db.teams.find_one({"_id": ObjectId(data["team1_id"])})
        team2 = db.teams.find_one({"_id": ObjectId(data["team2_id"])})
    except:
        return {"error": "Invalid team ID format"}, 400
    if not team1 or not team2:
        return {"error": "One or both team IDs are invalid"}, 400
    if data["team1_id"] == data["team2_id"]:
        return {"error": "Cannot have the same team play both sides"}, 400
    score1 = int(data["team1_score"])
    score2 = int(data["team2_score"])
    if score1 > score2:
        winner = ObjectId(data["team1_id"])
    elif score2 > score1:
        winner = ObjectId(data["team2_id"])
    else:
        winner = None
    match = {
        "team1_id": ObjectId(data["team1_id"]),
        "team2_id": ObjectId(data["team2_id"]),
        "team1_score": score1,
        "team2_score": score2,
        "winner": winner,
        "date": convert_to_ist(datetime.now(timezone.utc))  
    }
    result = db.matches.insert_one(match)
    return {"message": "Match recorded", "match_id": str(result.inserted_id)}
@match_routes.route("/matches", methods=["GET"])
def get_matches():
    matches = list(db.matches.find().sort("date", -1))
    return jsonify([serialize_match(m) for m in matches])
@match_routes.route("/matches", methods=["DELETE"])
def delete_all_matches():
    if request.args.get("confirm") != "true":
        return {"error": "Confirmation required to delete all matches"}, 400
    db.matches.delete_many({})
    return {"message": "All matches deleted"}, 200
