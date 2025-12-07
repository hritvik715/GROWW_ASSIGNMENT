# **Finance Dashboard – Groww Assignment**

## Live Demo  
https://groww-assignment.vercel.app


A customizable finance dashboard where users can add API widgets, track crypto/stock prices, and configure auto-refresh settings. Built using **Next.js, TypeScript, Tailwind, Zustand** and public finance APIs.

---

##  Features

- Add custom APIs
- Field picker (auto JSON parser)
- Auto refresh widgets
- Local storage persistence
- Export / Import config
- Clean UI and components
- Works with any public REST API

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| Next.js | Main Framework |
| TypeScript | Type safety |
| Zustand | State management |
| Tailwind CSS | Styling |
| Fetch API | API requests |

---

##  Installation

```sh
git clone https://github.com/<your-username>/GROWW_ASSIGNMENT.git
cd GROWW_ASSIGNMENT
npm install
```

---

## ▶️ Run Locally

```sh
npm run dev
```

Then open 👉 http://localhost:3000

---

##  Example APIs for testing

### **Coinbase**
```
https://api.coinbase.com/v2/exchange-rates?currency=BTC
```

### **AlphaVantage**
```
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo
```

### **Weather**
```
https://api.weatherapi.com/v1/current.json?key=demo&q=London
```

---

## 📤 Deployment (Recommended)

Deployed easily with **Vercel**:

```
Deploy with Vercel
```

Or visit https://vercel.com → Import Repo → Deploy

---

## 📁 Folder Structure

```
app/
components/
hooks/
store/
styles/
public/
```

---


## 🤝 Author
**Hritvik Mohan**

---

## ✔ Status
Project completed successfully 🎉
