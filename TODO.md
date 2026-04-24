# Booking Feature Enhancement - TODO

## Overview
Add standalone booking page for online sessions and home services with Google Form integration, fee calculation, and instructor dashboard sync.

## Steps

### Phase 1: Backend Updates
- [ ] **Step 1:** Update `backend/models/Booking.js` — Add `address`, `subject`, `isWeekly`, `bookingSource` fields
- [ ] **Step 2:** Update `backend/controllers/bookingController.js` — Add standalone booking creation, fee calculation, Google Form webhook handler, get available lecturers
- [ ] **Step 3:** Update `backend/routes/bookings.js` — Add routes for standalone booking, lecturers list, Google Form webhook
- [ ] **Step 4:** Update `backend/server.js` — Mount Google Form webhook route

### Phase 2: Frontend — New Booking Page
- [ ] **Step 5:** Create `frontend/src/pages/BookNow.jsx` — Full booking page with hero, pricing cards, fee calculator, lecturer selection, date/time picker, Google Form embed option
- [ ] **Step 6:** Update `frontend/src/App.jsx` — Add `/book-now` route

### Phase 3: Navigation & Dashboard
- [ ] **Step 7:** Update `frontend/src/components/Navbar.jsx` — Add "Book a Session" link
- [ ] **Step 8:** Update `frontend/src/pages/InstructorDashboard.jsx` — Update bookings display to show service type, subject, fee, address

### Phase 4: Google Apps Script
- [ ] **Step 9:** Create `GOOGLE_FORM_SCRIPT.md` — Instructions and Apps Script code for webhook integration

## Pricing Rules
- Sciences (Chemistry, Mathematics, Biology, Physics, GIS, Remote Sensing): **130 DHS/hour**
- Languages (French, English): **120 DHS/hour**
- Weekly/Continuous sessions: **10% discount**

