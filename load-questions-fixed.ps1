# Quiz Application - Bulk Question Loader (Fixed)

$backendUrl = "http://localhost:8080"
$questionsFile = "questions.json"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Quiz Application Question Loader" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Checking if backend is running at $backendUrl..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "$backendUrl/questions" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "Backend is not running!" -ForegroundColor Red
    Write-Host "Please start the backend first with: ./mvnw.cmd spring-boot:run"
    exit 1
}

Write-Host ""

# Check if questions.json exists
if (-not (Test-Path $questionsFile)) {
    Write-Host "File not found: $questionsFile" -ForegroundColor Red
    exit 1
}

Write-Host "Loading questions from $questionsFile..." -ForegroundColor Yellow

# Read and parse JSON
try {
    $questionsJson = Get-Content $questionsFile -Raw | ConvertFrom-Json
    Write-Host "Successfully read $($questionsJson.Count) questions" -ForegroundColor Green
} catch {
    Write-Host "Failed to parse JSON file" -ForegroundColor Red
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

Write-Host "Question Distribution:" -ForegroundColor Cyan
Write-Host "  By Category:" -ForegroundColor Cyan
foreach ($category in $categoryCount.Keys | Sort-Object) {
    Write-Host "    - $category : $($categoryCount[$category]) questions"
}
Write-Host "  By Difficulty:" -ForegroundColor Cyan
foreach ($difficulty in $difficultyCount.Keys | Sort-Object) {
    Write-Host "    - $difficulty : $($difficultyCount[$difficulty]) questions"
}

Write-Host ""

# Upload questions
$endpoint = "$backendUrl/questions/bulk"
Write-Host "Uploading to $endpoint..." -ForegroundColor Yellow

try {
    $json = $questionsJson | ConvertTo-Json -Depth 10
    
    $response = Invoke-WebRequest `
        -Uri $endpoint `
        -Method POST `
        -ContentType "application/json" `
        -Body $json `
        -TimeoutSec 30
    
    Write-Host "Successfully uploaded all questions!" -ForegroundColor Green
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "Failed to upload questions" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Questions have been loaded successfully!" -ForegroundColor Green
Write-Host ""
