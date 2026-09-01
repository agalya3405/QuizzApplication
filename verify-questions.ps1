#!/usr/bin/env powershell

# Verify questions.json structure and content

$questionsFile = "questions.json"

Write-Host "Verifying questions.json..." -ForegroundColor Cyan
Write-Host ""

# Load JSON
$questions = Get-Content $questionsFile -Raw | ConvertFrom-Json

$totalCount = $questions.Count
Write-Host "Total Questions: $totalCount" -ForegroundColor Green

Write-Host ""
Write-Host "Questions by Category:" -ForegroundColor Yellow

$categoryGroups = $questions | Group-Object -Property category

foreach ($group in $categoryGroups | Sort-Object Name) {
    $categoryName = $group.Name
    $categoryCount = $group.Count
    
    # Count by difficulty within this category
    $difficultyGroups = $group.Group | Group-Object -Property difficulty
    $difficulties = @{}
    foreach ($d in $difficultyGroups) {
        $difficulties[$d.Name] = $d.Count
    }
    
    Write-Host "  [$categoryCount] $categoryName"
    foreach ($diff in @("Easy", "Medium", "Hard")) {
        if ($difficulties[$diff]) {
            Write-Host "      - $diff : $($difficulties[$diff])"
        }
    }
}

Write-Host ""
Write-Host "Total by Difficulty:" -ForegroundColor Yellow

$difficultyGroups = $questions | Group-Object -Property difficulty
foreach ($group in $difficultyGroups | Sort-Object Name) {
    Write-Host "  [$($group.Count)] $($group.Name)"
}

Write-Host ""
Write-Host "Validation Checks:" -ForegroundColor Yellow

$validationPassed = $true

# Check 1: All required fields
Write-Host "  Checking required fields..."
$missingFields = 0
foreach ($i in 0..($questions.Count-1)) {
    $q = $questions[$i]
    $requiredFields = @("question", "option1", "option2", "option3", "option4", "rightAnswer", "category", "difficulty")
    
    foreach ($field in $requiredFields) {
        if (-not $q.$field) {
            Write-Host "    [ERROR] Question $($i+1): Missing field '$field'" -ForegroundColor Red
            $missingFields++
            $validationPassed = $false
        }
    }
}

if ($missingFields -eq 0) {
    Write-Host "    ✓ All required fields present" -ForegroundColor Green
}

# Check 2: RightAnswer is one of the options
Write-Host "  Checking rightAnswer validity..."
$invalidAnswers = 0
foreach ($i in 0..($questions.Count-1)) {
    $q = $questions[$i]
    $isValid = ($q.rightAnswer -eq $q.option1) -or 
               ($q.rightAnswer -eq $q.option2) -or 
               ($q.rightAnswer -eq $q.option3) -or 
               ($q.rightAnswer -eq $q.option4)
    
    if (-not $isValid) {
        Write-Host "    [ERROR] Question $($i+1): rightAnswer '$($q.rightAnswer)' doesn't match any option" -ForegroundColor Red
        $invalidAnswers++
        $validationPassed = $false
    }
}

if ($invalidAnswers -eq 0) {
    Write-Host "    ✓ All rightAnswers are valid" -ForegroundColor Green
}

# Check 3: Valid categories
Write-Host "  Checking valid categories..."
$validCategories = @("Java", "Spring Boot", "SQL", "Data Structures", "General")
$invalidCategories = 0
foreach ($q in $questions) {
    if ($validCategories -notcontains $q.category) {
        Write-Host "    [ERROR] Invalid category: '$($q.category)'" -ForegroundColor Red
        $invalidCategories++
        $validationPassed = $false
    }
}

if ($invalidCategories -eq 0) {
    Write-Host "    ✓ All categories are valid" -ForegroundColor Green
}

# Check 4: Valid difficulties
Write-Host "  Checking valid difficulties..."
$validDifficulties = @("Easy", "Medium", "Hard")
$invalidDifficulties = 0
foreach ($q in $questions) {
    if ($validDifficulties -notcontains $q.difficulty) {
        Write-Host "    [ERROR] Invalid difficulty: '$($q.difficulty)'" -ForegroundColor Red
        $invalidDifficulties++
        $validationPassed = $false
    }
}

if ($invalidDifficulties -eq 0) {
    Write-Host "    ✓ All difficulties are valid" -ForegroundColor Green
}

# Check 5: No duplicate questions
Write-Host "  Checking for duplicate questions..."
$uniqueQuestions = $questions.question | Select-Object -Unique
$duplicateCount = $questions.Count - $uniqueQuestions.Count
if ($duplicateCount -eq 0) {
    Write-Host "    ✓ No duplicate questions" -ForegroundColor Green
} else {
    Write-Host "    [WARNING] Found $duplicateCount duplicate questions" -ForegroundColor Yellow
    $validationPassed = $false
}

Write-Host ""

if ($validationPassed) {
    Write-Host "✓ Validation PASSED - questions.json is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Run load-questions.ps1 to load into database"
} else {
    Write-Host "✗ Validation FAILED - Please check errors above" -ForegroundColor Red
    exit 1
}
