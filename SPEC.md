# LMS Platform - Hybrid Learning Management System

## 1. Project Overview

**Project Name:** LearnHub - Hybrid LMS  
**Project Type:** Full-stack MERN Web Application  
**Core Functionality:** A hybrid Learning Management System combining digital course purchases with optional mentorship bookings (in-person/virtual sessions)  
**Target Users:** Students seeking online education with personalized mentorship, Instructors offering courses and coaching sessions

---

## 2. Technical Stack

- **Frontend:** React.js with Vite, React Router, TailwindCSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT-based authentication
- **File Storage:** Cloudinary (for video thumbnails)
- **Payment:** Stripe integration

---

## 3. Database Schema

### Users Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['student', 'instructor', 'admin'], default: 'student'),
  avatar: String,
  bio: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection
```javascript
{
  title: String (required),
  description: String,
  thumbnail: String,
  price: Number (required),
  type: String (enum: ['internal', 'external'], default: 'internal'),
  instructor: ObjectId (ref: 'User'),
  category: String,
  level: String (enum: ['beginner', 'intermediate', 'advanced']),
  duration: Number, // in minutes
  lectures: [ObjectId] (ref: 'Lecture'),
  rating: Number (default: 0),
  reviewCount: Number (default: 0),
  isPublished: Boolean (default: false),
  externalUrl: String, // for Udemy integration
  createdAt: Date,
  updatedAt: Date
}
```

### Lectures Collection
```javascript
{
  courseId: ObjectId (ref: 'Course', required),
  title: String (required),
  description: String,
  videoUrl: String,
  duration: Number, // in minutes
  order: Number,
  isFree: Boolean (default: false), // free preview
  createdAt: Date
}
```

### Purchases Collection
```javascript
{
  userId: ObjectId (ref: 'User', required),
  courseId: ObjectId (ref: 'Course', required),
  paymentStatus: String (enum: ['pending', 'completed', 'failed'], default: 'pending'),
  paymentMethod: String,
  amount: Number,
  transactionId: String,
  createdAt: Date
}
```

### Bookings Collection
```javascript
{
  userId: ObjectId (ref: 'User', required),
  instructorId: ObjectId (ref: 'User', required),
  courseId: ObjectId (ref: 'Course'),
  date: Date (required),
  time: String (required),
  type: String (enum: ['virtual', 'in-person']),
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending'),
  meetingLink: String,
  notes: String,
  createdAt: Date
}
```

### Reviews Collection
```javascript
{
  userId: ObjectId (ref: 'User', required),
  courseId: ObjectId (ref: 'Course', required),
  rating: Number (required, min: 1, max: 5),
  comment: String,
  createdAt: Date
}
```

### Progress Collection
```javascript
{
  userId: ObjectId (ref: 'User', required),
  courseId: ObjectId (ref: 'Course', required),
  lectureId: ObjectId (ref: 'Lecture', required),
  completed: Boolean (default: false),
  watchedDuration: Number, // seconds
  updatedAt: Date
}
```

---

## 4. API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Password reset request
- `PUT /api/auth/reset-password` - Password reset

### Courses
- `GET /api/courses` - Get all published courses (with filters)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course (instructor/admin)
- `DELETE /api/courses/:id` - Delete course (admin)
- `GET /api/courses/instructor` - Get instructor's courses

### Lectures
- `GET /api/lectures/:courseId` - Get all lectures for a course
- `POST /api/lectures` - Create lecture (instructor)
- `PUT /api/lectures/:id` - Update lecture
- `DELETE /api/lectures/:id` - Delete lecture

### Purchases
- `POST /api/purchase` - Initiate course purchase
- `GET /api/purchase/user` - Get user's purchased courses
- `POST /api/purchase/webhook` - Stripe webhook

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/instructor` - Get instructor's bookings
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:courseId` - Get course reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Progress
- `POST /api/progress` - Update lecture progress
- `GET /api/progress/:courseId` - Get course progress

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

---

## 5. UI/UX Specification

### Color Palette
- **Primary:** #4F46E5 (Indigo)
- **Primary Dark:** #4338CA
- **Secondary:** #10B981 (Emerald)
- **Accent:** #F59E0B (Amber)
- **Background:** #F9FAFB
- **Surface:** #FFFFFF
- **Text Primary:** #111827
- **Text Secondary:** #6B7280
- **Error:** #EF4444
- **Success:** #10B981

### Typography
- **Font Family:** Inter (headings), system-ui (body)
- **Heading Sizes:** 
  - H1: 2.5rem (40px)
  - H2: 2rem (32px)
  - H3: 1.5rem (24px)
  - H4: 1.25rem (20px)
- **Body:** 1rem (16px), line-height 1.5
- **Small:** 0.875rem (14px)

### Layout
- **Max Width:** 1280px
- **Spacing Scale:** 4px base (4, 8, 12, 16, 24, 32, 48, 64)
- **Border Radius:** 8px (cards), 6px (buttons), 4px (inputs)
- **Responsive Breakpoints:**
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Components
- **Buttons:** Primary (indigo), Secondary (outlined), Ghost
- **Cards:** White bg, shadow-sm, 8px radius
- **Inputs:** 40px height, 4px radius, gray border
- **Badges:** Small pills for status indicators

---

## 6. Page Structure

### Public Pages
- Home Page (`/`)
- Course Listing (`/courses`)
- Course Detail (`/courses/:id`)
- Login (`/login`)
- Register (`/register`)

### Student Dashboard
- My Courses (`/dashboard/courses`)
- Course Player (`/courses/:id/learn`)
- Bookings (`/dashboard/bookings`)
- Profile (`/dashboard/profile`)

### Instructor/Admin Dashboard
- My Courses (`/instructor/courses`)
- Create/Edit Course (`/instructor/courses/new`, `/instructor/courses/:id/edit`)
- Add Lecture (`/instructor/courses/:id/lectures/new`)
- Student Bookings (`/instructor/bookings`)
- Analytics (`/instructor/analytics`)

---

## 7. Development Phases

### Phase 1 - MVP
- User authentication (register, login, JWT)
- Course browsing and discovery
- Course purchase with Stripe
- Video playback for internal courses
- Course progress tracking

### Phase 2 - Booking System
- Instructor booking calendar
- Virtual/in-person booking
- Booking management dashboard
- Email notifications

### Phase 3 - Advanced Features
- Reviews and ratings
- Certificates of completion
- Udemy external integration
- Analytics dashboard

---

## 8. Acceptance Criteria

### Authentication
- [ ] Users can register with name, email, password
- [ ] Users can login and receive JWT token
- [ ] Protected routes require valid JWT

### Courses
- [ ] Courses are displayed in a grid with search/filter
- [ ] Course detail page shows all information
- [ ] Instructor can create/edit courses
- [ ] Only published courses visible to students

### Purchases
- [ ] Stripe checkout for course purchase
- [ ] Purchased courses appear in user dashboard
- [ ] Only purchased courses accessible for learning

### Bookings
- [ ] Students can book sessions with instructors
- [ ] Instructors can confirm/reject bookings
- [ ] Booking status updates in real-time

### Progress
- [ ] Lecture progress is tracked
- [ ] Progress bar shows completion status
- [ ] Resume from last watched position