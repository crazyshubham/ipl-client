const API = 'https://ipl-api-srwd.onrender.com';
// ── All players list (loaded once) ──
let allPlayers = [];

// ── Safe JSON parse — handles Infinity/NaN from API ──
function safeParseJSON(text) {
    try {
        return JSON.parse(
            text
                .replace(/:\s*Infinity/g, ': null')
                .replace(/:\s*-Infinity/g, ': null')
                .replace(/:\s*NaN/g, ': null')
        );
    } catch(e) { return null; }
}

async function safeFetch(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const data = safeParseJSON(text);
    if (!data) throw new Error('Invalid JSON response');
    return data;
}

// ── Load teams into selects ──
async function loadTeams() {
    try {
        const data = await safeFetch(`${API}/api/teams`);
        const teams = data.teams.sort();
        ['tvt-team1', 'tvt-team2', 'team-select'].forEach(id => {
            const sel = document.getElementById(id);
            teams.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t;
                sel.appendChild(opt);
            });
        });
    } catch(e) {
        console.warn('Could not load teams:', e);
    }
}

// ── Load all players once ──
async function loadPlayers() {
    try {
        const data = await safeFetch(`${API}/api/players`);
        allPlayers = data.players.sort();
        // Once loaded, replace "Loading..." message in both dropdowns
        document.getElementById('bat-list').innerHTML = '';
        document.getElementById('bowl-list').innerHTML = '';
    } catch(e) {
        document.getElementById('bat-list').innerHTML = '<div class="dropdown-no-result">Could not load players</div>';
        document.getElementById('bowl-list').innerHTML = '<div class="dropdown-no-result">Could not load players</div>';
        console.warn('Could not load players:', e);
    }
}

// ── Open dropdown ──
function openDropdown(type) {
    filterPlayers(type); // show current filtered results
    document.getElementById(type + '-list').classList.add('open');
}

// ── Close all dropdowns when clicking outside ──
document.addEventListener('click', function(e) {
    ['bat', 'bowl'].forEach(type => {
        const wrap = document.getElementById(type + '-dropdown-wrap');
        if (wrap && !wrap.contains(e.target)) {
            document.getElementById(type + '-list').classList.remove('open');
        }
    });
});

// ── Filter players as user types ──
function filterPlayers(type) {
    const input = document.getElementById(type + '-input');
    const list = document.getElementById(type + '-list');
    const query = input.value.trim().toLowerCase();

    list.classList.add('open');

    if (allPlayers.length === 0) {
        list.innerHTML = '<div class="dropdown-loading">Loading players...</div>';
        return;
    }

    const matches = query === ''
        ? allPlayers.slice(0, 50)
        : allPlayers.filter(p => p.toLowerCase().includes(query)).slice(0, 50);

    if (matches.length === 0) {
        list.innerHTML = '<div class="dropdown-no-result">❌ No player found</div>';
        return;
    }

    list.innerHTML = matches.map(player =>
        `<div class="dropdown-item" onclick="selectPlayer('${type}', '${player.replace(/'/g, "\\'")}')">${player}</div>`
    ).join('');
}

// ── When user clicks a player name ──
function selectPlayer(type, playerName) {
    document.getElementById(type + '-input').value = playerName;
    document.getElementById(type + '-list').classList.remove('open');
    if (type === 'bat') fetchBatsman();
    else fetchBowler();
}

// ── Tab switching ──
function switchTab(id, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
}

// ── Loading helpers ──
function showLoading(id) {
    document.getElementById(id + '-loading').classList.add('active');
    const err = document.getElementById(id + '-error');
    if (err) { err.classList.remove('active'); err.textContent = ''; }
}

function hideLoading(id) {
    document.getElementById(id + '-loading').classList.remove('active');
}

function showError(id, msg) {
    hideLoading(id);
    const el = document.getElementById(id + '-error');
    el.textContent = '⚠ ' + msg;
    el.classList.add('active');
}

// ── Formatting helpers ──
function fmt(val) {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'number') {
        if (!isFinite(val)) return '—';
        return Number.isInteger(val) ? val : val.toFixed(2);
    }
    return val;
}

