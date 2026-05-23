# 🏏 IPL Stats Arena — Client

A Flask-based web client for the IPL Stats Arena platform. Provides a beautiful, interactive UI to explore IPL cricket statistics including team records, head-to-head battles, and player batting/bowling performance.

---

## 🚀 Live Demo

**Client URL:** `https://ipl-client.onrender.com`  
**API Server:** `https://ipl-api-srwd.onrender.com`

---

## ✨ Features

- 🆚 **Team vs Team** — Head-to-head battle records between any two IPL teams
- 🛡️ **Team Record** — Overall win/loss performance and titles won by each team
- 🏏 **Batsman Stats** — Career batting stats including runs, average, strike rate, fifties, hundreds
- 🎯 **Bowler Stats** — Career bowling stats including wickets, economy, average, best figures
- 📱 Fully responsive design
- ⚡ Fast search with live player filtering

- ## 🎮 Usage

### 🆚 Team vs Team
1. Select **"Team vs Team"** from the navigation
2. Choose any two IPL teams from the dropdowns
3. Hit **Search** to see full head-to-head battle history

---

### 🛡️ Team Record
1. Select **"Team Record"** from the navigation
2. Pick any IPL team from the dropdown
3. View overall wins, losses, titles, and performance stats

---

### 🏏 Batsman Stats
1. Select **"Batsman Stats"** from the navigation
2. Type a player name in the search bar — results filter live
3. Click on a player to view career batting stats:
   - Runs, Average, Strike Rate, Fifties, Hundreds

---

### 🎯 Bowler Stats
1. Select **"Bowler Stats"** from the navigation
2. Type a player name in the search bar — results filter live
3. Click on a player to view career bowling stats:
   - Wickets, Economy, Average, Best Figures

---

> 💡 **Tip:** The live search filters players as you type — no need to press Enter!

---

## 📁 Project Structure

```
ipl-client/
├── static/
│   ├── app.js          # Frontend JavaScript (API calls & UI logic)
│   └── styles.css      # Stylesheet
├── templates/
│   └── index.html      # Main HTML template
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/crazyshubham/ipl-client.git
cd ipl-client
```

**2. Install dependencies:**
```bash
pip install -r requirements.txt
```

**3. Set environment variable:**
```bash
# Windows
set API_BASE_URL=https://ipl-api-srwd.onrender.com

# Mac/Linux
export API_BASE_URL=https://ipl-api-srwd.onrender.com
```

**4. Run the app:**
```bash
python app.py
```

App runs on `http://127.0.0.1:7000`

---

## 📦 Requirements

```
flask
requests
gunicorn
```

---

## 🌐 Deployment (Render)

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repository
4. Set the following:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Add **Environment Variable:**
   - Key: `API_BASE_URL`
   - Value: `https://ipl-api-srwd.onrender.com`
6. Deploy!

---

## 🔧 How It Works

```
User Browser
     │
     ▼
ipl-client (Flask)          ←──  Renders HTML/CSS/JS
     │
     ▼
ipl-api (Flask REST API)    ←──  Returns JSON data
     │
     ▼
IPL Dataset (Pandas)        ←──  Processes cricket data
```

---

## 🛠️ Built With

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Requests](https://requests.readthedocs.io/) - HTTP calls to API
- [Gunicorn](https://gunicorn.org/) - Production server
- [Bebas Neue & Rajdhani](https://fonts.google.com/) - Google Fonts
- Vanilla JavaScript - Frontend logic

---

## 👨‍💻 Author

**Shubham Upadhyay** — [GitHub](https://github.com/crazyshubham)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
