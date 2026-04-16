# ShoppieCart - Full Stack E-Commerce Application

A comprehensive full-stack e-commerce platform built with Node.js, Express.js, React, and MySQL.

## Live Demo

- **Frontend Application:** [https://shoppiecart.vercel.app/](https://shoppiecart.vercel.app/)
- **Backend API:** [https://shoppiecart-backend.onrender.com](https://shoppiecart-backend.onrender.com)
- **Database:** [Railway MySQL](https://railway.com/project/ba52a1f6-c090-4009-abb7-5f9f390479b7)
- **GitHub Repository:** [https://github.com/SanskarKurmi/ShoppieCart](https://github.com/SanskarKurmi/ShoppieCart)

## Features

### User Features

- User authentication with JWT tokens
- Product browsing with search and filtering
- Shopping cart with persistent storage
- Order placement and tracking
- User profile management

### Admin Features

- Product and category management
- Order status management
- Admin dashboard

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MySQL, JWT, bcrypt
- **Frontend:** React, React Router, Bootstrap, Axios
- **Database:** MySQL with normalized schema
- **Deployment:** Vercel (frontend), Render (backend), Railway (database)

## 📋 Prerequisites

- Node.js (v16+)
- MySQL (v8.0+) or cloud database
- Git

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/SanskarKurmi/ShoppieCart.git
cd ShoppieCart
```

### 2. Backend Setup

```bash
cd backend
npm install
# Create .env file with database credentials
npm run seed  # Seed initial data
npm run dev   # Start development server (http://localhost:5000)
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start  # Start development server (http://localhost:3000)
```

## 📁 Project Structure

```
ShoppieCart/
├── backend/                 # Node.js Express API
│   ├── controllers/         # Request handlers
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   ├── config/            # Database config
│   └── scripts/           # Database seeding
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API configuration
│   │   └── auth/          # Authentication
├── database/              # MySQL schema
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart & Orders

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## 🚀 Deployment

### Backend (Render)

1. Connect GitHub repo to Render
2. Set root directory: `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables

### Frontend (Vercel)

1. Connect GitHub repo to Vercel
2. Set root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `build`
5. Add env var: `REACT_APP_API_URL=https://shoppiecart-backend.onrender.com`

### Database (Railway)

1. Create MySQL database on Railway
2. Import `database/db.sql`
3. Use connection details in backend `.env`

## 🧪 Testing

### Backend

```bash
cd backend && npm test
```

### Frontend

```bash
cd frontend && npm test
```

## 📱 Usage

### For Customers

1. Register/Login account
2. Browse products by category
3. Add items to cart
4. Place orders
5. Track order status

### For Admins

1. Login with admin credentials
2. Manage products and categories
3. View and update orders
4. Monitor platform metrics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push and create PR

## 📞 Support

For issues, open a GitHub issue or contact the development team.

---

**Built with ❤️ using Node.js, Express, React, and MySQL**

### Database

- **Type**: MySQL
- **Schema**: Normalized relational design
- **Tables**: users, products, categories, cart, orders, orderdetails, payments

### Deployment

- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Database**: Railway.app (Free MySQL)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher) or cloud database
- Git
- npm or yarn package manager

## 🚀 Quick Start

### Clone the Repository

```bash
git clone https://github.com/SanskarKurmi/ShoppieCart.git
cd ShoppieCart
```

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Import database schema
# Import database/db.sql into your MySQL database

# Seed initial data (optional)
npm run seed

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file (if needed)
# REACT_APP_API_URL=http://localhost:5000

# Start development server
npm start
# App runs on http://localhost:3000
```

### Environment Variables

#### Backend (.env)

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=shoppiecart
NODE_ENV=development
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

## 📁 Project Structure

```
ShoppieCart/
├── backend/                          # Node.js Express API
│   ├── config/
│   │   └── db.js                     # Database configuration
│   ├── controllers/                  # Request handlers
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── productController.js
│   ├── middleware/                   # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── responseMiddleware.js
│   ├── routes/                       # API routes
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── productRoutes.js
│   ├── services/                     # Business logic
│   │   ├── authService.js
│   │   ├── cartService.js
│   │   ├── categoryService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── productService.js
│   ├── scripts/
│   │   └── seed.js                   # Database seeding
│   ├── app.js                        # Express app setup
│   ├── server.js                     # Server entry point
│   └── package.json
├── frontend/                         # React application
│   ├── public/                       # Static files
│   ├── src/
│   │   ├── api/                      # API configuration
│   │   │   ├── endpoints.js
│   │   │   └── http.js
│   │   ├── auth/                     # Authentication
│   │   │   └── AuthContext.js
│   │   ├── components/               # Reusable components
│   │   │   ├── AppNavbar.js
│   │   │   ├── Footer.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/                    # Page components
│   │   │   ├── AdminOrdersPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── NotFoundPage.js
│   │   │   ├── OrderDetailPage.js
│   │   │   ├── OrdersPage.js
│   │   │   ├── ProductsPage.js
│   │   │   └── RegisterPage.js
│   ├── App.js
│   ├── index.js
│   └── package.json
├── database/
│   └── db.sql                        # MySQL schema
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Cart

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove cart item

### Orders

- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Payments

- `POST /api/payments` - Process payment
- `GET /api/payments/:orderId` - Get payment details

## 🗄️ Database Schema

The application uses a normalized MySQL database with the following main tables:

- **users**: User accounts and authentication
- **products**: Product catalog with pricing and inventory
- **categories**: Product categorization
- **cart**: Shopping cart items
- **orders**: Customer orders
- **order_items**: Items within orders
- **payments**: Payment transactions

## 🚀 Deployment

### Backend Deployment (Render)

1. Create account on [Render.com](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add environment variables in Render dashboard
5. Deploy

### Frontend Deployment (Vercel)

1. Create account on [Vercel](https://www.vercel.com)
2. Connect GitHub repository
3. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
4. Add environment variable: `REACT_APP_API_URL=https://shoppiecart-backend.onrender.com`
5. Deploy

### Database (Railway)

1. Create account on [Railway.app](https://railway.app)
2. Add MySQL database
3. Import `database/db.sql` schema
4. Use connection credentials in backend `.env`

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### API Testing

Use tools like Postman or Insomnia to test API endpoints.

## 📱 Usage Guide

### For Customers

1. **Register**: Create account with email and password
2. **Browse**: Explore products by category
3. **Search**: Use search functionality to find products
4. **Cart**: Add products to cart, modify quantities
5. **Checkout**: Place orders and complete payment
6. **Orders**: Track order history and status

### For Administrators

1. **Login**: Use admin credentials
2. **Products**: Add/edit/delete products
3. **Categories**: Manage product categories
4. **Orders**: View and update order status
5. **Dashboard**: Monitor platform metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For support or questions:

- Open an issue on GitHub
- Email: [sanskarkurmi12@gmail.com]

## 🔄 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filtering
- [ ] Inventory management alerts
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Analytics dashboard

---

**Built with ❤️ using Node.js, Express, React, and MySQL**
