// ============================================================
//  THE FEEDBACK LEDGER  -  password gate + read from our server
// ============================================================

// Single choice questions we draw as bar charts.
const CHART_FIELDS = [
  "Overall opinion",
  "Would the directory help",
  "Use it if free for buyers",
  "Trust an online directory",
  "Sellers will pay to join",
  "Would tell a friend",
  "Tried buying from Afghanistan",
  "Hardest part finding suppliers",
  "How often buy from other countries",
  "Role"
];

// Multi choice questions also drawn as bars (counts across all picks).
const MULTI_CHART_FIELDS = ["Products interested in", "What builds trust"];

// Columns for the ledger table.
const TABLE_FIELDS = [
  "Name",
  "Role",
  "Overall opinion",
  "Would the directory help",
  "Use it if free for buyers",
  "Trust an online directory",
  "Sellers will pay to join",
  "Would tell a friend",
  "Tried buying from Afghanistan",
  "Products interested in",
  "Hardest part finding suppliers",
  "What builds trust",
  "How often buy from other countries",
  "Contact",
  "Submitted"
];

const loginScreen = document.getElementById("login-screen");
const dashScreen = document.getElementById("dash-screen");
const pwInput = document.getElementById("pw-input");
const pwBtn = document.getElementById("pw-btn");
const loginError = document.getElementById("login-error");

let currentPassword = sessionStorage.getItem("khalil_pw") || "";

if (currentPassword) showDashboard();

pwBtn.addEventListener("click", tryLogin);
pwInput.addEventListener("keydown", function (e) { if (e.key === "Enter") tryLogin(); });

function tryLogin() {
  currentPassword = pwInput.value;
  loginError.textContent = "Checking…";
  showDashboard();
}

document.getElementById("logout-btn").addEventListener("click", function () {
  sessionStorage.removeItem("khalil_pw");
  location.reload();
});

function showDashboard() {
  loadRecords();
}

// ---------- Load records through our own server ----------
function loadRecords() {
  const dashError = document.getElementById("dash-error");
  dashError.textContent = "";

  fetch("/api/responses", { headers: { "x-dash-password": currentPassword } })
    .then(function (res) {
      if (res.status === 401) {
        loginError.textContent = "Wrong password. Please try again.";
        throw new Error("bad password");
      }
      if (!res.ok) return res.text().then(function (t) { throw new Error(t); });
      return res.json();
    })
    .then(function (data) {
      sessionStorage.setItem("khalil_pw", currentPassword);
      loginError.textContent = "";
      loginScreen.style.display = "none";
      dashScreen.style.display = "block";
      document.getElementById("dash-loading").style.display = "none";
      document.getElementById("dash-content").style.display = "block";
      render(data.records || []);
    })
    .catch(function (err) {
      console.error(err);
      if (err.message !== "bad password") {
        document.getElementById("dash-loading").style.display = "none";
        dashError.textContent = "Could not load answers. Please try again.";
      }
    });
}

// ---------- Draw everything ----------
function render(records) {
  const rows = records.map(function (r) { return r.fields || {}; });

  setDate();
  drawStats(rows);
  drawCharts(rows);
  drawTable(rows);
  requestAnimationFrame(function () { requestAnimationFrame(animateBars); });
}

