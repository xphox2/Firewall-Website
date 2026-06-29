# Firewall-Mon Marketing Website

The official, multilingual marketing website and documentation hub for **Firewall-Mon**—a vendor-agnostic firewall monitoring system built for speed, security audits, and complex topology traversal.

This repository hosts the front-end codebase for the marketing website, complete with interactive simulators, documentation, and a robust localization system.

---

## 🚀 Features

* **Modern, Sleek UI**: High-performance, fully responsive dark-themed landing page.
* **Interactive Live Dashboard Simulator**: A real-time mockup console that simulates SNMP polling logs, interface bandwidth stats, and VPN states across 6 major firewall vendors (Fortinet, Palo Alto, SonicWall, pfSense, OPNsense, Firewalla).
* **Config Drift Viewer**: Interactive configuration change diff parser with risk classification.
* **sFlow Spike Triage Simulator**: Live flow capture simulator demonstrating threat intelligence alerting.
* **10 Supported Locales**: Fully internationalized (i18n) landing pages supporting:
  * English (EN)
  * Deutsch (DE)
  * Español (ES)
  * Français (FR)
  * Italiano (IT)
  * Português (PT)
  * Русский (RU)
  * 日本語 (JA)
  * 한국어 (KO)
  * 中文 (ZH)
* **Automated Locale Validation**: Build-time scripts to ensure key-parity across all translation JSON files.

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have one of the following container runtimes installed:
* [Docker](https://docs.docker.com/get-docker/) with Compose v2
* [Podman](https://podman.io/) (version 4.7+)
* Node.js 18+ (only required if you want to run localization validation tests locally)

---

## 💻 Local Development

A `Makefile` is provided for convenient container execution and validation tasks.

### Start Development Server
Run the site in development mode with bind-mounted source files. Live edits to your HTML, CSS, or JS will reflect immediately without rebuilding:
```bash
make dev
```
The development server will be exposed on **`http://localhost:3000`**.

### Build & Run Production Image
Simulate the production environment using the immutable Nginx Alpine container:
```bash
make up
```
The production server will be exposed on **`http://localhost:8080`**.

### Stop Containers
To stop and clean up running Docker/Podman container instances:
```bash
make down
```

### Show Logs
Tail logs from the active development container:
```bash
make dev-logs
```

---

## 🌐 Localization & i18n

Translation mappings are located under the `locales/` directory. If you modify page content or add a new feature tag, you must update the translation files.

### Directory Structure
```text
├── locales/
│   ├── de.json       # German
│   ├── en.json       # English (Reference)
│   ├── es.json       # Spanish
│   ├── fr.json       # French
│   ├── it.json       # Italian
│   ├── ja.json       # Japanese
│   ├── ko.json       # Korean
│   ├── pt.json       # Portuguese
│   ├── ru.json       # Russian
│   └── zh.json       # Chinese
```

### Adding New Translation Keys
1. Add your key and content inside `locales/en.json` (the base dictionary).
2. Replicate the key path and add translated values across all other JSON files (`de.json`, `es.json`, etc.).
3. Add the `data-i18n="your_key_path"` attribute to the corresponding HTML element in `index.html` and `docs.html`. If the translation contains nested HTML elements like `<code>` or `<a>` tags, add `data-i18n-html="true"`.

---

## 🧪 Testing & Validation

To ensure no broken translation tags or malformed JSON files are pushed to production, you can run the localized key-parity validation suite:

```bash
make test
```

This command runs:
1. **JSON Validation**: Checks that all translation `.json` files are syntactically valid JSON.
2. **Key Parity Check**: Verifies that every translation file has the exact same count and names of keys as the reference `en.json` file.

---

## 📁 Repository Structure

```text
├── css/
│   └── style.css            # Core stylesheets and responsive layout
├── js/
│   ├── i18n.js              # Localization controller and parser
│   └── main.js              # Interactive simulator and mobile drawer controller
├── locales/                 # i18n JSON files
├── scripts/
│   └── check-i18n.js        # Node.js translation keys parity checker
├── Dockerfile               # Production Nginx Docker configuration
├── docker-compose.yml       # Dev and Prod compose specifications
├── index.html               # Marketing landing page
├── docs.html                # Documentation page
├── Makefile                 # CLI entrypoints for site operations
└── README.md                # This file
```

---

## 📄 License

This website codebase is open source and licensed under the [MIT License](LICENSE).
