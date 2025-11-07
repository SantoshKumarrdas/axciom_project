# Server Setup

## MongoDB Setup

This server uses MongoDB to store data. You need to have MongoDB installed and running.

### Local MongoDB

1. Install MongoDB locally or use Docker:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. The default connection string is: `mongodb://localhost:27017/axciom`

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Set the `MONGODB_URI` environment variable:
   ```bash
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/axciom"
   ```

### Environment Variables

- `MONGODB_URI` - MongoDB connection string (default: `mongodb://localhost:27017/axciom`)
- `JWT_SECRET` - Secret key for JWT tokens (default: `dev-secret-change-me`)
- `PORT` - Server port (default: `4000`)

### Running the Server

```bash
npm install
npm run server
```

The server will automatically:
- Connect to MongoDB
- Seed initial data (users, vendors, items) if the database is empty

### Default Credentials

After seeding, you can login with:
- **User**: `user@example.com` / `user`
- **Admin**: `admin@example.com` / `admin`
- **Vendor**: `vendor@example.com` / `vendor`
- **Vendor 2**: `vendor2@example.com` / `vendor2`

