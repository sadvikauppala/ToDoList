# Run Script for ToDoList Application (PowerShell)
# Usage: .\run.ps1

$ErrorActionPreference = "Stop"

if (-not (Test-Path "dist/ToDoList.jar")) {
    Write-Host "Executable JAR not found. Building first..." -ForegroundColor Yellow
    & ".\build.ps1"
}

Write-Host "Launching ToDoList GUI Application..." -ForegroundColor Cyan
java -jar "dist/ToDoList.jar"
