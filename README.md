# Khalilullah - Survey and Dashboard

A simple website to test one idea: a directory of trusted suppliers from Afghanistan.
Buyers use it for free. Sellers pay to be listed.

This project has three parts:

1. **The survey** (`index.html`) - friends answer a few multiple choice questions.
2. **The dashboard** (`dashboard.html`) - Khalilullah logs in and sees every answer.
3. **The database** - all answers are saved in Airtable.

Your secret Airtable token is kept safe on the server. It is never put in the code that goes to GitHub.

---

## What is already done

- The Airtable table is built for you, inside your existing **Main** base.
  - Base id: `appw2YRB8ziLp5Hhs`
  - Table name: `Khalilullah Survey`
- All the website code is written.

You only need to do two small things: make a token, and test it. Steps below.

---

## Step 1 - Get the files on your computer

You already have this folder. Open a terminal inside the `khalilullah-site` folder.

---

## Step 2 - Make your Airtable token

1. Go to https://airtable.com/create/tokens
2. Click **Create new token**.
3. Name it `Khalilullah website`.
4. Under **Scopes**, add these two:
   - `data.records:read`
   - `data.records:write`
5. Under **Access**, add the base named **Main** (the one with the `Khalilullah Survey` table).
6. Click **Create token** and copy the token. It starts with `pat`.

Keep this token private. Do not share it or put it in any public place.

---

## Step 3 - Test it on your computer

1. In the `khalilullah-site` folder, make a copy of the file `.env.example` and name the copy `.env`.
2. Open `.env` and paste your token after `AIRTABLE_TOKEN=`.
3. You can also change `DASH_PASSWORD` to your own password.
4. In the terminal, run:

   ```
   node dev-server.js
   ```

5. Open your browser:
   - Survey: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard.html

Fill in the survey once. Then open the dashboard, type your password, and you should see your answer.

To stop the server, press **Control + C**.

---

## Step 4 - Put it online with Vercel

1. Push this folder to your GitHub repo (see Step 5).
2. Go to https://vercel.com and sign in.
3. Click **Add New** and pick your GitHub repo.
4. Before you click Deploy, open **Environment Variables** and add these:

   | Name             | Value                          |
   |------------------|--------------------------------|
   | `AIRTABLE_TOKEN` | your token from Step 2         |
   | `AIRTABLE_BASE`  | `appw2YRB8ziLp5Hhs`           |
   | `AIRTABLE_TABLE` | `Khalilullah Survey`          |
   | `DASH_PASSWORD`  | your dashboard password        |

5. Click **Deploy**. In a minute your site is live.

Your live survey link is the main page. Your dashboard is that link plus `/dashboard.html`.

---

## Step 5 - Push to GitHub

Your repo: https://github.com/Tayyab-code-sys/khaliluulah

```
git init
git add .
git commit -m "Khalilullah survey and dashboard"
git branch -M main
git remote add origin https://github.com/Tayyab-code-sys/khaliluulah.git
git push -u origin main
```

The `.env` file with your token is never pushed. That is on purpose.

---

## The survey questions

All questions are multiple choice. The name and contact are short text.

1. What is your name?
2. Which one is you? (buyer, seller, both, feedback)
3. Have you ever tried to buy products from Afghanistan?
4. Which products interest you the most?
5. What is the hardest part of finding a supplier?
6. Would a website that lists Afghan suppliers help you?
7. Would you trust an online list of suppliers?
8. If the website is free for buyers, would you use it?
9. Do you think sellers will pay to be listed?
10. How often do you buy things from other countries?
11. Would you tell a friend about this website?
12. What would make you trust a supplier?
13. What do you think of this idea?
14. Your phone or email (not required)

---

## Contact

Khalilullah WhatsApp: +90 541 107 3398
