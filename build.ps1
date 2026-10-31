# Build and Test Script for ToDoList (PowerShell)
# Usage: .\build.ps1 [-RunTests] [-PackageJar]

param(
    [switch]$RunTests = $true,
    [switch]$PackageJar = $true
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    Building ToDoList (Java Project)     " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Directories setup
$classesDir = "build/classes"
$testClassesDir = "build/test/classes"
$distDir = "dist"
$distLibDir = "dist/lib"

New-Item -ItemType Directory -Force -Path $classesDir | Out-Null
New-Item -ItemType Directory -Force -Path $testClassesDir | Out-Null
New-Item -ItemType Directory -Force -Path $distLibDir | Out-Null

# 2. Compile Main Source Code
Write-Host "[1/4] Compiling Java source files..." -ForegroundColor Yellow
$classpath = "lib/*;lib/beans-binding/*;lib/junit_4/*"
$javaFiles = Get-ChildItem -Path "src/com/mrjaffesclass/apcs/todolist" -Filter "*.java" | ForEach-Object { $_.FullName }
javac -encoding UTF-8 -cp $classpath -d $classesDir $javaFiles

if ($LASTEXITCODE -ne 0) {
    Write-Error "Compilation failed."
    exit $LASTEXITCODE
}
Write-Host "Source compilation successful." -ForegroundColor Green

# 3. Compile and Run Unit Tests
if ($RunTests) {
    Write-Host "[2/4] Compiling and running JUnit unit tests..." -ForegroundColor Yellow
    $testClasspath = "$classesDir;$testClassesDir;$classpath"
    $testFiles = Get-ChildItem -Path "test/com/mrjaffesclass/apcs/todolist" -Filter "*.java" | ForEach-Object { $_.FullName }
    javac -encoding UTF-8 -cp $testClasspath -d $testClassesDir $testFiles

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Test compilation failed."
        exit $LASTEXITCODE
    }

    Write-Host "Executing tests with JUnitCore..." -ForegroundColor Yellow
    java -cp $testClasspath org.junit.runner.JUnitCore com.mrjaffesclass.apcs.todolist.ToDoItemTest com.mrjaffesclass.apcs.todolist.AppModelTest

    if ($LASTEXITCODE -ne 0) {
        Write-Error "One or more tests failed!"
        exit $LASTEXITCODE
    }
    Write-Host "All tests passed successfully!" -ForegroundColor Green
}

# 4. Package JAR
if ($PackageJar) {
    Write-Host "[3/4] Packaging executable JAR..." -ForegroundColor Yellow
    Copy-Item -Path "lib/beans-binding/beansbinding-1.2.1.jar" -Destination $distLibDir -Force
    Copy-Item -Path "lib/messenger.jar" -Destination $distLibDir -Force
    Copy-Item -Path "lib/swingx-all-1.6.4.jar" -Destination $distLibDir -Force

    $manifestContent = @"
Manifest-Version: 1.0
Class-Path: lib/beansbinding-1.2.1.jar lib/messenger.jar lib/swingx-all-1.6.4.jar
Main-Class: com.mrjaffesclass.apcs.todolist.AppController

"@
    $manifestFile = "$distDir/MANIFEST.MF"
    [System.IO.File]::WriteAllText((Resolve-Path $distDir).Path + "/MANIFEST.MF", $manifestContent)

    # Find jar tool
    $jarCmd = "jar"
    if (-not (Get-Command "jar" -ErrorAction SilentlyContinue)) {
        $foundJar = Get-ChildItem "C:\Program Files\Java\jdk*\bin\jar.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($foundJar) {
            $jarCmd = $foundJar.FullName
        } elseif ($env:JAVA_HOME -and (Test-Path "$env:JAVA_HOME\bin\jar.exe")) {
            $jarCmd = "$env:JAVA_HOME\bin\jar.exe"
        }
    }

    & $jarCmd cfm "$distDir/ToDoList.jar" $manifestFile -C $classesDir .
    Write-Host "Package created: $distDir/ToDoList.jar" -ForegroundColor Green
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "             BUILD COMPLETE               " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
