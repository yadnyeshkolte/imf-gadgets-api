# IMF Gadget Management System API

**Web Application**: [GitHub Pages Deployment](https://yadnyeshkolte.github.io/imf-gadgets-dashboards/)

## 📋 API Features

### Authentication Endpoints

```
POST /auth/register
POST /auth/login
```

### Gadget Management Endpoints

```
GET    /gadgets          - Retrieve all gadgets
GET    /gadgets?status={status} - Filter gadgets by status
POST   /gadgets          - Add new gadget (auto-generates codename)
PATCH  /gadgets/:id      - Update gadget information
DELETE /gadgets/:id      - Decommission gadget
POST   /gadgets/:id/request-destruction - Get the Code
POST   /gadgets/:id/self-destruct - Initiate gadget self-destruct sequence
```

### Key Features
- JWT-based authentication system
- Random codename generation (e.g., "The Nightingale", "Operation Kraken")
- Mission success probability calculation
- Status tracking (Available, Deployed, Destroyed, Decommissioned)
- Soft delete implementation with decommission timestamps
- Status-based filtering of gadgets

## 📝 API Documentation

### CURL Examples

#### Register New Agent
```bash
curl -X POST https://imf-gadgets-api-demo.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"put username","password":"put password"}'
```

#### Login
```bash
curl -X POST https://imf-gadgets-api-demo.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"agent009","password":"secret009"}'
```

#### Add New Gadget
```bash
curl -X POST https://imf-gadgets-api-demo.onrender.com/gadgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Explosive Pen"}'
```

#### Get All Gadgets
```bash
curl -X GET https://imf-gadgets-api-demo.onrender.com/gadgets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Gadgets by Status
```bash
curl -X GET https://imf-gadgets-api-demo.onrender.com/gadgets?status=Available \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### API Endpoints Detail
[![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=Postman&logoColor=white)](https://documenter.getpostman.com/view/41932986/2sAYX9kzTN)
#### Authentication

##### Register New Agent
```http
POST /auth/register
Content-Type: application/json

{
  "username": "agent007",
  "password": "secretpassword"
}
```

##### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "agent007",
  "password": "secretpassword"
}
```

#### Gadget Operations

##### Get All Gadgets
```http
GET /gadgets
Authorization: Bearer <jwt_token>
```

##### Get Gadgets by Status
```http
GET /gadgets?status=Available
Authorization: Bearer <jwt_token>

Available status values: "Available", "Deployed", "Destroyed", "Decommissioned"
```

##### Add New Gadget
```http
POST /gadgets
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Explosive Chewing Gum",
  "status": "Available"
}
```

##### Update Gadget
```http
PATCH /gadgets/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "Deployed"
}
```

##### Decommission Gadget
```http
DELETE /gadgets/:id
Authorization: Bearer <jwt_token>
```

##### Self-Destruct Gadget
```http
POST /gadgets/:id/self-destruct
Authorization: Bearer <jwt_token>
```

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL (hosted on Render.com)
- Sequelize ORM
- JSON Web Tokens (JWT) for authentication
- bcrypt.js for password hashing
- UUID for unique identifiers

### Frontend (Separate Repository)
- [Link to frontend repository](https://github.com/yadnyeshkolte/imf-gadgets-dashboards)

### Environment Variables
Create a `.env` file with the following variables:
```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
CORS_ORIGIN=http://localhost:5176,https://your-frontend-domain.com
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing using bcrypt
- CORS configuration for specified origins
- Protected routes using authentication middleware
- Secure database connection with SSL in production

- ✅ JWT Authentication
- ✅ Deployment on Render.com
- ✅ Status-based gadget filtering
- ✅ Frontend implementation
- ✅ CORS configuration for secure cross-origin requests

## 📦 Deployment

The API is deployed on Render.com with the following configuration:
- PostgreSQL database instance
- Web service for the Node.js application
- Environment variables configured in Render dashboard
- Automatic deployments from GitHub

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
