
# PathFinder

## Introduction

This project is a Java Spring application that integrates with Google Map API. It features a React frontend utilizing Chakra UI for a responsive and modern user interface. This application is designed to provide mapping and location-based solutions with an interactive and user-friendly web interface.

## Prerequisites

- Java JDK 11 or higher
- Maven for Java Spring backend
- Node.js and npm for React frontend
- Google Cloud account with access to the Google Map API

## Installation

### Backend

1. Clone the repository:
   ```sh
   git clone [repository-url]
   ```
2. Navigate to the backend directory:
   ```sh
   cd backend
   ```
3. Install the Maven dependencies:
   ```sh
   mvn install
   ```

### Frontend

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install the npm dependencies:
   ```sh
   npm install
   ```

## Configuration

1. Set up the Google Map API key in the `application.properties` file in the backend directory.
2. Configure any other environment-specific settings as needed.

## Running the Application

### Backend

- Start the Java Spring application:
  ```sh
  mvn spring-boot:run
  ```

### Frontend

- Start the React application:
  ```sh
  npm start
  ```

## Usage

- Access the web application at `http://localhost:3000`.
- Use the interface to interact with map features and location-based services provided by Google Map API.
