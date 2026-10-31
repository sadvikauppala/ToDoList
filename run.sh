#!/usr/bin/env bash
# Run Script for ToDoList (Bash)
# Usage: ./run.sh

set -e

if [ ! -f "dist/ToDoList.jar" ]; then
    echo "Executable JAR not found. Building first..."
    ./build.sh
fi

echo "Launching ToDoList GUI Application..."
java -jar "dist/ToDoList.jar"