function pstat(val, label) {
    return `<div class="player-stat">
        <span class="ps-num">${fmt(val)}</span>
        <span class="ps-label">${label}</span>
    </div>`;
}

function shortName(team) {
    const map = {
        'Mumbai Indians': 'MI', 'Chennai Super Kings': 'CSK',
        'Royal Challengers Bangalore': 'RCB', 'Royal Challengers Bengaluru': 'RCB',
        'Kolkata Knight Riders': 'KKR', 'Sunrisers Hyderabad': 'SRH',
        'Delhi Capitals': 'DC', 'Delhi Daredevils': 'DD',
        'Rajasthan Royals': 'RR', 'Punjab Kings': 'PBKS',
        'Kings XI Punjab': 'KXIP', 'Lucknow Super Giants': 'LSG',
        'Gujarat Titans': 'GT',
    };
    return map[team] || team.split(' ').map(w => w[0]).join('').slice(0, 4);
}

// ── Team vs Team ──
async function fetchTVT() {
    const t1 = document.getElementById('tvt-team1').value;
    const t2 = document.getElementById('tvt-team2').value;
    const resultEl = document.getElementById('tvt-result');
    resultEl.style.display = 'none';

    if (!t1 || !t2) return showError('tvt', 'Please select both teams.');
    if (t1 === t2) return showError('tvt', 'Please select two different teams.');

    showLoading('tvt');
    try {
        const data = await safeFetch(`${API}/api/teamvteam?team1=${encodeURIComponent(t1)}&team2=${encodeURIComponent(t2)}`);
        hideLoading('tvt');

        if (data.message) return showError('tvt', data.message);

        const total = parseInt(data.total_matches);
        const w1 = parseInt(data[t1]);
        const w2 = parseInt(data[t2]);
        const draws = parseInt(data.draws);
        const winner = w1 > w2 ? t1 : w2 > w1 ? t2 : null;

        document.getElementById('tvt-grid').innerHTML = `
            <div class="stat-box ${winner === t1 ? 'winner' : ''}">
                <span class="stat-num">${w1}</span>
                <span class="stat-label">Wins</span>
                <div class="stat-team">${shortName(t1)}</div>
            </div>
            <div class="stat-box">
                <span class="stat-num">${total}</span>
                <span class="stat-label">Total Matches</span>
                <div class="stat-team">Played</div>
            </div>
            <div class="stat-box">
                <span class="stat-num">${draws}</span>
                <span class="stat-label">No Result</span>
                <div class="stat-team">Draws / NR</div>
            </div>
            <div class="stat-box ${winner === t2 ? 'winner' : ''}">
                <span class="stat-num">${w2}</span>
                <span class="stat-label">Wins</span>
                <div class="stat-team">${shortName(t2)}</div>
            </div>
        `;
        resultEl.style.display = 'block';
    } catch(e) {
        showError('tvt', 'Could not connect to API. Please try again.');
    }
}

// ── Team Record ──
async function fetchTeam() {
    const team = document.getElementById('team-select').value;
    const resultEl = document.getElementById('team-result');
    resultEl.innerHTML = '';

    if (!team) return showError('team', 'Please select a team.');

    showLoading('team');
    try {
        const data = await safeFetch(`${API}/api/team-record?team=${encodeURIComponent(team)}`);
        hideLoading('team');

        const rec = data[team]?.overall;
        if (!rec) return showError('team', 'No data found for this team.');

        const winPct = rec.matchesplayed ? ((rec.won / rec.matchesplayed) * 100).toFixed(1) : 0;

        resultEl.innerHTML = `
            <div class="record-card">
                <div class="record-header">
                    <div class="record-team-name">${team}</div>
                    ${rec.title > 0 ? `<div class="trophy-badge">🏆 ${rec.title} Title${rec.title > 1 ? 's' : ''}</div>` : ''}
                </div>
                <div class="progress-bar-wrap">
                    <div class="progress-label"><span>Win Rate</span><span>${winPct}%</span></div>
                    <div class="progress-bar"><div class="progress-fill fill-gold" style="width:${winPct}%"></div></div>
                </div>
                <div class="result-grid" style="grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px">
                    <div class="stat-box"><span class="stat-num">${rec.matchesplayed}</span><span class="stat-label">Played</span></div>
                    <div class="stat-box winner"><span class="stat-num">${rec.won}</span><span class="stat-label">Won</span></div>
                    <div class="stat-box"><span class="stat-num">${rec.loss}</span><span class="stat-label">Lost</span></div>
                    <div class="stat-box"><span class="stat-num">${rec.noResult}</span><span class="stat-label">No Result</span></div>
                </div>
            </div>
        `;
    } catch(e) {
        showError('team', 'Could not connect to API. Please try again.');
    }
}

