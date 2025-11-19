# Hero Dispatch: Crisis Command

**Hero Dispatch: Crisis Command** is a tactical hero management simulation where you act as the commander of a superhero response unit. Your goal is to dispatch the right heroes to procedurally generated crises across a 3D city map, manage their stamina and trauma, and ensure the safety of the city.

## Features

*   **Tactical Map Interface**: A 3D wireframe city map with real-time squad movement and tracking.
*   **Hero Roster Management**: Manage a diverse team of heroes (e.g., Neuron, Viper, Titan), each with unique stats, abilities, and backstories.
*   **Procedural Missions**: Crisis events spawn dynamically with varying difficulty and stat requirements (Intelligence, Agility, etc.).
*   **Mission Resolution Minigame**: A "Spin the Wheel" style minigame to determine mission outcomes based on your squad's success probability.
*   **Active Task Visualization**: View real-time progress and stat comparisons for active missions.
*   **Reputation System**: Success builds city trust; failure leads to chaos.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   **Node.js** (v18 or higher recommended)
*   **npm** (usually comes with Node.js)

## Installation

1.  **Clone the repository** (or download the source code):
    ```bash
    git clone <repository-url>
    cd Dispatch-clone
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Environment Setup

This project uses the **Google Gemini API** to generate unique, creative mission descriptions. You will need an API key to enable this feature.

1.  Create a file named `.env` in the root directory of the project.
2.  Add your Google Gemini API key to the file:

    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

    > **Note**: If no API key is provided, the game will use a set of fallback missions, so you can still play without one!

## Running the Application

To start the development server:

```bash
npm run dev
```

*   The application will typically run at `http://localhost:5173`.
*   Open your web browser and navigate to that URL to start playing.

## How to Play

1.  **Monitor the Map**: Watch for "Sector Alerts" (pins) appearing on the map.
2.  **Analyze the Threat**: Click on a mission pin to see its requirements (e.g., "High Agility required").
3.  **Dispatch Squad**: Select one or more heroes from your roster who meet the requirements and click "Dispatch".
    *   *Tip: Flying heroes travel faster!*
4.  **Wait for Arrival**: Your squad will travel to the location. Once there, the engagement begins.
5.  **Resolution**: When the mission timer ends, a Resolution Modal will appear. Watch the outcome!
6.  **Manage Heroes**: Heroes gain "Trauma" from failures and need time to recover. Rotate your squad wisely.

## Technologies Used

*   **React** (Frontend Framework)
*   **TypeScript** (Type Safety)
*   **Vite** (Build Tool)
*   **Tailwind CSS** (Styling)
*   **Lucide React** (Icons)
*   **Google Gemini API** (AI Content Generation)
