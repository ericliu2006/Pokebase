# Pokémon Collector Backend

A backend API for managing Pokémon card collections built with Node.js, Express, and Firebase.

## Features

- User authentication and profile management
- Collection management (add/view cards)
- Centering evaluation for card images
- Public profile viewing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `firebase-admin.json` file in the root directory with your Firebase credentials:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "your-private-key",
  "client_email": "your-client-email",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-client-cert-url"
}
```

3. Create a `.env` file in the root directory:
```
PORT=3000
FIREBASE_DATABASE_URL=your-firebase-database-url
```

4. Start the server:
```bash
npm run dev  # for development with nodemon
npm start    # for production
```

## API Endpoints

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/collection` - Add card to collection
- `GET /api/collection/:user_id` - Get user's collection
- `POST /api/centering` - Evaluate card centering (upload image)
- `GET /api/users/:user_id` - Get user profile

## Firebase Collections

- `users`: User profiles and information
- `users/{user_id}/collection`: User's Pokémon card collection
