String Analyzer API

This project is a RESTful API service that allows users to analyze strings and store their computed properties for later retrieval and filtering. It was built as part of the Backend Wizards Stage 1 Task. The API is designed to handle string analysis efficiently and provide multiple endpoints for creating, retrieving, filtering, and deleting strings.

Features

For each analyzed string, the API computes and stores the following properties:

Length: Number of characters in the string.

Palindrome check: Boolean indicating if the string reads the same forwards and backwards.

Unique characters: Count of distinct characters.

Word count: Number of words separated by whitespace.

SHA-256 hash: Unique identifier for the string.

Character frequency map: Object mapping each character to its occurrence count.

Endpoints

POST /strings – Create and analyze a new string.

GET /strings/{string_value} – Retrieve a specific string by value or hash.

GET /strings – Retrieve all strings with optional filters like palindrome, length, word count, or character.

GET /strings/filter-by-natural-language – Retrieve strings by natural language queries like “all single word palindromic strings.”

DELETE /strings/{string_value} – Delete a string from the database.

Getting Started

Clone the repository, install dependencies using npm install, and run the server locally with npm run dev. The API uses MongoDB as the database, so make sure to set the connection URI in your environment variables.

This project demonstrates working with Node.js, Express, MongoDB, and REST API best practices, including validation, error handling, and query filtering.
