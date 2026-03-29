# ShoppieCart

A full-stack e-commerce application built with Node.js (backend) and React (frontend). Features user authentication, product management, cart functionality, orders, payments, and admin tools.

## Features

- **User Authentication**: Register, login, JWT-based auth.
- **Product Management**: Browse, search, and manage products (admin).
- **Cart & Orders**: Add to cart, place orders, track status.
- **Payments**: Integrated payment processing.
- **Admin Panel**: Manage categories, products, orders.
- **Responsive UI**: Built with React for mobile/desktop.

## Tech Stack

- **Backend**: Node.js, Express.js, MySQL (via config/db.js).
- **Frontend**: React, Axios for API calls.
- **Database**: MySQL (schema in database/db.sql).
- **Authentication**: JWT, bcrypt.
- **Other**: CORS, dotenv for env vars.

## Prerequisites

- Node.js (v16+ recommended).
- MySQL (local or cloud).
- Git.

## Setup & Installation

1. **Clone the repo**:
   ```bash
   git clone https://github.com/yourusername/ShoppieCart.git
   cd ShoppieCart
   ```

2. **Backend Setup**:
   - Navigate to `backend/`:
     ```bash
     cd backend
     npm install
     ```
   - Configure database in `config/db.js` (update MySQL credentials).
   - Run database schema: Import `database/db.sql` into MySQL.
   - Create `.env` file in `backend/`:
     ```
     PORT=5000
     JWT_SECRET=your_secret_key
     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASS=your_db_password
     DB_NAME=shoppiecart
     ```
   - Seed data (optional): `node scripts/seed.js`
   - Start server: `npm start` (runs on http://localhost:5000)

3. **Frontend Setup**:
   - Navigate to `frontend/`:
     ```bash
     cd ../frontend
     npm install
     ```
   - Start app: `npm start` (runs on http://localhost:3000)

4. **Full App**:
   - Ensure backend is running, then open frontend in browser.

## Usage

- **User**: Register/login, browse products, add to cart, checkout.
- **Admin**: Access admin routes (e.g., /admin/orders) for management.
- API endpoints: See `backend/routes/` for details.

## Scripts

- Backend: `npm start` (production), `npm run dev` (development with nodemon).
- Frontend: `npm start` (dev server), `npm run build` (production build).

## Deployment

- **Backend**: Deploy to Heroku/Render/Vercel. Set env vars, connect to MySQL (e.g., PlanetScale).
- **Frontend**: Build and deploy to Netlify/Vercel/GitHub Pages. Update API base URL in `frontend/src/api/http.js`.
- **Full Stack**: Use Docker (see Dockerfile if added) or services like Railway.

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push: `git push origin feature-name`
5. Open a PR.

## License

MIT License.

## Contact

For issues, open a GitHub issue or email [your-email@example.com].