function setDate() {
  const el = document.getElementById("mast-date");
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  el.textContent = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function pct(n, total) { return total ? Math.round((n / total) * 100) : 0; }

function countWhere(rows, field, values) {
  let c = 0;
  rows.forEach(function (f) { if (values.indexOf(f[field]) !== -1) c++; });
  return c;
}

function drawStats(rows) {
  const total = rows.length;
  const likeIt = countWhere(rows, "Overall opinion", ["Great idea", "Good idea"]);
  const wouldUse = countWhere(rows, "Use it if free for buyers", ["Yes"]);
  const tellFriend = countWhere(rows, "Would tell a friend", ["Yes"]);

  const stats = [
    { num: String(total), label: "People answered", foot: "friends gave feedback" },
    { num: pct(likeIt, total) + "%", label: "Like the idea", foot: likeIt + " said great or good" },
    { num: pct(wouldUse, total) + "%", label: "Would use it free", foot: wouldUse + " said yes" },
    { num: pct(tellFriend, total) + "%", label: "Would tell a friend", foot: tellFriend + " said yes" }
  ];

  const band = document.getElementById("stat-band");
  band.innerHTML = "";
  stats.forEach(function (s, i) {
    const num = formatNum(s.num);
    const el = document.createElement("div");
    el.className = "stat";
    el.style.animationDelay = (i * 0.08) + "s";
    el.innerHTML =
      '<div class="stat-num">' + num + '</div>' +
      '<div class="stat-label">' + s.label + '</div>' +
      '<div class="stat-foot">' + s.foot + '</div>';
    band.appendChild(el);
  });
}

// Wrap a trailing % or other suffix in a smaller span.
function formatNum(s) {
  const m = String(s).match(/^(\d+)(\D+)?$/);
  if (m && m[2]) return m[1] + '<span class="suffix">' + m[2] + "</span>";
  return s;
}

function tallySingle(rows, field) {
  const counts = {};
  rows.forEach(function (f) {
    const v = f[field];
    if (v == null || v === "") return;
    counts[v] = (counts[v] || 0) + 1;
  });
  return counts;
}

function tallyMulti(rows, field) {
  const counts = {};
  rows.forEach(function (f) {
    const v = f[field];
    if (!Array.isArray(v)) return;
    v.forEach(function (item) { counts[item] = (counts[item] || 0) + 1; });
  });
  return counts;
}

function drawCharts(rows) {
  const wrap = document.getElementById("charts");
  wrap.innerHTML = "";
  const total = rows.length;

  const specs = [];
  CHART_FIELDS.forEach(function (f) { specs.push({ field: f, multi: false }); });
  MULTI_CHART_FIELDS.forEach(function (f) { specs.push({ field: f, multi: true }); });

  let shown = 0;
  specs.forEach(function (spec) {
    const counts = spec.multi ? tallyMulti(rows, spec.field) : tallySingle(rows, spec.field);
    const keys = Object.keys(counts);
    if (!keys.length) return;

    // Sort biggest first.
    keys.sort(function (a, b) { return counts[b] - counts[a]; });
    const max = counts[keys[0]];

    const card = document.createElement("div");
    card.className = "chart-card";
    card.style.animationDelay = (shown * 0.05) + "s";
    shown++;

    let html =
      '<h3>' + escapeHtml(spec.field) + "</h3>" +
      '<div class="chart-total">' + (spec.multi ? "picks from " + total + " people" : total + " answers") + "</div>";

    keys.forEach(function (opt, idx) {
      const n = counts[opt];
      const w = max ? (n / max) * 100 : 0;
      const denom = spec.multi ? total : total;
      html +=
        '<div class="bar-row">' +
          '<div class="bar-top">' +
            '<span class="opt">' + escapeHtml(opt) + "</span>" +
            '<span class="val">' + n + '<span class="pct">' + pct(n, denom) + "%</span></span>" +
          "</div>" +
          '<div class="track"><div class="fill' + (idx === 0 ? " lead" : "") + '" data-w="' + w + '"></div></div>' +
        "</div>";
    });

    card.innerHTML = html;
    wrap.appendChild(card);
  });
}

function animateBars() {
  document.querySelectorAll(".fill").forEach(function (el) {
    el.style.width = (el.getAttribute("data-w") || 0) + "%";
  });
}

function opinionClass(v) {
  if (v === "Great idea") return "great";
  if (v === "Good idea") return "good";
  if (v === "Okay idea") return "okay";
  if (v === "Not a good idea") return "bad";
  return "okay";
}

function drawTable(rows) {
  const table = document.getElementById("resp-table");

  let head = "<thead><tr>";
  TABLE_FIELDS.forEach(function (f) { head += "<th>" + escapeHtml(f) + "</th>"; });
  head += "</tr></thead>";

  let body = "<tbody>";
  if (!rows.length) {
    body += '<tr><td colspan="' + TABLE_FIELDS.length + '" class="muted">No answers yet. Share the survey link to get started.</td></tr>';
  }
  rows.forEach(function (f) {
    body += "<tr>";
    TABLE_FIELDS.forEach(function (field) {
      let v = f[field];

      if (field === "Name") {
        body += '<td class="name">' + escapeHtml(v || "—") + "</td>";
        return;
      }
      if (field === "Overall opinion" && v) {
        body += '<td><span class="pill ' + opinionClass(v) + '">' + escapeHtml(v) + "</span></td>";
        return;
      }
      if (Array.isArray(v)) {
        const chips = v.map(function (item) { return '<span class="chip">' + escapeHtml(item) + "</span>"; }).join("");
        body += "<td>" + (chips || '<span class="muted">—</span>') + "</td>";
        return;
      }
      if (field === "Submitted" && v) {
        body += '<td class="muted">' + escapeHtml(new Date(v).toLocaleString()) + "</td>";
        return;
      }
      body += "<td" + (v ? "" : ' class="muted"') + ">" + escapeHtml(v == null || v === "" ? "—" : String(v)) + "</td>";
    });
    body += "</tr>";
  });
  body += "</tbody>";

  table.innerHTML = head + body;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
