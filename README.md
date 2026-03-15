# SecureGRC

A modern GRC (Governance, Risk, Compliance) tool. This project brings together asset management, risk analysis, compliance tracking, API/XML import, and AI-driven security planning in a single dashboard.

## Technologies

- `React 18` + `TypeScript`
- `Vite`
- `Tailwind CSS` + `shadcn/ui`
- `React Router`
- `Recharts`
- `Vitest`
- `@google/generative-ai` (Gemini integration)

## Core Features

### 1. Dashboard and core GRC workflow
- Assets (`assets`), risks (`risks`), and CIS controls are managed in local context.
- Key metrics are calculated, including compliance percentage, active risk count, and non-compliant controls.

### 2. Asset Management
- Add/update/delete assets.
- Search and filtering.
- Includes an `Impact (1-5)` field (currently UI-only, does not affect calculations yet).

### 3. Asset Agents
- Three OS-specific agent options:
  - Windows
  - macOS
  - Linux
- OS detection, matching agent selection, download links, and install-command copy flow.

### 4. Asset APIs (categorized)
Integrations are grouped by category, with at least 3 tools per category:

- `Vulnerability Management`
  - Tenable
  - Qualys VMDR
  - Rapid7 InsightVM
- `Asset Scanner`
  - CrowdStrike Falcon Discover
  - Lansweeper
  - Nmap Enterprise
- `LDAP / Directory`
  - Active Directory LDAP
  - OpenLDAP
  - JumpCloud Directory
- `CMDB / MDM`
  - ServiceNow CMDB
  - Microsoft Intune
  - Jamf Pro

Functions:
- Connect/Disconnect
- Sync (mock discovery)
- Import discovered assets directly into Assets
- Skip duplicate asset names

### 5. Asset Import (XML)
- For organizations without API support.
- Scanner XML upload support.
- Nmap XML and generic scanner XML parsing support.
- Preview table, single-add, and bulk-add.

### 6. Risk Overview
- Risk summary cards (Critical/High/Medium/Low)
- Scatter heat map (Likelihood vs Impact)
- 5x5 risk matrix table
- Risk names rendered inside matrix cells
- Matrix total vs all-risks consistency check

### 7. Compliance + AI Analysis
- AI-powered compliance analysis and security plan using Gemini.
- Model fallback mechanism (tries multiple model IDs).
- Local heuristic fallback when API quota/model access fails (page remains usable).

### 8. Auth UI
- `/login`
- `/register` (with department selection)

Note: Auth is currently UI flow only (no backend auth integration yet).

## Route Map

- `/` - Dashboard
- `/framework` - Framework
- `/assets` - Asset Management
- `/assets/management` - Asset Management
- `/assets/agents` - Asset Agents
- `/assets/apis` - Asset APIs
- `/assets/import` - Asset Import
- `/risks` - Risks Overview
- `/risks/assets` - Asset Risk
- `/compliance` - Compliance
- `/login` - Login
- `/register` - Register

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
# optional
VITE_GEMINI_MODEL=gemini-2.5-flash
```

Notes:
- `VITE_GEMINI_API_KEY` is required for AI compliance analysis.
- If model access or quota is unavailable, the app automatically returns local fallback analysis.

## Current Limitations

- API integrations and Auth are not connected to a real backend yet (mock/UI-first workflow).
- Asset `Impact` selection is not yet connected to risk scoring logic.

## Suggested Next Steps

- Add real backend auth integration (JWT/session).
- Add real credential management and test-connection endpoints for API connectors.
- Include the asset impact field in risk scoring calculations.
