#!/usr/bin/env bash
# Build and Test Script for ToDoList (Bash)
# Usage: ./build.sh

set -e

echo "=========================================="
echo "    Building ToDoList (Java Project)     "
echo "=========================================="

CLASSES_DIR="build/classes"
TEST_CLASSES_DIR="build/test/classes"
DIST_DIR="dist"
DIST_LIB_DIR="dist/lib"

mkdir -p "$CLASSES_DIR" "$TEST_CLASSES_DIR" "$DIST_LIB_DIR"

echo "[1/4] Compiling Java source files..."
CLASSPATH="lib/*:lib/beans-binding/*:lib/junit_4/*"
javac -encoding UTF-8 -cp "$CLASSPATH" -d "$CLASSES_DIR" src/com/mrjaffesclass/apcs/todolist/*.java
echo "Source compilation successful."

echo "[2/4] Compiling and running JUnit unit tests..."
TEST_CLASSPATH="$CLASSES_DIR:$TEST_CLASSES_DIR:$CLASSPATH"
javac -encoding UTF-8 -cp "$TEST_CLASSPATH" -d "$TEST_CLASSES_DIR" test/com/mrjaffesclass/apcs/todolist/*.java

echo "Executing tests with JUnitCore..."
java -Djava.awt.headless=true -cp "$TEST_CLASSPATH" org.junit.runner.JUnitCore com.mrjaffesclass.apcs.todolist.ToDoItemTest com.mrjaffesclass.apcs.todolist.AppModelTest
echo "All tests passed successfully!"

echo "[3/4] Packaging executable JAR..."
cp lib/beans-binding/beansbinding-1.2.1.jar "$DIST_LIB_DIR/"
cp lib/messenger.jar "$DIST_LIB_DIR/"
cp lib/swingx-all-1.6.4.jar "$DIST_LIB_DIR/"

cat << 'EOF' > "$DIST_DIR/MANIFEST.MF"
Manifest-Version: 1.0
Class-Path: lib/beansbinding-1.2.1.jar lib/messenger.jar lib/swingx-all-1.6.4.jar
Main-Class: com.mrjaffesclass.apcs.todolist.AppController

EOF

jar cfm "$DIST_DIR/ToDoList.jar" "$DIST_DIR/MANIFEST.MF" -C "$CLASSES_DIR" .
echo "Package created: $DIST_DIR/ToDoList.jar"

echo "=========================================="
echo "             BUILD COMPLETE               "
echo "=========================================="
