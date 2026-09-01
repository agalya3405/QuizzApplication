# Quiz Application - Bulk Question Loader
# This script loads questions from questions.json into the database via the REST API

# Configuration
$backendUrl = "http://localhost:8080"
$questionsFile = "questions.json"

Write-Host "================================"
Write-Host "Quiz Application Question Loader"
Write-Host "================================"
Write-Host ""

# Check if backend is running
Write-Host "Checking if backend is running at $backendUrl..."
try {
    $health = Invoke-WebRequest -Uri "$backendUrl/questions" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend is not running!" -ForegroundColor Red
    Write-Host "Please start the backend with: ./mvnw.cmd spring-boot:run"
    exit 1
}

Write-Host ""

# Check if questions.json exists
if (-not (Test-Path $questionsFile)) {
    Write-Host "✗ File not found: $questionsFile" -ForegroundColor Red
    exit 1
}

Write-Host "Loading questions from $questionsFile..."

# Read and parse JSON
try {
    $questionsJson = Get-Content $questionsFile -Raw | ConvertFrom-Json
    Write-Host "✓ Successfully read $($questionsJson.Count) questions" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to parse JSON file" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Count questions by category and difficulty
$categoryCount = @{}
$difficultyCount = @{}

foreach ($q in $questionsJson) {
    if (-not $categoryCount[$q.category]) {
        $categoryCount[$q.category] = 0
    }
    $categoryCount[$q.category]++
    
    if (-not $difficultyCount[$q.difficulty]) {
        $difficultyCount[$q.difficulty] = 0
    }
    $difficultyCount[$q.difficulty]++
}

Write-Host "Question Distribution:"
Write-Host "  By Category:"
foreach ($category in $categoryCount.Keys | Sort-Object) {
    Write-Host "    - $category : $($categoryCount[$category]) questions"
}
Write-Host "  By Difficulty:"
foreach ($difficulty in $difficultyCount.Keys | Sort-Object) {
    Write-Host "    - $difficulty : $($difficultyCount[$difficulty]) questions"
}

Write-Host ""

# Upload questions
$endpoint = "$backendUrl/questions/bulk"
Write-Host "Uploading to $endpoint..."

try {
    $json = $questionsJson | ConvertTo-Json -Depth 10
    
    $response = Invoke-WebRequest `
        -Uri $endpoint `
        -Method POST `
        -ContentType "application/json" `
        -Body $json `
        -TimeoutSec 30
    
    Write-Host "✓ Successfully uploaded all questions!" -ForegroundColor Green
    Write-Host "  Response Status: $($response.StatusCode)"
    Write-Host ""
    
} catch {
    Write-Host "✗ Failed to upload questions" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)"
    exit 1
}

Write-Host "================================"
Write-Host "Setup Complete!"
Write-Host "================================"
Write-Host ""
Write-Host "You can now:"
Write-Host "  1. Start the frontend: npm run dev"
Write-Host "  2. Open http://localhost:5173"
Write-Host "  3. Select category and difficulty to see the new questions"
Write-Host ""
Write-Host "To verify the data, run:"
Write-Host "  curl http://localhost:8080/questions"
Write-Host ""
