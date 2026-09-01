# Quiz Application - Quick Start Guide

## File Structure
```
quizapp/
├── frontend/
│   └── src/
│       ├── App.jsx (✅ UPDATED - Main component with 3 screens)
│       ├── App.css (✅ UPDATED - Complete styling)
│       ├── index.css (✅ UPDATED - Global styles)
│       └── main.jsx
├── src/main/java/com/example/quizapp/
│   ├── controller/QuizController.java (NO CHANGES)
│   ├── service/QuestionService.java (NO CHANGES)
│   └── model/Question.java (NO CHANGES)
└── pom.xml
```

## Quick Commands

### Terminal 1: Backend
```bash
cd c:\Users\Akash S\Downloads\quizapp\quizapp
./mvnw.cmd spring-boot:run
# Backend ready at: http://localhost:8080
```

### Terminal 2: Frontend
```bash
cd c:\Users\Akash S\Downloads\quizapp\quizapp\frontend
npm run dev
# Frontend ready at: http://localhost:5173
```

## Three Screens Overview

### HOME SCREEN
- Select Category: Java, Spring Boot, SQL, Data Structures, General
- Select Difficulty: Easy, Medium, Hard
- Click "Start Quiz" button
- **API Called**: `GET /quiz?category={selected}&difficulty={selected}`

### QUIZ SCREEN
- Shows one question at a time
- Progress bar with percentage
- Category and difficulty badges
- 4 answer options with hover effects
- Next/Finish button (disabled until answer selected)
- Home button to return
- **State**: Stores all selected answers in `selectedAnswers` object

### RESULTS SCREEN
- Accuracy percentage in large circle
- Performance message
- Metrics: Total, Correct, Wrong answers
- Visual score bar
- Try Again button (retake same quiz)
- Back to Home button
- **API Called**: `POST /quiz/submit` with answers

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/quiz?category=X&difficulty=Y` | Fetch filtered questions |
| POST | `/quiz/submit` | Submit answers and get results |

## React State Structure

```javascript
// Screen Navigation
screen: 'home' | 'quiz' | 'results'

// Home Screen
selectedCategory: string (e.g., 'Java')
selectedDifficulty: string (e.g., 'Easy')

// Quiz Screen
questions: Array<QuestionDTO>
currentIndex: number (0-based)
selectedAnswers: Object { questionId: "answer text" }

// Common
loading: boolean
error: string
result: ResultDTO { totalQuestions, correctAnswers, wrongAnswers, score }
```

## Key Features
- ✅ No questions exposed in frontend (done by backend)
- ✅ All answers validated before submission
- ✅ Loading states handled
- ✅ Error messages shown to user
- ✅ Responsive mobile design
- ✅ Smooth animations and transitions
- ✅ Professional gradient UI

## Testing Checklist
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Can select category and difficulty
- [ ] Start Quiz button works
- [ ] Questions load successfully
- [ ] Can select answers
- [ ] Next button advances to next question
- [ ] Last question shows "Finish Quiz"
- [ ] Results page displays correctly
- [ ] Score calculation matches answers
- [ ] "Try Again" reruns with same settings
- [ ] "Back to Home" resets to home screen
- [ ] Mobile view is responsive

## Browser Console
- No errors should appear
- Network tab should show:
  - One GET request to `/quiz` endpoint
  - One POST request to `/quiz/submit` endpoint

## Need Help?
See `QUIZ_APP_CHANGES.md` for detailed documentation.
