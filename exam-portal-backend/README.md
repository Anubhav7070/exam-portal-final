# Online Exam Portal Backend

## Setup

1. Clone the repo and navigate to `exam-portal-backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server:
   ```bash
   node app.js
   ```

## Project Structure
- `controllers/` — Route logic
- `db/` — Supabase client
- `middleware/` — Auth, validation, etc.
- `routes/` — Express route definitions
- `seed/` — Mock data scripts

## Features
- JWT Auth, role-based access
- Supabase DB integration
- Input validation
- CORS enabled
- Error handling

## To Do
- Implement routes/controllers
- Add seed scripts
- Write tests 