# Quiz Application - Questions Population Guide

## What Was Created

I've prepared a complete set of **100 high-quality quiz questions** distributed across your 5 categories:

### Question Distribution
- **Java**: 25 questions (Mix of Easy, Medium, Hard)
- **Spring Boot**: 20 questions (Mix of Easy, Medium, Hard)
- **SQL**: 20 questions (Mix of Easy, Medium, Hard)
- **Data Structures**: 20 questions (Mix of Easy, Medium, Hard)
- **General**: 15 questions (Mix of Easy, Medium, Hard)

### Files Created

1. **questions.json**
   - Contains all 100 questions in JSON format
   - Ready to be uploaded via your existing `/questions/bulk` API endpoint
   - Each question follows your exact schema:
     ```json
     {
       "question": "Question text",
       "option1": "Option A",
       "option2": "Option B",
       "option3": "Option C",
       "option4": "Option D",
       "rightAnswer": "Option A",  // Must be exact text of one option
       "category": "Java",
       "difficulty": "Easy"
     }
     ```

2. **load-questions.ps1**
   - PowerShell script to automatically load questions into your database
   - Checks if backend is running
   - Validates JSON file
   - Displays question distribution
   - Posts all questions via REST API
   - Shows confirmation upon success

## How to Load Questions

### Step 1: Start Your Backend
```bash
cd c:\Users\Akash S\Downloads\quizapp\quizapp
.\mvnw.cmd spring-boot:run
```
Wait until you see: `Started QuizappApplication`

### Step 2: Run the Loader Script
Open PowerShell and navigate to your project root, then run:
```powershell
.\load-questions.ps1
```

The script will:
1. ✓ Verify the backend is running
2. ✓ Read and parse questions.json
3. ✓ Show the question distribution
4. ✓ Upload all 100 questions via POST /questions/bulk
5. ✓ Display a success message

### Step 3: Verify the Data (Optional)
```bash
# List all questions
curl http://localhost:8080/questions

# Test filtering by category and difficulty
curl "http://localhost:8080/quiz?category=Java&difficulty=Easy"
curl "http://localhost:8080/quiz?category=Spring%20Boot&difficulty=Medium"
curl "http://localhost:8080/quiz?category=SQL&difficulty=Hard"
```

## Question Structure Verified

✓ All questions use **your exact schema**:
- `id`: Auto-generated (not in JSON, database handles this)
- `question`: Question text
- `option1`, `option2`, `option3`, `option4`: Answer choices
- `rightAnswer`: **Exact text** of the correct option
- `category`: One of [Java, Spring Boot, SQL, Data Structures, General]
- `difficulty`: One of [Easy, Medium, Hard]

✓ **No duplicates**: Each question is unique
✓ **No duplicate options**: Within each question, all 4 options are different
✓ **Correct answers verified**: rightAnswer always matches one of the 4 options exactly
✓ **Plausible wrong options**: Wrong answers are realistic and educational

## Quality Assurance

Each question:
- ✓ Is technically accurate
- ✓ Tests real knowledge/concepts
- ✓ Is appropriate for interview/placement preparation
- ✓ Has exactly 1 correct answer
- ✓ Has exactly 3 plausible wrong answers
- ✓ Uses proper terminology for the category
- ✓ Has correct spelling and grammar

## No Breaking Changes

✓ **Backend**: No modifications to Java code
✓ **Database**: Schema unchanged (JPA handles ID generation)
✓ **API**: Uses existing `/questions/bulk` endpoint
✓ **Frontend**: No changes needed
✓ **Existing Questions**: Not deleted, new questions appended
✓ **Filtering**: Category/Difficulty filtering continues to work

## After Loading Questions

You can immediately:
1. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open the application at: `http://localhost:5173`

3. Select any category (Java, Spring Boot, SQL, Data Structures, General)

4. Select any difficulty (Easy, Medium, Hard)

5. Click "Start Quiz" to test the new questions

6. The frontend will:
   - Fetch questions from your backend
   - Display them one by one
   - Allow answer selection
   - Calculate scores on submission

## Alternative: Manual Loading

If PowerShell script doesn't work, you can manually load questions:

### Using cURL
```powershell
$json = Get-Content questions.json -Raw
Invoke-WebRequest -Uri "http://localhost:8080/questions/bulk" `
  -Method POST `
  -ContentType "application/json" `
  -Body $json
```

### Using Postman
1. Import `questions.json`
2. Create POST request to `http://localhost:8080/questions/bulk`
3. Set Content-Type to `application/json`
4. Paste entire JSON array as body
5. Send request

## Troubleshooting

### "Backend is not running"
- Ensure Spring Boot is started: `./mvnw.cmd spring-boot:run`
- Wait for "Started QuizappApplication" message
- Check http://localhost:8080/questions in browser

### "Failed to parse JSON file"
- Ensure questions.json is in the correct directory
- Verify JSON syntax (proper quotes, brackets, etc.)
- Run: `Get-Content questions.json | ConvertFrom-Json` to test

### "Failed to upload questions"
- Check backend logs for errors
- Ensure all required fields are present
- Verify rightAnswer matches one of the option fields exactly
- Check database connection (PostgreSQL running)

### Questions not showing in frontend
1. Reload page in browser
2. Check browser console for errors
3. Verify questions exist: `curl http://localhost:8080/questions`
4. Try specific category filter: `curl "http://localhost:8080/quiz?category=Java&difficulty=Easy"`

## Database Information

Your database configuration (from application.properties):
- **Database**: quizdb
- **Host**: localhost:5432
- **Username**: postgres
- **JPA DDL**: update (auto-creates/updates schema)

Questions are stored in the `questions` table with auto-increment `id`.

## Next Steps

1. ✓ Run: `.\load-questions.ps1`
2. ✓ Wait for success message
3. ✓ Start frontend: `npm run dev`
4. ✓ Test the application at `http://localhost:5173`
5. ✓ Select category → difficulty → start quiz

Your Quiz Application is now fully populated and ready to use!
