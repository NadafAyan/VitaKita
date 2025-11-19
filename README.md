# VITAKITA 🌿

**Your Confidential Digital Mental Health Companion for Higher Education.**

VITAKITA is a Progressive Web Application (PWA) designed to provide students with a safe, stigma-free space for mental wellness. It blends compassionate AI support, evidence-based cognitive behavioral tools, and a caring peer community to help manage stress, anxiety, and everyday academic challenges.

<img width="1902" height="970" alt="image" src="https://github.com/user-attachments/assets/e3460f85-7915-4277-85eb-4a3c4f191c1e" />


## 🚀 Key Features

* **🤖 AI Support Chat:** A 24/7 empathetic AI companion (powered by Google Gemini) trained to provide supportive guidance, coping strategies, and crisis resource redirection.
* **📊 Mental Health Dashboard:** Tracks mood streaks, session history, and provides a visual overview of the user's wellness journey.
* **📝 Self-Diagnostic Tools:** Built-in assessments (PHQ-9/GAD-7 style) to gauge stress, anxiety, and depression levels, mapping results to personalized wellness paths.
* **📚 Wellness Resources:** A curated library of articles, videos, and audio guides covering stress management, sleep hygiene, and resilience.
* **💬 Peer Community:** An anonymous forum for students to share experiences and support one another without fear of judgment.
* **🚨 SOS Emergency System:** One-touch access to crisis hotlines, campus security, and immediate professional help.
* **📅 Counselor Booking:** Interface for browsing and scheduling appointments with campus counselors.

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** [React](https://react.dev/) (v18) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
* **Icons:** [Lucide React](https://lucide.dev/)
* **State Management:** [TanStack Query](https://tanstack.com/query/latest)

**Backend & Services:**
* **Authentication & Database:** [Firebase](https://firebase.google.com/) (Auth + Firestore)
* **AI Model:** [Google Gemini API](https://ai.google.dev/) (via `@google/generative-ai`)

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js (v18 or higher)
* npm or bun

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/NadafAyan/VitaKita
    cd vitakita
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory based on the provided configuration. You will need API keys for Firebase and Google Gemini.

    ```env
    # Google Gemini AI Key
    GEMINI_API_KEY=your_gemini_api_key_here

    # Firebase Configuration
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    # ... add other firebase config vars as needed
    ```

4.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:8080`.

## 📂 Project Structure

```text
src/
├── assets/           # Static images (hero images, logos)
├── components/       # React components
│   ├── ui/           # Reusable shadcn/ui components (Buttons, Cards, Inputs)
│   ├── AuthPage.tsx  # Login and Signup logic
│   ├── ChatPage.tsx  # AI Chat interface logic (Gemini integration)
│   ├── DashboardHome.tsx # Main user dashboard & stats
│   ├── EmergencyButton.tsx # SOS functionality
│   ├── ForumPage.tsx # Community support forum
│   ├── ResourcesPage.tsx # Wellness library
│   └── UserRecord.tsx # Diagnostic tools and user profile
├── hooks/            # Custom React hooks (use-toast, use-mobile)
├── lib/              # Utility functions (cn, clsx)
├── pages/            # Route views (Index, NotFound)
├── firebase.ts       # Firebase initialization and exports
├── main.tsx          # Application entry point
└── App.tsx           # Routing and Provider setup

```

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing a bug, improving the UI, or adding a new feature, your help is appreciated.

### 🛠️ Local Development Setup

1.  **Fork the repository** to your GitHub account.
2.  **Clone your fork** to your local machine:
    ```bash
    git clone https://github.com/NadafAyan/VitaKita
    cd vitakita
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Set up Environment Variables**:
    Create a `.env` file in the root directory and add the following keys (ask a project maintainer for development keys if needed):
    ```env
    VITE_SUPABASE_PROJECT_ID="your_project_id"
    VITE_SUPABASE_PUBLISHABLE_KEY="your_public_key"
    VITE_SUPABASE_URL="your_supabase_url"
    GEMINI_API_KEY="your_gemini_api_key"
    ```
5.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:8080`.

### 📏 Coding Conventions

* **Framework:** We use [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/).
* **Styling:** Use [Tailwind CSS](https://tailwindcss.com/) for styling. Avoid standard CSS files where possible.
* **UI Library:** We use `shadcn/ui` components located in `src/components/ui`.
* **Path Aliases:** Use `@/` to import from the `src` directory (e.g., `import Button from "@/components/ui/button"`).
* **Linting:** Run `npm run lint` before pushing to ensure your code meets our quality standards.

### 🚀 Pull Request Process

1.  Create a new branch for your feature: `git checkout -b feature/amazing-feature`.
2.  Commit your changes with clear messages: `git commit -m "Add amazing feature"`.
3.  Push to your branch: `git push origin feature/amazing-feature`.
4.  Open a Pull Request (PR) against the `main` branch.
5.  Describe your changes and reference any related issues.

## 🛡️ Security & Privacy

At VITAKITA, we prioritize the safety and privacy of our users above all else.

### 🔒 Data Privacy
* **Anonymity:** The peer support forum allows users to post anonymously to protect their identity.
* **Data Storage:** User profiles and records are stored securely using Firebase/Supabase authentication and database rules.
* **Confidentiality:** Chat sessions with the AI are private. We do not sell or share personal mental health data with third-party advertisers.

### 🚨 Crisis Intervention Protocol
Our AI model (powered by Google Gemini) includes a specific system instruction to detect crisis keywords.
* **Safety Triggers:** If a user expresses thoughts of self-harm, suicide, or immediate danger, the AI is programmed to bypass standard conversation flows.
* **Immediate Action:** The system will immediately provide a "Crisis Support Available" alert with direct links to emergency services (911) and the National Crisis Hotline (988).
* **Disclaimer:** VITAKITA is a supportive tool, not a replacement for professional medical advice or therapy.

### 🐛 Reporting Vulnerabilities
If you discover a security vulnerability, please do **not** open a public issue. Instead, please email the team directly at [security@vitakita.app](mailto:nadafayan95@gmail.com) so we can address it immediately.

## 📄 License

Distributed under the MIT License.

```text
MIT License

Copyright (c) 2024 VITAKITA Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

## 🙏 Acknowledgements

VITAKITA was built using these incredible open-source tools and platforms:

* **[React](https://reactjs.org/)** - The library for web and native user interfaces.
* **[Vite](https://vitejs.dev/)** - Next generation frontend tooling.
* **[Tailwind CSS](https://tailwindcss.com/)** - Rapidly build modern websites without ever leaving your HTML.
* **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components built with Radix UI and Tailwind CSS.
* **[Google Gemini](https://ai.google.dev/)** - Powering our empathetic AI chat companion.
* **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service for Auth and Database.
* **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons.
* **[Recharts](https://recharts.org/)** - Redefined chart library built with React and D3.
* **[React Router](https://reactrouter.com/)** - Declarative routing for React web applications.
* **[Lovable](https://lovable.dev/)** - For accelerating the initial UI development.

<div align="center">

💌 Dedication

This project is wholeheartedly dedicated to my best friend,

Nikita

Thank you for being my personal therapist, my constant support system, and the quiet inspiration behind the care put into this work.

Here's to you. 🥂

</div>
