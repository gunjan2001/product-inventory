# Product Inventory System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing product inventory with search, filtering, and category management capabilities.

## Features

✨ **Core Features:**
- 📦 **Product Management** - Add, edit, delete, and view products
- 🏷️ **Category Management** - Organize products by categories
- 🔍 **Search Functionality** - Search products by name (3+ characters)
- 🎯 **Filter by Category** - Filter products by one or multiple categories
- 📄 **Pagination** - Navigate through product lists efficiently
- 💾 **Persistent Storage** - MongoDB for reliable data management
- 🎨 **Light Theme UI** - Clean, modern, and responsive design

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4.2.2** - Utility-first CSS framework
- **React Router v7.13.2** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **TypeScript** - Type-safe server code

## Project Structure

```
product-inventory/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── SearchFilter.tsx
│   │   │   └── Pagination.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.tsx
│   │   │   └── AddProductPage.tsx
│   │   ├── service/       # API service
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/            # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── config/        # Configuration
│   │   │   └── db.ts      # MongoDB connection
│   │   ├── controllers/   # Route handlers
│   │   │   └── productController.ts
│   │   ├── models/        # Database schemas
│   │   │   ├── Product.ts
│   │   │   └── Category.ts
│   │   ├── routes/        # API routes
│   │   │   └── productRoutes.ts
│   │   ├── middleware/    # Custom middleware
│   │   │   └── validation.ts
│   │   ├── seed/          # Database seeders
│   │   │   └── seedCategories.ts
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (running locally or Atlas connection string)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in server directory:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/product-inventory
   NODE_ENV=development
   ```

4. **Seed the database (optional - adds default categories):**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file in client directory:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Client runs on `http://localhost:5173`

## Available Scripts

### Server Scripts
```bash
npm run dev      # Start development server with auto-reload
npm run build    # Build TypeScript to JavaScript
npm start        # Run production build
npm run seed     # Seed database with default categories
```

### Client Scripts
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint checks
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination)
  - Query params: `page`, `limit`, `search`, `categories`
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories

## Database Schema

### Product Model
```typescript
{
  _id: ObjectId
  name: String (required)
  description: String (optional)
  quantity: Number (required)
  categories: [ObjectId] (required, references Category)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

### Category Model
```typescript
{
  _id: ObjectId
  name: String (required, unique)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## Features in Detail

### Search & Filter
- **Search by Name** - Type 3+ characters to search products
- **Filter by Category** - Select multiple categories to filter products
- **Clear Search** - Click X button or clear text to show all products
- **Reset All** - Click Reset button to clear both search and filters

### Form Validation
- **Client-side validation** - Immediate feedback on form inputs
- **Server-side validation** - Ensures data integrity
- **Category requirement** - At least one category must be selected

### Pagination
- **Items per page** - Configurable limit
- **Navigation** - Easy page navigation with previous/next buttons
- **Item count display** - Shows current results count

### UI/UX
- **Light Theme** - White backgrounds with gray and blue accents
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Interactive Elements** - Hover effects, smooth transitions
- **Loading States** - Visual feedback during operations

## Getting Started

1. **Clone the repository** (if applicable)
2. **Install dependencies** for both frontend and backend
3. **Set up environment variables**
4. **Start MongoDB** on `localhost:27017` or update connection string
5. **Run seed script** to create default categories
6. **Start the backend server**
7. **Start the frontend development server**
8. **Open** `http://localhost:5173` in your browser

## Development Workflow

### Adding a New Feature

1. **Design the database schema** if needed
2. **Create/update backend models** and routes
3. **Test API endpoints** using Postman or similar
4. **Create React components** on the frontend
5. **Connect components** to API service
6. **Test the complete flow** end-to-end

### Code Quality

- **TypeScript** - Ensures type safety across the stack
- **ESLint** - Maintains code quality and consistency
- **Component-based** - Modular and reusable code structure

## Troubleshooting

### MongoDB Connection Issues
```bash
# Ensure MongoDB is running
mongod

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/product-inventory
```

### Port Already in Use
```bash
# For server (port 5000)
lsof -i :5000
kill -9 <PID>

# For client (port 5173)
lsof -i :5173
kill -9 <PID>
```

### Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the repository documentation or create an issue in the project repository.

---

**Happy Coding!** 🚀