// ── Batsman ──
async function fetchBatsman() {
    const name = document.getElementById('bat-input').value.trim();
    const resultEl = document.getElementById('bat-result');
    resultEl.innerHTML = '';

    if (!name) return showError('bat', 'Please select or type a batsman name.');

    showLoading('bat');
    try {
        const data = await safeFetch(`${API}/api/batting-record?batsman=${encodeURIComponent(name)}`);
        hideLoading('bat');

        const rec = data[name]?.all;
        if (!rec || rec.innings === 0) return showError('bat', 'No batting record found for this player.');

        resultEl.innerHTML = `
            <div class="record-card">
                <div class="record-header">
                    <div class="record-team-name">🏏 ${name}</div>
                    ${rec.mom > 0 ? `<div class="trophy-badge">⭐ ${rec.mom} MoM</div>` : ''}
                </div>
                <div class="player-stats-grid">
                    ${pstat(rec.innings, 'Innings')}
                    ${pstat(rec.runs, 'Runs')}
                    ${pstat(rec.avg, 'Average')}
                    ${pstat(rec.strikeRate, 'Strike Rate')}
                    ${pstat(rec.highestScore, 'Best Score')}
                    ${pstat(rec.fifties, 'Fifties')}
                    ${pstat(rec.hundreds, 'Hundreds')}
                    ${pstat(rec.fours, 'Fours')}
                    ${pstat(rec.sixes, 'Sixes')}
                    ${pstat(rec.notOut, 'Not Outs')}
                </div>
            </div>
        `;
    } catch(e) {
        showError('bat', 'Could not connect to API. Please try again.');
    }
}

// ── Bowler ──
async function fetchBowler() {
    const name = document.getElementById('bowl-input').value.trim();
    const resultEl = document.getElementById('bowl-result');
    resultEl.innerHTML = '';

    if (!name) return showError('bowl', 'Please select or type a bowler name.');

    showLoading('bowl');
    try {
        const data = await safeFetch(`${API}/api/bowling-record?bowler=${encodeURIComponent(name)}`);
        hideLoading('bowl');

        const rec = data[name]?.all;
        if (!rec || rec.innings === 0) return showError('bowl', 'No bowling record found for this player.');

        resultEl.innerHTML = `
            <div class="record-card">
                <div class="record-header">
                    <div class="record-team-name">🎯 ${name}</div>
                    ${rec.mom > 0 ? `<div class="trophy-badge">⭐ ${rec.mom} MoM</div>` : ''}
                </div>
                <div class="player-stats-grid">
                    ${pstat(rec.innings, 'Innings')}
                    ${pstat(rec.wicket, 'Wickets')}
                    ${pstat(rec.economy, 'Economy')}
                    ${pstat(rec.avg, 'Average')}
                    ${pstat(rec.strikeRate, 'Strike Rate')}
                    ${pstat(rec.best_figure, 'Best Figures')}
                    ${pstat(rec['3+W'], '3+ Wickets')}
                    ${pstat(rec.fours, 'Fours Given')}
                    ${pstat(rec.sixes, 'Sixes Given')}
                </div>
            </div>
        `;
    } catch(e) {
        showError('bowl', 'Could not connect to API. Please try again.');
    }
}

// ── Init ──
loadTeams();
loadPlayers();