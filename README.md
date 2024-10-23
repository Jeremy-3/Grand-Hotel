# Grand Hotel

Welcome to the **Grand Hotel** frontend repository! This is the frontend application of the Grand Hotel project, built using **React** and **Tailwind CSS** to provide users with a smooth experience for making reservations and accessing hotel services.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)

- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Overview
- The Grand Hotel frontend provides an interactive user interface to explore and book rooms in the hotel. It allows users to register, log in, view available rooms, and make reservations.



## Project Structure


- **`public/`**: Contains the main HTML file.
- **`src/`**: Contains the React components, the main application file (`App.js`), and styles.
- **`components/`**: Houses individual React components for different pages.
- **`styles/`**: Contains the main CSS file for styling the application.



## Installation
To run this project locally, follow these steps:

**Clone the repository:**

```bash

git clone git@github.com:Jeremy-3/Phase-2-Project.git
```
```bash
`cd grand-hotel`.
```

**Install dependencies:**

```bash
npm install
```

**Start the development server:**

```bash
npm run dev
```

## Technologies Used

```
1. React 
3. Tailwind CSS
4. React Router
5. Fetch API
6. Proxy
```

## API Integration
- The frontend interacts with a Flask-based backend to fetch and manipulate hotel data. Below are the key endpoints:

- Login:`/api/login`
- Register: `/api/register`
- Rooms:`/api/rooms`
- Reservations:`/api/reservations`
- Guests: `/api/guests`

- The Fetch API is used to make GET, POST, PUT, and DELETE requests. Make sure the backend server URL matches the configured proxy in `viteconfig.js` .

### Contributing
Contributions are welcome! Please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bugfix.
- Commit your changes with clear messages.
- Push your changes to your forked repository.
- Open a pull request to the main repository.

## Authors

- ***JEREMY GITAU***
- ***TONY MAINA***
- ***KEITH MWAI***
- ***ELVIS GITAU***
- ***FRANKLIN NDEGWA***
