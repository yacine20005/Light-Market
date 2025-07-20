# 🚀 Orbit Market - Multi-Game Vendor & World State Tracker 🌌

## Your Ultimate Hub for Destiny 2 & Warframe Live Data

----

## 🌟 About the Project

**Orbit Market** is a **cross-platform mobile application** that serves as your ultimate companion for **Destiny 2** and **Warframe**. Built with **Expo (React Native)** for the frontend and **FastAPI (Python)** for the backend, this application provides real-time access to vendor inventories, world states, and essential game information across both games.

### 🎯 **Current Features (Destiny 2):**

- ✅ **Xûr Inventory Tracker** - Fully functional and live!
- 🔧 **All Destiny 2 Vendors** - Coming soon!

### 🌟 **Upcoming Features (Warframe):**

- 🌍 **World State Information** - Real-time Warframe world data
- 📊 **Market Data & More** - Comprehensive Warframe ecosystem tracking

----

## ✨ Current Features

### 🔮 **Destiny 2 - Xûr Tracker (Live!)**

- **Real-time Xur Inventory:** See what Xûr is offering right now
- **Detailed Item Information:** View names, icons, and base stats for all items
- **"Roll" Decryption:** Understand the specific perks and stats on weapons and armor
- **Cost Breakdown:** Easily see the materials and currency required for each purchase
- **Automatic Data Refresh:** Xur's inventory updates automatically with his weekly arrival

### 🚀 **Coming Soon**

- **All Destiny 2 Vendors:** Ada-1, Banshee-44, Saint-14, and more!
- **Warframe World State:** Invasions, Alerts, Sorties, Nightwave, and current events
- **Cross-Game Dashboard:** Switch seamlessly between Destiny 2 and Warframe data

----

## 🛠️ Technologies Used

### Frontend (Mobile Application)

- **Expo / React Native:** For cross-platform mobile development (iOS and Android).
- **React Navigation:** To manage intuitive app navigation.

### Backend (API)

- **FastAPI (Python):** A modern, high-performance web framework for building the API
- **Pydantic:** Used for powerful data validation and modeling within FastAPI
- **SQLite:** Local database for storing Destiny 2 Manifest data
- **External APIs Integration:**
  - **Bungie.net API:** For Destiny 2 vendor and game data
  - **Warframe WorldState API:** For real-time Warframe information

----

## 💡 Project Vision & Goals

This project represents an ambitious expansion from a single-game utility to a **comprehensive multi-game information hub**. My objectives include:

1. **Multi-Game Architecture:** Design a scalable backend capable of handling multiple game APIs and data sources
2. **Real-Time Data Processing:** Implement efficient systems for live data updates from both Destiny 2 and Warframe
3. **Advanced Mobile Development:** Master complex state management across different game contexts and data types
4. **API Design Excellence:** Create robust, well-documented APIs that can serve multiple frontend applications
5. **Performance Optimization:** Handle large datasets (Destiny 2 Manifest) while maintaining fast response times
6. **Portfolio Showcase:** Demonstrate full-stack capabilities and multi-platform integration skills

### 🎮 **Game Coverage Strategy**

**Phase 1 (Current):** Destiny 2 Xûr - ✅ **LIVE**
**Phase 2 (In Progress):** All Destiny 2 Vendors
**Phase 3 (Planned):** Warframe World State Integration
**Phase 4 (Future):** Enhanced Features & Additional Games

----

## 🏗️ Architecture Overview

The application uses a **multi-game client-server architecture** designed for scalability and performance:

```text
+-------------------+           +-----------------------+           +-------------------------+
|                   |           |                       |           |                         |
|   Mobile App      |           |     Backend API       |           |     External APIs       |
|   (Expo React     | <-------> |     (FastAPI)         | <-------> |                         |
|    Native)        |           |                       |           |  • Bungie.net API      |
|                   |           |                       |           |  • Warframe API         |
+-------------------+           +-----------------------+           +-------------------------+
        |                                   |                                   |
        |  • Cross-game UI                  |  • Multi-game routing             |  • Real-time data
        |  • State management               |  • Data processing                |  • Vendor inventories
        |  • Real-time updates              |  • Manifest management            |  • World states
        |                                   |                                   |
        |                                   +-----------------------+
        |                                               |
        |                                   +-----------------------+
        |                                   |  Local Databases       |
        +-----------------------------------+  • Destiny 2 Manifest  |
                                            |  • Cached Game Data    |
                                            +-----------------------+
```

### 🔧 **Key Architectural Decisions:**

- **Centralized Data Processing:** Heavy manifest operations handled server-side
- **Optimized Mobile Performance:** Lightweight client with efficient data consumption
- **Modular Game Integration:** Easy addition of new games and APIs
- **Real-Time Sync:** Live updates for time-sensitive vendor rotations

----

## 🔮 Roadmap & Future Enhancements

### 🎯 **Immediate Goals**

- **Complete Destiny 2 Vendor Coverage:** Ada-1, Banshee-44, Saint-14, Trials, Iron Banner
- **Warframe Integration:** World State API implementation
- **Enhanced UI/UX:** Game-specific themes and improved navigation

### 🚀 **Long-term Vision**

- **Additional Games:** Potential expansion to other live-service games
- **Community Features:** User favorites, notifications, sharing
- **Advanced Analytics:** Vendor rotation patterns, price tracking
- **Cloud Deployment:** Global accessibility and scalability 

----

## 🤝 Contribution

Contributions are always welcome\! If you have ideas, improvements, or encounter any issues, please feel free to open an issue or submit a pull request.

----

## 📧 Contact

For any questions or further information, please feel free to reach out via my GitHub profile.

----
