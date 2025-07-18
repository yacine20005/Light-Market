# 🚀 Destiny 2 Xur Inventory Checker (Expo + FastAPI) 🌌

----

## 🌟 About the Project

This project is a **mobile application** designed to be a **"Xur Inventory Checker"** for the popular game **Destiny 2**. Built with **Expo (React Native)** for the frontend and **FastAPI (Python)** for the backend, its main purpose is to give Destiny 2 Guardians a quick and intuitive way to see what **Xûr** is selling.

A central feature of this application is its ability to **decode and clearly display the "rolls" (random perks)** on weapons and armor. This means no more needing to log into the game or check external websites just to find out if Xur has that perfect gear piece!

----

## ✨ Core Features

* **Real-time Xur Inventory:** See what Xûr is offering right now.
* **Detailed Item Information:** View names, icons, and base stats for all items.
* **"Roll" Decryption:** Understand the specific perks and stats on weapons and armor, a crucial aspect for optimal gameplay.
* **Cost Breakdown:** Easily see the materials and currency required for each purchase.
* **Automatic Data Refresh:** Xur's inventory is automatically updated following his weekly arrival.

----

## 🛠️ Technologies Used

### Frontend (Mobile Application)

* **Expo / React Native:** For cross-platform mobile development (iOS and Android).
* **React Navigation:** To manage intuitive app navigation.

### Backend (API)

* **FastAPI (Python):** A modern, high-performance web framework for building the API.
* **Pydantic:** Used for powerful data validation and modeling within FastAPI.
* **`requests` (Python):** For secure and reliable external API calls (e.g., to Bungie.net).

----

## 💡 My Project Goals & Ambition

This project is more than just a utility for Destiny 2; it's a significant milestone in my personal learning journey and my pursuit of an apprenticeship/alternance. My key objectives for this endeavor are:

1. **FastAPI Proficiency:** To gain hands-on expertise with FastAPI, focusing on its performance, automatic documentation, and best practices for building scalable APIs.
2. **Practical Mobile Development:** To deepen my skills in mobile application development using Expo and React Native, tackling real-world challenges in cross-platform UI and state management.
3. **Complex Data Handling:** To master the process of downloading, storing, and querying the **Bungie Manifest API** – a large and intricate SQLite database. This involves transforming raw game data into meaningful, user-friendly information.
4. **Client-Server Architecture:** To design and implement a robust client-server architecture, ensuring seamless communication between the mobile app and the dedicated backend.
5. **Portfolio Enhancement:** To create a tangible, functional, and highly practical project that showcases my technical abilities and problem-solving skills to prospective employers as I seek an apprenticeship opportunity.

----

## 🏗️ Architecture Overview

The application adopts a standard client-server architecture to ensure efficiency and a smooth user experience:

```text
+-------------------+           +-----------------------+           +-----------------------+
|                   |           |                       |           |                       |
|   Mobile App      |           |        Backend        |           |        Bungie API     |
|   (Expo)          | <-------> |       (FastAPI)       | <-------> |       (Public)        |
|                   |           |                       |           |                       |
+-------------------+           +-----------------------+           +-----------------------+
        |                                   |                                   |
        |  - Displays User Interface        |  - Manages Manifest updates       |  - Provides Vendor/Game Data
        |  - Requests Data from Backend     |  - Queries and decodes Manifest    |
        |                                   |  - Serves formatted data to app   |
        |                                   +-----------------------+
        |                                               |
        |                                               |
        |                                               |
        +-----------------------------------------------+
                                |
                                |
                +---------------------------------+
                |   Local Manifest Database       |
                |   (SQLite) - On Server Side     |
                +---------------------------------+
```

The **FastAPI backend** is central to this design. It acts as both a proxy and a decoder for the Destiny 2 Manifest. This approach means the Expo mobile application doesn't need to handle the heavy task of downloading and querying the large Manifest file, which significantly optimizes the app's performance and data usage for the end-user.

----

## 🔮 Future Enhancements

* **Advanced Manifest Management:** Implementing a more sophisticated system for robust, automated Manifest updates on the backend.
* **Enhanced "Roll" Details:** Further refining the display of perks and stats for ultimate clarity and user benefit.
* **UI/UX Refinement:** Continuous improvement of the application's design for an even more intuitive and visually appealing experience.
* **Backend Deployment:** Deploying the FastAPI backend to a cloud service to make the application globally accessible.

----

## 🤝 Contribution

Contributions are always welcome\! If you have ideas, improvements, or encounter any issues, please feel free to open an issue or submit a pull request.

----

## 📧 Contact

For any questions or further information, please feel free to reach out via my GitHub profile.

----
