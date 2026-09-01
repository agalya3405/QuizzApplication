# 🚀 Quiz Application - Quick Reference Card

## ⚡ 30-Second Quick Start

```powershell
# Terminal 1: Start Backend
cd c:\Users\Akash S\Downloads\quizapp\quizapp
.\mvnw.cmd spring-boot:run

# Terminal 2: Load Questions
.\load-questions.ps1

# Terminal 3: Start Frontend
cd frontend
npm run dev

# Open: http://localhost:5173
```

---

## 📊 What You Have

| Item | Count |
|------|-------|
| Java | 26 |
| Spring Boot | 20 |
| SQL | 20 |
| Data Structures | 19 |
| General | 15 |
| **TOTAL** | **100** ✓ |

---

## 🎯 Three Files to Know

1. **questions.json** - The questions (already created)
2. **load-questions.ps1** - Runs `POST /questions/bulk`
3. **verify-questions.ps1** - Validates before uploading

---

## 🔧 Common Commands

```bash
# Check backend is running
curl http://localhost:8080/questions

# Get Java Easy questions
curl "http://localhost:8080/quiz?category=Java&difficulty=Easy"

# Count total questions in database
curl http://localhost:8080/questions | jq length
```

---

## ✅ Verification Checklist

- [ ] Backend running (on port 8080)
- [ ] Run: `.\load-questions.ps1`
- [ ] See: "Successfully uploaded all questions!"
- [ ] Frontend running (on port 5173)
- [ ] Open: http://localhost:5173
- [ ] Select category & difficulty
- [ ] Click "Start Quiz"
- [ ] Questions display ✓

---

## 🆘 If Something Fails

| Problem | Solution |
|---------|----------|
| Backend won't start | `./mvnw.cmd spring-boot:run` |
| JSON parsing error | `.\verify-questions.ps1` |
| Questions won't load | Check backend logs |
| Frontend shows nothing | Refresh page, check console |

---

## 📁 All Files Created

```
quizapp/
├── questions.json                 # 100 questions ready
├── load-questions.ps1             # Loader script
├── verify-questions.ps1           # Validator script
├── COMPLETION_REPORT.md           # This summary
├── QUESTIONS_SUMMARY.md           # Detailed docs
├── LOADING_QUESTIONS_GUIDE.md     # Full guide
└── QUICK_REFERENCE.md             # This card
```

---

## 💾 Database Info

- **Database**: quizdb (PostgreSQL)
- **Table**: questions
- **New questions IDs**: Auto-generated (no conflicts)
- **Existing questions**: Not deleted, preserved

---

## 🎓 Quality Assurance

✓ 100 unique questions
✓ Technically accurate
✓ Interview-ready
✓ No duplicates
✓ All options valid
✓ Proper JSON format
✓ All fields present

---

## 🚀 Ready?

Run: `.\load-questions.ps1`

That's it! Your quiz app is populated! 🎉
