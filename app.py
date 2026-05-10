from flask import Flask, render_template, request
import requests
import urllib.parse
import os

app = Flask(__name__)

API_BASE = os.environ.get('API_BASE_URL', 'http://127.0.0.1:5000')

def get_teams():
    response = requests.get(f'{API_BASE}/api/teams')
    return sorted(response.json()['teams'])

@app.route('/')
def home():
    try:
        teams = get_teams()
    except Exception:
        teams = []
    return render_template('index.html', teams=teams, api_base=API_BASE)

@app.route('/teamvteam')
def team_vs_team():
    team1 = request.args.get('team1')
    team2 = request.args.get('team2')
    result = None
    error = None

    try:
        teams = get_teams()
        if not team1 or not team2:
            error = "Please select both teams."
        elif team1 == team2:
            error = "Please select two different teams."
        else:
            url = f'{API_BASE}/api/teamvteam?team1={urllib.parse.quote(team1)}&team2={urllib.parse.quote(team2)}'
            response = requests.get(url)
            result = response.json()
    except Exception:
        error = "Could not connect to API service."
        teams = []

    return render_template('index.html', result=result, teams=teams, error=error)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 7000)))