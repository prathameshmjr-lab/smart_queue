# 🏛️ SmartQueue - Government Token & Queue Management System

**SmartQueue** is an enterprise-grade digital token and queue management system designed for public sector and government administrative offices. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth + Realtime)**.

---

## 🌟 Key System Features

### 1. 👥 Multi-Role Authentication & Access
- **Citizens**: Passwordless Email OTP login with 6-digit verification code.
- **Counter Staff**: Official email & password login with assigned counter workspaces.
- **Administrative Officers**: Executive oversight portal with system-wide analytics, SLA health watchdogs, and configuration.
- **Row-Level Security (RLS)**: Enforced via PostgreSQL policies to isolate citizen tokens while granting staff counter-level access and officers global visibility.

### 2. 🎫 Citizen Experience
- **Location & Service Selection**: Choose from offices (e.g. *City Hall Central Secretariat*, *Regional Revenue & Civic Center*) and service categories (*Certificates*, *Taxes & Payments*, *Citizen Enquiries*, *Land Records*).
- **Sequential Daily Numbering**: Daily auto-incrementing token codes (e.g. `CRT-001`, `PAY-002`) reset daily at midnight.
- **Live Queue Position & Wait Estimation**: Dynamic calculation:
  $$\text{Estimated Wait} = \text{Citizens Ahead} \times \text{Average Service Time}$$
- **Confidential 4-Digit One-Time Key (OTK)**: Each token receives a unique 4-digit code (e.g., `4829`) displayed *only* on the citizen's screen for physical counter verification.
- **My Tokens & Visit History**: Active queue cards + complete history of past visits with recorded duration.
- **Single Active Token Rule**: Prevents duplicate tokens per service with full citizen self-cancellation.

### 3. 🖥️ Counter Staff Operations
- **Call Next Token**: Assigns next waiting citizen to the desk with audible dual-tone chime and TV announcement.
- **2-Minute Auto No-Show Countdown**: Starts a 120-second timer when a token is called. If the citizen does not report, the system auto-marks as *No-Show* and frees the desk.
- **Key Verification & 3-Attempt Lockout Protection**: Staff must input the citizen's 4-digit OTK to start service. If 3 wrong keys are attempted, the token locks automatically and raises an alert to the Admin Officer.
- **Emergency Unverified Bypass**: Allows authorized staff to start emergency service while flagging the token as `unverified` in audit logs.
- **Break Management**: "Go on Break" / "Back from Break" tracking with break categorization (Lunch, Tea, Official Meeting) and duration calculation.

### 4. 📊 Administrative Officer Dashboard
- **Queue Health & Anomaly Watchdog**:
  - Tokens waiting $> 60\text{ minutes}$ (SLA violation alarm).
  - No-shows today.
  - Unverified token completions.
  - Key lockouts with 1-click **"Unlock Key"** capability.
- **Fleet Grid**: Live cards for every desk with active tokens, assigned officers, and queue lengths.
- **Employee Efficiency Matrix**:
  - Customers served (Today / Week / Month).
  - Average, shortest, and longest service durations.
  - Total break time and idle time between citizens.
  - Comparative benchmark (*Good* / *Average* / *Slow* vs. office norm).
  - Automatic anomaly flags for abnormal break times or duration outliers.
- **Interactive Analytics (Recharts)**:
  1. Customers served per staff officer.
  2. Average service time per service category.
  3. Peak hours citizen traffic curve (9:00 AM to 5:00 PM).
  4. 7-day throughput & no-show trend lines.
- **Master Tokens Registry & CSV Exporter**:
  - Multi-criteria filtering by Date, Service, Staff, and Status.
  - Instant **"Export to CSV"** button generating comprehensive spreadsheets.
- **System Organization CRUD**: Manage offices, services, counters, and staff accounts. Includes **Clear Demo Data** and **Restore Demo Data** actions.

