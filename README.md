# 🏏 IPL Stats Arena — Client

A Flask-based web client for the IPL Stats Arena platform. Provides a beautiful, interactive UI to explore IPL cricket statistics including team records, head-to-head battles, and player batting/bowling performance.

---

## 🚀 Live Demo

**Client URL:** `https://ipl-client.onrender.com`  
**API Server:** `https://ipl-api-tau.vercel.app`

---

## ✨ Features

- 🆚 **Team vs Team** — Head-to-head battle records between any two IPL teams
- 🛡️ **Team Record** — Overall win/loss performance and titles won by each team
- 🏏 **Batsman Stats** — Career batting stats including runs, average, strike rate, fifties, hundreds
- 🎯 **Bowler Stats** — Career bowling stats including wickets, economy, average, best figures
- 📱 Fully responsive design
- ⚡ Fast search with live player filtering

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
set API_BASE_URL=https://ipl-api-tau.vercel.app

# Mac/Linux
export API_BASE_URL=https://ipl-api-tau.vercel.app
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
   - Value: `https://ipl-api-tau.vercel.app`
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
