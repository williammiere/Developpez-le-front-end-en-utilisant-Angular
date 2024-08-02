# Olympic Dashboard

## Overview

**Olympic Dashboard** is a web application that provides detailed insights into Olympic Games data. It features interactive visualizations that display the distribution of medals by country and track the performance of countries over time. Users can explore detailed statistics, view country-specific participation data, and analyze historical trends across various Olympic events.

## Features

- **Dashboard View:** Displays the distribution of medals using a pie chart.
- **Country Details Page:** Shows a line chart with the number of medals won by a selected country over time.
- **Responsive Design:** Ensures a consistent experience across different devices.
- **Interactive Charts:** Hover to see detailed medal counts and click to navigate to country-specific pages.

## Technology Stack

- **Frontend:** Angular, TypeScript
- **Charts:** Ngx-Charts
- **Backend:** Mock JSON data (for demonstration purposes)

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine.
- Angular CLI installed globally via npm: `npm install -g @angular/cli`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/olympic-dashboard.git
Navigate to the project directory:

bash
Copier le code
cd olympic-dashboard
Install dependencies:

bash
Copier le code
npm install
Running the App
Start the development server:

bash
Copier le code
ng serve
Open your browser and navigate to:

arduino
Copier le code
http://localhost:4200
The app should now be running locally on your machine.

Usage
Dashboard: View the overall medal distribution by country. Hover over the pie chart segments to see detailed counts.
Country Details: Click on a country in the dashboard to navigate to its detailed page, where you can see its performance over time via a line chart.
Testing
Run unit tests:

bash
Copier le code
ng test
Run end-to-end tests:

bash
Copier le code
ng e2e
Deployment
To build the project for production, use:

bash
Copier le code
ng build --prod
The output will be in the dist/ directory. You can deploy this to any web server.

Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that all new code includes relevant tests.

Project Management
For more details on features, issues, and project management, visit the Project Board.

Credits
Angular: A platform and framework for building single-page client applications using HTML and TypeScript. Angular
Ngx-Charts: A charting library for Angular based on D3.js. Ngx-Charts
RxJS: A library for reactive programming using observables. RxJS
Angular CLI: A command-line interface for Angular applications. Angular CLI
License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
For any questions or feedback, please reach out to aflouat@gmail.com.

markdown
Copier le code

### Instructions for VS Code and GitHub:

1. **Save the README file:**
   - Ensure that the README is saved as `README.md` in the root directory of your project.

2. **Stage and Commit Changes:**
   - In VS Code, open the terminal and stage your changes:
     ```bash
     git add README.md
     ```
   - Commit your changes with a meaningful message:
     ```bash
     git commit -m "Update README with project overview, setup instructions, project board link, and credits"
     ```

3. **Push the Changes:**
   - Push the changes to your branch:
     ```bash
     git push origin your-branch-name
     ```

This should help make your repository more informative and provide proper attribution to the third-party libraries you're using.