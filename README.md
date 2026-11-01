# Arun Kumar Aggarwal ΓÇô Portfolio Website

A personal portfolio website for **Arun Kumar Aggarwal**, Technical Lead (Manager) ΓÇô Control Software, built for deployment on GitHub Pages.

**Live URL:** [https://arun.github.io/](https://arun.github.io/)

---

## 1. Project Overview & Professional Identity

This portfolio represents ~8 years of progressive experience in industrial automation, PLC software architecture, robotic workcell integration, deterministic fieldbus networks, and technical team leadership.

- **Name:** Arun Kumar Aggarwal
- **Role:** Technical Lead (Manager) ΓÇô Control Software
- **Current Organization:** VVDN Technologies (Leading a team of 8 control software engineers)
- **Primary Disciplines:** Beckhoff TwinCAT 2/3, Siemens TIA Portal, Mitsubishi GX Works, Industrial Robotics, EtherCAT, PROFINET, Motion Control & Servo Systems, AOI Machine Vision, DFM, FMEA.

---

## 2. Creative & Technical Highlights

- **Industrial Control System Aesthetic:** A high-contrast industrial obsidian theme (`#07090e`) with electric cyan bus telemetry (`#00f0ff`), safety amber alerts (`#f59e0b`), and PLC run green (`#10b981`), alongside an engineering cleanroom light theme.
- **Interactive SCADA & Motion Telemetry Simulator:** Real-time canvas waveform demonstrating deterministic scan cycles (~1.2 ms), live 4-axis robotic kinematic coordinate readouts $(X, Y, Z, \theta)$, and interactive cycle controls (Start, Pause, Trigger AOI, Emergency Stop).
- **Interactive System Architecture Blueprints:** Vector diagrams with animated signal flows representing:
  1. *Automated DUT Handling & Validation Process* (World's Largest Mobile Mfg Client)
  2. *Automated PCB Connector Placement & Verification* (HP)
  3. *Automated Rotary Smart Meter Assembly SPM* (IntelliSmart 52-Station Machine)
- **Interactive Protocol Inspector:** Deep-dive modal exploring EtherCAT, PROFINET, Modbus TCP/IP, and Beckhoff ADS topologies and industrial deployment notes.
- **Integrated Resume / CV Hub:** Dedicated section featuring the uploaded official PDF resume with in-browser preview, fullscreen modal, and one-click direct download.
- **Zero-Dependency Native Architecture:** 100% pure semantic HTML5, modular CSS3 tokens, and vanilla ES6+ JavaScriptΓÇöensuring sub-second load times, SEO indexability, and compatibility with GitHub Pages.

---

## 3. Repository Structure

```text
arun.github.io/
Γöé
Γö£ΓöÇΓöÇ index.html                   # Main semantic entrypoint and SEO metadata
Γö£ΓöÇΓöÇ favicon.svg                  # High-tech PLC CPU vector favicon
Γö£ΓöÇΓöÇ README.md                    # Project documentation and update manual
Γö£ΓöÇΓöÇ LICENSE                      # MIT License
Γöé
Γö£ΓöÇΓöÇ assets/
Γöé   Γö£ΓöÇΓöÇ documents/
Γöé   Γöé   ΓööΓöÇΓöÇ Arun_Kumar_Aggarwal_Resume.pdf  # Source-of-truth PDF resume
Γöé   Γö£ΓöÇΓöÇ icons/                   # Vector iconography and preview assets
Γöé   Γö£ΓöÇΓöÇ images/                  # Project illustrations and diagrams
Γöé   ΓööΓöÇΓöÇ animations/              # Lottie / SVG asset definitions
Γöé
Γö£ΓöÇΓöÇ css/
Γöé   Γö£ΓöÇΓöÇ tokens.css               # Design tokens (dark & light themes, colors, typography)
Γöé   Γö£ΓöÇΓöÇ main.css                 # Layout shell, atmosphere, navigation, footer, toasts
Γöé   Γö£ΓöÇΓöÇ components.css           # SCADA simulator, project cards, skills rack, timeline
Γöé   ΓööΓöÇΓöÇ responsive.css           # Breakpoints for tablet, mobile, and ultra-wide screens
Γöé
Γö£ΓöÇΓöÇ js/
Γöé   Γö£ΓöÇΓöÇ telemetry.js             # Interactive SCADA/PLC simulation engine & kinematics
Γöé   Γö£ΓöÇΓöÇ skills.js                # Category filter, search, & protocol inspector modal
Γöé   Γö£ΓöÇΓöÇ projects.js              # Project architecture hover flows & blueprint modals
Γöé   ΓööΓöÇΓöÇ main.js                  # Theme switcher, scroll spy, mobile drawer, IST clock
Γöé
ΓööΓöÇΓöÇ .github/
    ΓööΓöÇΓöÇ workflows/
        ΓööΓöÇΓöÇ deploy.yml           # Automated GitHub Pages CI/CD workflow
```

---

## 4. How to Update Content

### A. Updating the Resume PDF
1. Save your new resume as `Arun_Kumar_Aggarwal_Resume.pdf`.
2. Replace the file at:
   ```text
   assets/documents/Arun_Kumar_Aggarwal_Resume.pdf
   ```
3. Commit and push to GitHub:
   ```bash
   git add assets/documents/Arun_Kumar_Aggarwal_Resume.pdf
   git commit -m "docs: update professional resume PDF"
   git push origin main
   ```

### B. Adding or Modifying Projects
Open `index.html` and locate the `<section id="projects">`. Each project is housed within an `<article class="project-card">`. Duplicate or modify the markup and update tags, highlights, and architecture SVGs.

### C. Updating Skills & Certifications
In `index.html`, locate `<div class="skills-grid">`. You can add new skill cards by specifying the matching `data-category`:
- `platforms` (PLC & Automation Platforms)
- `languages` (IEC 61131-3 Languages & Scripting)
- `protocols` (Communication Protocols & Peripherals)
- `robotics` (Robotics, Motion & Vision)
- `methodologies` (Quality, SDLC & Lean)

---

## 5. GitHub Pages Deployment Instructions

### Automatic Deployment (Recommended):
1. Create a repository on GitHub named `arun.github.io` (or your preferred username repository).
2. Push this codebase to the repository:
   ```bash
   git remote add origin https://github.com/<your-username>/arun.github.io.git
   git branch -M main
   git push -u origin main
   ```
3. In GitHub, navigate to **Settings** > **Pages**.
4. Under **Source**, select **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then click **Save**.
6. Within 1ΓÇô2 minutes, your website will be live at `https://<your-username>.github.io/`!

---

## 6. License

Distributed under the MIT License. See `LICENSE` for more information.
