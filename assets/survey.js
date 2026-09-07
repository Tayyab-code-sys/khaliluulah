// ============================================================
//  SURVEY QUESTIONS
//  Each "field" name must match the column name in Airtable.
//  type "radio"   = pick one
//  type "check"   = pick many
//  type "text"    = type your own answer
// ============================================================
const QUESTIONS = [
  {
    field: "Name",
    type: "text",
    text: "What is your name?",
    hint: "So Khalilullah knows who gave this feedback.",
    required: true,
    placeholder: "Your name"
  },
  {
    field: "Role",
    type: "radio",
    text: "Which one is you?",
    required: true,
    options: [
      "I want to buy products",
      "I sell products",
      "Both buy and sell",
      "Just here to give feedback"
    ]
  },
  {
    field: "Tried buying from Afghanistan",
    type: "radio",
    text: "Have you ever tried to buy products from Afghanistan?",
    required: true,
    options: [
      "Yes, many times",
      "Yes, once or twice",
      "No, but I want to",
      "No, never"
    ]
  },
  {
    field: "Products interested in",
    type: "check",
    text: "Which products interest you the most?",
    hint: "You can pick more than one.",
    required: false,
    options: [
      "Dry fruits and nuts",
      "Carpets and rugs",
      "Saffron",
      "Gemstones and jewelry",
      "Fresh fruits",
      "Handmade crafts",
      "Clothes and fabric",
      "Other"
    ]
  },
  {
    field: "Hardest part finding suppliers",
    type: "radio",
    text: "What is the hardest part of finding a supplier?",
    required: true,
    options: [
      "Finding sellers I can trust",
      "No contact details",
      "Language problems",
      "Not sure about quality",
      "Worried about shipping"
    ]
  },
  {
    field: "Would the directory help",
    type: "radio",
    text: "Would a website that lists Afghan suppliers help you?",
    required: true,
    options: [
      "Yes, a lot",
      "Yes, a little",
      "Not sure",
      "No"
    ]
  },
  {
    field: "Trust an online directory",
    type: "radio",
    text: "Would you trust an online list of suppliers?",
    required: true,
    options: [
      "Yes",
      "Maybe",
      "No"
    ]
  },
  {
    field: "Use it if free for buyers",
    type: "radio",
    text: "If the website is free for buyers, would you use it?",
    required: true,
    options: [
      "Yes",
      "Maybe",
      "No"
    ]
  },
  {
    field: "Sellers will pay to join",
    type: "radio",
    text: "Do you think sellers will pay to be listed?",
    required: true,
    options: [
      "Yes",
      "Maybe",
      "No"
    ]
  },
  {
    field: "How often buy from other countries",
    type: "radio",
    text: "How often do you buy things from other countries?",
    required: true,
    options: [
      "Every week",
      "Every month",
      "A few times a year",
      "Rarely",
      "Never"
    ]
  },
  {
    field: "Would tell a friend",
    type: "radio",
    text: "Would you tell a friend about this website?",
    required: true,
    options: [
      "Yes",
      "Maybe",
      "No"
    ]
  },
  {
    field: "What builds trust",
    type: "check",
    text: "What would make you trust a supplier?",
    hint: "You can pick more than one.",
    required: false,
    options: [
      "Reviews from other buyers",
      "A verified badge",
      "Photos of products",
      "A phone number",
      "A business license"
    ]
  },
  {
    field: "Overall opinion",
    type: "radio",
    text: "Last one. What do you think of this idea?",
    required: true,
    options: [
      "Great idea",
      "Good idea",
      "Okay idea",
      "Not a good idea"
    ]
  },
  {
    field: "Contact",
    type: "text",
    text: "Your phone or email (not required)",
    hint: "Only if you are happy for Khalilullah to reach you.",
    required: false,
    placeholder: "WhatsApp or email"
  }
];

// ---------- Build the form on the page ----------
const cfg = window.KHALIL_CONFIG || {};
const box = document.getElementById("questions");

QUESTIONS.forEach(function (q, i) {
  const card = document.createElement("div");
  card.className = "q";

  const num = document.createElement("span");
  num.className = "qnum";
  num.textContent = "Question " + (i + 1);
  card.appendChild(num);

  const label = document.createElement("span");
  label.className = "qtext";
  label.textContent = q.text + (q.required ? " *" : "");
  card.appendChild(label);

  if (q.hint) {
    const hint = document.createElement("p");
    hint.className = "qhint";
    hint.textContent = q.hint;
    card.appendChild(hint);
  }

  if (q.type === "text") {
    const input = document.createElement("input");
    input.className = "text-input";
    input.type = "text";
    input.name = q.field;
    input.placeholder = q.placeholder || "";
    if (q.required) input.required = true;
    card.appendChild(input);
  } else {
    const opts = document.createElement("div");
    opts.className = "options";
    q.options.forEach(function (optText) {
      const wrap = document.createElement("label");
      wrap.className = "opt";
      const input = document.createElement("input");
      input.type = q.type === "check" ? "checkbox" : "radio";
      input.name = q.field;
      input.value = optText;
      const span = document.createElement("span");
      span.textContent = optText;
      wrap.appendChild(input);
      wrap.appendChild(span);
      opts.appendChild(wrap);

      input.addEventListener("change", function () {
        if (q.type === "radio") {
          opts.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("checked"); });
        }
        wrap.classList.toggle("checked", input.checked);
      });
    });
    card.appendChild(opts);
  }

  box.appendChild(card);
});

// ---------- WhatsApp links ----------
const waNumber = (cfg.whatsapp || "").replace(/[^0-9]/g, "");
const waLink = "https://wa.me/" + waNumber;
const waThanks = document.getElementById("wa-thanks");
const waContact = document.getElementById("wa-contact");
if (waThanks) waThanks.href = waLink;
if (waContact) waContact.href = waLink;

// ---------- Read the answers ----------
function collectAnswers() {
  const form = document.getElementById("survey-form");
  const fields = {};

  QUESTIONS.forEach(function (q) {
    if (q.type === "text") {
      const el = form.querySelector('[name="' + CSS.escape(q.field) + '"]');
      const val = el ? el.value.trim() : "";
      if (val) fields[q.field] = val;
    } else if (q.type === "check") {
      const checked = form.querySelectorAll('[name="' + CSS.escape(q.field) + '"]:checked');
      const vals = Array.prototype.map.call(checked, function (c) { return c.value; });
      if (vals.length) fields[q.field] = vals;
    } else {
      const el = form.querySelector('[name="' + CSS.escape(q.field) + '"]:checked');
      if (el) fields[q.field] = el.value;
    }
  });

  return fields;
}

// ---------- Check required questions ----------
function firstMissing(fields) {
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    if (q.required && !fields[q.field]) return q.text;
  }
  return null;
}

// ---------- Send to Airtable ----------
const form = document.getElementById("survey-form");
const errorLine = document.getElementById("error-line");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  errorLine.textContent = "";

  const fields = collectAnswers();

  const missing = firstMissing(fields);
  if (missing) {
    errorLine.textContent = "Please answer: " + missing;
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: fields })
  })
    .then(function (res) {
      if (!res.ok) return res.text().then(function (t) { throw new Error(t); });
      return res.json();
    })
    .then(function () {
      form.style.display = "none";
      document.getElementById("thanks").style.display = "block";
      document.getElementById("thanks").scrollIntoView({ behavior: "smooth" });
    })
    .catch(function (err) {
      console.error(err);
      errorLine.textContent = "Sorry, something went wrong. Please try again.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send my answers";
    });
});
