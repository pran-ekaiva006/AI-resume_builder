# AI-Resume-Builder

![README](/client/public/banner.png)


<h1 align="center">AI Resume Builder</h1>

<p align="center">
  <a href="https://github.com/pran-ekaiva006/AI-resume_builder">
    <img src="https://img.shields.io/badge/GitHub-Repo-blue?logo=github" alt="GitHub Repo">
  </a>
  <a href="https://capable-churros-e51954.netlify.app/">
    <img src="https://img.shields.io/badge/Live-Demo-green?logo=vercel" alt="Live Demo">
  </a>
  <a href="https://github.com/pran-ekaiva006/AI-resume_builder/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
  </a>
</p>
---

### 📋 Table of Contents

- [🎯 About The Project](#about-the-project)
- [✨ Features](#features)
- [🛠️ Tech Stack](#tech-stack)
- [🎪 Demo](#demo)
- [🔧 Installation](#installation)
- [📂 Folder Structure](#📂-folder-structure)
- [📜 Licence](#licence)



---

### **About The Project**

AI Resume Builder is a web application that generates professional resumes using AI. It allows users to create resumes dynamically with customizable sections like experience, education, skills, and projects.  

The project aims to simplify resume creation and make the process intelligent and interactive.

---

### **Features**
- Generate professional resumes with AI assistance.
- Store full resume data with nested sections.
- User-friendly React frontend.
- Secure backend with Node.js, Express, and MongoDB.
- Download resumes in PDF format.
- Responsive and mobile-friendly design.
---

## **Tech Stack**

<p>
  <img alt="React" src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB"/>
  <img alt="TailwindCSS" src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white"/>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white"/>
  <img alt="Express.js" src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white"/>
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white"/>
  <img alt="Figma" src="https://img.shields.io/badge/Figma-F24E1E?logo=figma&logoColor=white"/>
  <img alt="VS Code" src="https://img.shields.io/badge/VS%20Code-007ACC?logo=visual-studio-code&logoColor=white"/>
</p>

---

## **Demo**

Check out the live project here: [AI Resume Builder Live Demo](https://capable-churros-e51954.netlify.app/)  

GitHub repository: [AI Resume Builder GitHub](https://github.com/pran-ekaiva006/AI-resume_builder)

---

## **Installation**

1. Clone the repo:

```bash
git clone https://github.com/pran-ekaiva006/AI-resume_builder.git
```
### Install dependencies:
# Frontend
```bash
cd AI-resume_builder/client
npm install
```

# Backend
```bash
cd ../server
npm install
```

Run the application:

# Frontend
```bash
cd client
npm start
```

# Backend
```bash
cd ../server
npm run start
```

### 📂 Folder Structure
```bash
AI-resume_builder-main/
├── .gitignore
├── LICENSE
├── README.md
├── client
│   ├── .eslintrc.cjs
│   ├── components.json
│   ├── index.html
│   ├── jsconfig.json
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public
│   │   ├── cv.png
│   │   ├── logo.png
│   │   └── vite.png
│   ├── service
│   │   ├── AIModal.jsx
│   │   └── GlobalApi.js
│   └── src
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── api
│       │   └── ResumeService.js
│       ├── assets
│       │   ├── banner.png
│       │   ├── react.svg
│       │   └── home
│       │       └── index.jsx
│       ├── auth
│       │   └── sign-in
│       │       └── index.jsx
│       ├── components
│       │   ├── custom
│       │   │   ├── Footer.jsx
│       │   │   └── Header.jsx
│       │   └── ui
│       │       ├── alert-dialog.jsx
│       │       ├── button.jsx
│       │       ├── dialog.jsx
│       │       ├── dropdown-menu.jsx
│       │       ├── input.jsx
│       │       ├── popover.jsx
│       │       ├── sonner.jsx
│       │       └── textarea.jsx
│       ├── context
│       │   └── ResumeInfoContext.jsx
│       └── dashboard
│           ├── index.jsx
│           ├── components
│           │   ├── AddResume.jsx
│           │   ├── ResumeCardItem.jsx
│           ├── data
│           │   └── dummy.jsx
│           └── resume
│               ├── [resumeId]
│               │   └── edit
│               │       └── index.jsx
│               └── components
│                   ├── FormSection.jsx
│                   ├── ResumePreview.jsx
│                   └── RichTextEditor.jsx
└── server
    ├── controllers
    ├── middlewares
    ├── models
    ├── routes
    └── utils
```
### Licence
This Project is Licensed under the MIT Licence , see [LICENCE](./LICENSE) for details