### 5. 📺 Public "Now Serving" TV Display Board
- Dedicated high-contrast TV board available at `/display` with animated pulse indicators, live audio chimes, and fullscreen mode for hall monitors.

---

## 📁 Repository Structure

```
smartqueue/
├── app/
│   ├── display/page.tsx       # Dedicated Fullscreen Waiting Hall TV Board
│   ├── globals.css            # Tailwind styling tokens & theme
│   ├── layout.tsx             # Root layout with Inter typography
│   └── page.tsx               # Main Portal uniting Citizen, Staff, Admin views
├── components/
│   ├── Navbar.tsx             # Government header with Digital Clock & DB modal
│   ├── QuickRoleSelector.tsx  # 1-Click test accounts switcher
│   ├── NowServingBoard.tsx    # Real-time counter cards with chime announcements
│   ├── SupabaseConfigModal.tsx# Database connection dialog & SQL guide
│   ├── Customer/
│   │   ├── CustomerLogin.tsx  # 6-Digit Email OTP authentication
│   │   ├── TokenRequest.tsx   # Office & Service selection with queue preview
│   │   ├── TokenDisplay.tsx   # Large token badge, OTK secret & wait timer
│   │   └── MyTokensHistory.tsx# Active queue cards & visit duration history
│   ├── Staff/
│   │   ├── StaffLogin.tsx     # Staff email/password login & presets
│   │   └── CounterPortal.tsx  # Call Next, 2-min timer, OTK verification & breaks
│   └── Admin/
│       ├── AdminLogin.tsx     # Officer authentication portal
│       ├── QueueHealthPanel.tsx # SLA breaches & 1-click token key unlock
│       ├── LiveCounterGrid.tsx  # Live fleet monitoring of all counters
│       ├── EmployeeAnalytics.tsx# Staff benchmarks, break/idle & anomaly flags
│       ├── AdminCharts.tsx    # Recharts 4-chart analytical suite
│       ├── TokensMasterTable.tsx# Searchable token audit table + CSV download
│       └── OfficeManagement.tsx # CRUD for Offices, Services, Counters, Staff
├── lib/
│   ├── types.ts               # Complete TypeScript domain interfaces
│   ├── supabaseClient.ts      # Supabase client & dynamic credential handler
│   ├── store.ts               # Reactive queue store, business logic & analytics
│   ├── demoData.ts            # 45+ realistic seed records across 7 days
│   └── utils.ts               # Web Audio chime synthesizer & CSV exporter
└── supabase/
    ├── schema.sql             # PostgreSQL DDL with RLS, triggers & indexes
    └── seed.sql               # Demo seed SQL script for Supabase SQL Editor
```

---

## 🚀 Quick Start Guide

### 1. Run Locally
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Connect Supabase (Optional)
SmartQueue runs out-of-the-box in zero-setup interactive mode with complete demo datasets and multi-tab synchronization.

To connect your own **Supabase** project:
1. Create a project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in Supabase and run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Click the **"Database"** button in the top navbar or create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 🧪 Demo Test Accounts (Available with 1-Click Switcher)

| Role | Name | Email | Counter / Function |
| :--- | :--- | :--- | :--- |
| **Citizen** | Demo Citizen | `customer.demo@gov.smartqueue.org` | Request Token, View OTK (`7392`), My Visits |
| **Counter Staff** | Rajesh Kumar (`EMP-101`) | `rajesh.kumar@gov.smartqueue.org` | Counter 01 - Certificates Desk |
| **Counter Staff** | Priya Sharma (`EMP-102`) | `priya.sharma@gov.smartqueue.org` | Counter 02 - Revenue & Cash Desk |
| **Counter Staff** | Vikram Singh (`EMP-103`) | `vikram.singh@gov.smartqueue.org` | Counter 03 - Enquiries Desk |
| **Admin Officer** | Officer Anita Desai (`EMP-001`) | `anita.desai@gov.smartqueue.org` | Senior Executive Administration |
