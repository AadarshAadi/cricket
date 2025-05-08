from flask import Flask
from flask_cors import CORS
from routes.team_routes import team_routes
from routes.player_routes import player_routes
from routes.match_routes import match_routes
app = Flask(__name__)
CORS(app)
app.register_blueprint(team_routes)
app.register_blueprint(player_routes)
app.register_blueprint(match_routes)
@app.route('/')
def home():
    return 'Welcome to the Cricket Player Management System!'
if __name__ == '__main__':
    app.run(debug=True)
