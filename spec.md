# UniLearn LMS

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Landing page with hero, feature highlights, chatbot preview, dashboard preview, footer
- Role-based authentication (Login / Signup) with Student, Faculty, Admin roles
- Student Dashboard: sidebar nav, attendance widget, study materials, assignments, AI chatbot
- Faculty Dashboard: sidebar nav, upload study materials, create assignments, attendance management, AI chatbot
- Admin Dashboard: sidebar nav, manage users, system analytics charts, attendance reports, manage content
- AI Chatbot interface: floating button, full chatbot page, message bubbles, typing animation, suggested prompts
- Reusable components: Navbar, Sidebar, DashboardCards, MaterialCard, AssignmentCard, ChatbotUI, UploadModal, ThemeToggle
- Dark/Light mode toggle persisted in localStorage
- Framer Motion animations: page transitions, sidebar expansion, card hover effects, floating elements
- Responsive design for desktop, tablet, mobile

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- `UserRole` variant: #Student, #Faculty, #Admin
- `User` record: id, name, email, passwordHash, role
- `StudyMaterial` record: id, title, subject, fileType, uploadedBy, uploadedAt, description
- `Assignment` record: id, title, description, deadline, createdBy, subject
- `AssignmentSubmission` record: id, assignmentId, studentId, submittedAt, content
- `AttendanceRecord` record: id, studentId, date, status (#Present / #Absent), markedBy
- CRUD methods for all entities
- Role-based query methods: getStudentMaterials, getFacultyAssignments, getAdminAnalytics
- Mock AI chatbot response handler returning static academic responses

### Frontend Pages
1. **LandingPage** — hero section, features grid, chatbot/dashboard preview, footer
2. **LoginPage** — email/password form, show/hide password, forgot password link
3. **SignupPage** — full name, email, password, confirm password, role selector
4. **StudentDashboard** — stats cards, recent materials, assignment deadlines, chatbot widget
5. **FacultyDashboard** — stats cards, upload material panel, create assignment form, attendance panel
6. **AdminDashboard** — analytics charts, user tables, content management panels
7. **ChatbotPage** — full-page chat interface with message history, typing animation, suggested prompts

### Frontend Components
- `Navbar` — logo, nav links, theme toggle, user avatar
- `Sidebar` — role-aware navigation, collapse animation
- `DashboardCards` — stat cards with icons and trend indicators
- `MaterialCard` — file type icon, subject, download button
- `AssignmentCard` — title, deadline badge, status, submit button
- `ChatbotUI` — message bubbles, typing indicator, input with send button
- `UploadModal` — drag-and-drop zone, file type selector, subject/class assignment
- `ThemeToggle` — animated toggle switch

### Hooks / Utils
- `useTheme` hook — manages dark/light mode with localStorage persistence
- `useAuth` hook — manages current user session and role routing
- `useChatbot` hook — manages chat message state and mock AI responses
