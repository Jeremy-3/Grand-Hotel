# Grand Hotel

**Grand Hotel** is a responsive and modern React application template designed specifically for hotels and resorts. This template provides a clean, intuitive user interface with components that highlight the hotel's features, such as room listings, events, and general information about the hotel.

## Table of Contents

- [Project Structure](#project-structure)
- [Components](#components)
  - [Home Component](#home-component)
  - [About Component](#about-component)
  - [Rooms Component](#rooms-component)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Project Structure


- **`public/`**: Contains the main HTML file.
- **`src/`**: Contains the React components, the main application file (`App.js`), and styles.
- **`components/`**: Houses individual React components for different pages.
- **`styles/`**: Contains the main CSS file for styling the application.

## Components

### Home Component

- **File**: `src/components/Home.js`
- **Description**: This is the landing page for the Grand Hotel website. It features a welcoming message and highlights of the hotel, with navigation to other sections.

### About Component

- **File**: `src/components/About.js`
- **Description**: Provides detailed information about the hotel, including its history and services. It includes a navigation menu with icons for easy access to other pages.

  ```jsx
  import React from "react";
  import { TiHomeOutline } from "react-icons/ti";
  import { FcAbout } from "react-icons/fc";
  import { RiContactsLine } from "react-icons/ri";
  import { GrLogin } from "react-icons/gr";

  function About() {
    return (
      <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <TiHomeOutline size={30} />
            <h5>HOME</h5>
          </div>
          <div style={{ textAlign: "center" }}>
            <FcAbout size={30} />
            <h5>ABOUT</h5>
          </div>
          <div style={{ textAlign: "center" }}>
            <RiContactsLine size={30} />
            <h5>CONTACT</h5>
          </div>
          <div style={{ textAlign: "center" }}>
            <GrLogin size={30} />
            <h5>LOGIN</h5>
          </div>
        </div>
      </div>
    );
  }

  export default About;
## Rooms Component
- File: src/components/Rooms.js
- Description: Displays the different types of rooms available at the hotel. It may include images, descriptions, and pricing.
- Contacts Component
- File: src/components/Contacts.js
- Description: Provides contact information for the hotel, including phone numbers, email addresses, and a map with the hotel’s location.

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
The app will run in development mode. Open http://localhost:3000 in your browser to view it.

## Dependencies
- The project uses the following major dependencies:

1. React: A JavaScript library for building user interfaces.
2. React Icons: A library of customizable icons for React.
- To install all dependencies, use:

```bash
npm install
```
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
