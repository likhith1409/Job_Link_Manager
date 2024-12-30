# Job Link Manager 🚀

Welcome to the **Job Link Manager**! This project consists of two main components:
1. **Browser Extension**: Save job links, add skills, and send the right opportunities to the right people based on their skills.
2. **Backend Server (Node.js)**: Handles the logic for matching job links to users and sending them.

---

## 🌟 **Features**
- **Save Job Links**: Add job links along with the required skills.
- **Add User Details**: Store users’ names, contact info, and skills.
- **Skill-Based Matching**: Automatically match job links to users based on their skills.
- **One-Click Sharing**: Hit the “Send” button to share the right job links directly.

---

## 🛠️ **How It Works**
1. **Save Job Links**: Add job links and the skills required for the job.
2. **Add Users**: Input users’ details (name, contact info, and skills).
3. **Match & Send**: Click the “Send” button, and the system will share the appropriate job links with users based on their skills.

---

## 🚀 **Getting Started**
### Prerequisites
- A modern browser (Chrome, Firefox, Edge, etc.)
- Node.js installed on your machine
- Basic knowledge of browser extensions and Node.js

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/likhith1409/Job_Link_Manager
   ```
   ```
   cd Job_Link_Manager
   ```

## Browser Extension
- Open your browser’s extension management page:
- For Chrome: Go to chrome://extensions/
- Enable Developer Mode (usually a toggle in the top-right corner).
- Click Load Unpacked (or Load Temporary Add-on for Firefox) and select the extension folder from the cloned repository.

## Backend Server
- Navigate to the backend folder:
  ```
  cd backend
  ```
- Install dependencies:
  ```
  npm install
  ```
- Start the server:
  ```
  npm start
  ```
- The server will run on http://localhost:3000

## Project Structure

```
job_link_manager/
├── backend/               # Backend server (Node.js)
│   ├── server.js          # Main server file
│   ├── users.json         # User data storage
│   └── package.json       # Node.js dependencies
├── extension/             # Browser extension files
│   ├── background.js      # Background script for extension logic
│   ├── icon48.png         # Extension icon (48x48)
│   ├── icon128.png        # Extension icon (128x128)
│   ├── logo.png           # Logo for the extension
│   ├── manifest.json      # Extension metadata
│   ├── popup.css          # Styles for the popup
│   ├── popup.html         # HTML for the popup
│   └── popup.js           # JavaScript for the popup
└── README.md              # Project documentation
```
## Screenshots
![rzkhRQ58XY](https://github.com/user-attachments/assets/287fc362-92ba-4ad8-abcc-d5f559d90de3)
![msedge_ql9jzHhygF](https://github.com/user-attachments/assets/95061715-5554-484d-97d2-2f194ca93643)

## 🤝 Contributing
Contributions are welcome!

