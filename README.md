# Impact Log - Professional Career Growth Tracker

### [🚀 Launch Application (Member Access)](https://impact-log-skm.web.app)

**Impact Log** is a premium, data-driven platform designed for high-performing professionals to track, visualize, and leverage their career achievements. Unlike standard note-taking apps, Impact Log focuses on quantifiable "wins" and structured weekly reflections to accelerate career progression.

---

## 🌟 Key Features

*   **Quantifiable Impact Tracking**: Log achievements with specific metrics (Revenue, Efficiency, Leadership).
*   **Weekly Reflections**: Structured workflows to review progress and plan the week ahead.
*   **Secure Cloud Storage**: Enterprise-grade data security powered by Google Firestore.
*   **Data Portability**: Full ownership of your career data with instant JSON export capabilities.
*   **Modern Aesthetics**: A distraction-free, "Light Mode" interface designed for focus and clarity.

---

## 🏗️ Technical Architecture (Reference Overview)

This repository serves as a **technical reference implementation** for modern, serverless web architecture. It demonstrates the integration of high-performance frontend technologies with secure backend-as-a-service infrastructure.

### Technology Stack
*   **Frontend Core**: React 18, TypeScript, Vite
*   **Design System**: Tailwind CSS, Lucide Icons, Custom "Glass-morphism" & Flat Design tokens.
*   **Backend & Security**: Google Firebase (Auth, Firestore, Hosting)
*   **CI/CD**: GitHub Actions for automated, secure deployments.

### Security Model
The application employs a **Zero-Trust** security model:
1.  **Authentication**: Federated Identity (Google OAuth) ensures robust access control.
2.  **Authorization**: Custom Firestore Security Rules (`row-level security`) ensure users can strictly access *only* their own data.
3.  **Client-Side Encryption**: Environment variables and API keys are strictly managed via GitHub Secrets and build-time injection.

---

## 🔐 Access & Usage

### For Users
The **Impact Log** platform is currently accepting new members.
👉 **[Click here to Sign In / Sign Up](https://impact-log-skm.web.app)**

### For Developers
This codebase is made public for **portfolio demonstration and architectural reference only**.

*   **Proprietary License**: The source code, design patterns, and specific implementation details are proprietary.
*   **No unauthorized redistribution**: You may not clone, host, or sell a derivative version of this application without explicit written permission.
*   **Enterprise / White-label**: If you are interested in deploying a private instance of Impact Log for your organization, please contact the repository owner for licensing execution and deployment guides.

---

**© 2026 Shamanth. All Rights Reserved.**
