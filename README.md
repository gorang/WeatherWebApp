# Weather Web App  

A simple web application that displays the current weather and weather forecasts using the OpenWeather API.  

## Technologies Used  

* Frontend: React (TypeScript) + libraries  
* Backend: ASP.NET Core  
* Database: PostgreSQL  

##  Prerequisites  

* Microsoft Windows 10/11  
* .NET 8 SDK  
* PostgreSQL 14+ (or latest stable), installed locally  
* Node.js LTS (18+ or 20+ recommended)  
* Web browser (tested with Mozilla Firefox and Microsoft Edge)  

## Developer Tools  

* Microsoft Visual Studio Community 2022 (for backend and frontend) with  
  - "ASP.NET and web development" workload  
  - .NET 8.0 Runtime (Long Term Support)  
* Visual Studio Code (optional, for frontend)  
* pgAdmin 4 (for PostgreSQL setup)  
* Frontend dependencies (installed via npm)  
  * axios  
  * react-router-dom  
  * chart.js  
  * react-chartjs-2  

## Build & Environment Setup  

1. **Database**  
    - Use pgAdmin to create a role and database in the local PostgreSQL instance (replace weatherapp_user, weatherapp_pwd and weatherapp as needed):  
      >CREATE USER weatherapp_user WITH PASSWORD 'weatherapp_pwd';  
      >CREATE DATABASE weatherapp OWNER weatherapp_user;  

2. **Backend**  
    - Copy 'appsettings.Development.example.json' to 'appsettings.Development.json'  
    - In 'appsettings.Development.json', replace the placeholder values ("TODO_..."):  
    - "ConnectionStrings": database name, user name and password  
    - "Jwt": generate your own unique JWT key  
    - "OpenWeather": create an API key at <https://openweathermap.org/>  
    - Apply database migrations:  
      >cd backend/WeatherApp.API  
      >dotnet ef database update  

3. **Frontend**  
    - install dependencies:  
      >cd frontend/weather-app-ui  
      >npm install  
    - Copy '.env.example' to '.env'  
    - Set the backend API base URL: "VITE_API_BASE_URL=https://localhost:7093"  
      (use the URL shown in Swagger or in 'launchSettings.json')  

## Running and Testing  

1. **Backend:** compile and run from Visual Studio  

2. **Frontend:**  
    >cd frontend/weather-app-ui  
    >npm run dev  

## Application Access  

* Backend API (Swagger):  
    <https://localhost:7093/swagger/index.html>  

* Frontend (Vite dev server):  
    <http://localhost:5173/>.  

## Notes  

- The frontend development server runs on port 5173 (Vite default).  
- The backend runs on the port defined in 'launchSettings.json' (default: 7093).  
- The frontend communicates with the backend using the URL configured in '.env'.  
