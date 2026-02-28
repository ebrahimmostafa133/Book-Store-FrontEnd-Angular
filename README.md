# 📚 BookStore — Angular Frontend

A full-featured online bookstore where users can browse books, manage a cart, place orders, and pay — all powered by a real backend API. Built as a team project by three junior developers learning how to ship a complete, production-ready web app together.

**🔗 Live App:** [book-store-front-end-angular.vercel.app](https://book-store-front-end-angular.vercel.app/)

---

## ✨ Features

### For Shoppers
- **Browse & Discover** — View all available books with pagination, or filter by category or author
- **Search** — Search books by name in real time
- **Book Details** — See full info for any book including price, author, category, and customer reviews
- **Filter by Price** — Narrow down books within a price range
- **Shopping Cart** — Add books, adjust quantities, and remove items
- **Checkout & Payment** — Complete purchases with Stripe payment integration
- **Order History** — View all past orders in one place
- **User Profile** — Manage your account info
- **Authentication** — Register, log in, and reset your password securely (JWT-based with cookies)

### For Admins
- **Dashboard** — Get a quick overview of the store
- **Manage Books** — Add, edit, and delete books (with image uploads)
- **Manage Authors** — Create and update author profiles
- **Manage Categories** — Organize books into categories
- **Manage Orders** — View and track all customer orders

---

## 🛠 Tech Stack

| Tool | What we used it for |
|---|---|
| **Angular 21** | Main framework — handles UI, routing, and state |
| **TypeScript** | Strongly-typed JavaScript for fewer bugs |
| **Tailwind CSS v4** | Utility-first styling for responsive layouts |
| **Flowbite** | UI component library built on top of Tailwind |
| **Font Awesome** | Icons throughout the UI |
| **RxJS** | Handling async data streams from the API |
| **ngx-toastr** | Toast notifications (success, error, etc.) |
| **ngx-spinner** | Loading spinners while data is fetching |
| **ngx-pagination** | Paginating book listings |
| **ngx-owl-carousel-o** | Book carousels on the home page |
| **ngx-cookie-service** | Storing the auth token securely in cookies |
| **jwt-decode** | Reading user info from the JWT token |
| **Stripe** | Processing payments at checkout |
| **Angular SSR** | Server-side rendering for better performance |
| **Backend API** | A custom REST API that the app fetches all data from |

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- npm (comes with Node)
- [Angular CLI](https://angular.dev/tools/cli) v21

```bash
npm install -g @angular/cli
```

### Steps

**1. Clone the repository**
```bash
# HTTPS
git clone https://github.com/ebrahimmostafa133/Book-Store-FrontEnd-Angular.git

# or SSH
git clone git@github.com:ebrahimmostafa133/Book-Store-FrontEnd-Angular.git
```

**2. Navigate into the project folder**
```bash
cd Book-Store-FrontEnd-Angular
```

**3. Install dependencies**
```bash
npm install
```

**4. Start the development server**
```bash
npm start
```

**5. Open your browser**

Go to `http://localhost:4200` and the app should be running.

> **Note:** The app connects to a hosted backend API, so you don't need to set up or run a backend yourself. Just clone, install, and go.

---

## 🗺 Project Structure (Quick Overview)

```
src/app/
├── core/
│   ├── auth/          # Login, Register, Forgot Password pages
│   ├── guards/        # Route protection (auth, admin, guest)
│   ├── interceptors/  # Auto-attach token to requests, loading state, error handling
│   ├── interfaces/    # TypeScript types for Book, Cart, Order, User, etc.
│   ├── layout/        # Shared page layouts (user, admin, auth)
│   └── services/      # All API calls (books, cart, orders, auth, etc.)
├── features/
│   ├── home/          # Landing page with carousels
│   ├── books/         # All books listing with filters
│   ├── details/       # Single book detail page
│   ├── authors/       # Authors listing and their books
│   ├── categories/    # Categories listing and books by category
│   ├── cart/          # Shopping cart
│   ├── checkout/      # Checkout form
│   ├── payment/       # Stripe payment page
│   ├── allorders/     # Order history
│   ├── profile/       # User profile
│   └── admin/         # Admin panel (dashboard, manage books/authors/categories/orders)
└── shared/
    └── components/    # Navbar, Footer, Confirmation Modal
```

---

## 🌱 Our Journey

We are three junior developers who built this project to practice connecting a real frontend to a real backend API — and to get experience working together as a team.

Before this, we each mostly worked on solo projects with hardcoded data. This time, we wanted to do it properly: real API calls, user authentication, protected routes, a payment flow, and a live deployment.

It wasn't always smooth — we ran into CORS issues, token handling bugs, and some tricky async timing problems — but we worked through them together. We're proud of how far the project came and what we learned along the way.

---

## 👥 The Team

| Name | GitHub |
|---|---|
| Ibrahim Mostafa | [@ebrahimmostafa133](https://github.com/ebrahimmostafa133) |
| Ziad Hesham | [@ZeyadHMostafa](https://github.com/ZeyadHMostafa) |
| Ahmed Ehab | [@ahmed-ehab-reffat](https://github.com/ahmed-ehab-reffat) |

---

> Built with curiosity, a lot of Stack Overflow, and a healthy amount of `console.log` debugging. 🐛
