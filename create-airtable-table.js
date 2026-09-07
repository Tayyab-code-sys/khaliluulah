// ============================================================
//  CODE TO CREATE THE AIRTABLE TABLE
// ============================================================
//  You do NOT need to run this. The table is already made.
//  Base id:  appw2YRB8ziLp5Hhs   (your "Main" base)
//  Table:    Khalilullah Survey
//
//  Keep this file only if you ever want to build the same table
//  again in a new base. To run it:
//
//    1) Put your token and base id in the two lines below.
//    2) In a terminal:   node create-airtable-table.js
// ============================================================

const TOKEN = process.env.AIRTABLE_TOKEN || "paste_your_token_here";
const BASE = process.env.AIRTABLE_BASE || "appw2YRB8ziLp5Hhs";

function choices(list) {
  return { choices: list.map(function (name) { return { name: name }; }) };
}

const table = {
  name: "Khalilullah Survey",
  description: "Survey feedback for the Afghan supplier directory idea",
  fields: [
    { name: "Name", type: "singleLineText" },
    { name: "Role", type: "singleSelect", options: choices([
      "I want to buy products", "I sell products", "Both buy and sell", "Just here to give feedback"]) },
    { name: "Tried buying from Afghanistan", type: "singleSelect", options: choices([
      "Yes, many times", "Yes, once or twice", "No, but I want to", "No, never"]) },
    { name: "Products interested in", type: "multipleSelects", options: choices([
      "Dry fruits and nuts", "Carpets and rugs", "Saffron", "Gemstones and jewelry",
      "Fresh fruits", "Handmade crafts", "Clothes and fabric", "Other"]) },
    { name: "Hardest part finding suppliers", type: "singleSelect", options: choices([
      "Finding sellers I can trust", "No contact details", "Language problems",
      "Not sure about quality", "Worried about shipping"]) },
    { name: "Would the directory help", type: "singleSelect", options: choices([
      "Yes, a lot", "Yes, a little", "Not sure", "No"]) },
    { name: "Trust an online directory", type: "singleSelect", options: choices(["Yes", "Maybe", "No"]) },
    { name: "Use it if free for buyers", type: "singleSelect", options: choices(["Yes", "Maybe", "No"]) },
    { name: "Sellers will pay to join", type: "singleSelect", options: choices(["Yes", "Maybe", "No"]) },
    { name: "How often buy from other countries", type: "singleSelect", options: choices([
      "Every week", "Every month", "A few times a year", "Rarely", "Never"]) },
    { name: "Would tell a friend", type: "singleSelect", options: choices(["Yes", "Maybe", "No"]) },
    { name: "What builds trust", type: "multipleSelects", options: choices([
      "Reviews from other buyers", "A verified badge", "Photos of products",
      "A phone number", "A business license"]) },
    { name: "Overall opinion", type: "singleSelect", options: choices([
      "Great idea", "Good idea", "Okay idea", "Not a good idea"]) },
    { name: "Contact", type: "singleLineText" },
    { name: "Submitted", type: "dateTime", options: {
      dateFormat: { name: "friendly" }, timeFormat: { name: "12hour" }, timeZone: "Europe/Istanbul" } }
  ]
};

async function main() {
  const url = "https://api.airtable.com/v0/meta/bases/" + BASE + "/tables";
  const r = await fetch(url, {
    method: "POST",
    headers: { "Authorization": "Bearer " + TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(table)
  });
  const data = await r.json();
  if (!r.ok) {
    console.error("Failed:", JSON.stringify(data, null, 2));
    process.exit(1);
  }
  console.log("Table created. Id:", data.id);
}

main();
