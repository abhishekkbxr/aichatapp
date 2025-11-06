# AI Chat Application

This is a modern chat application built with Next.js (frontend) and Django (backend) that enables AI-powered conversations.

## Project Structure

```
.
├── frontend/    # Next.js frontend
└── backend/     # Django backend
```

## Backend Setup (Django)

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup Steps

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- On macOS/Linux:
```bash
source venv/bin/activate
```
- On Windows:
```bash
.\venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run database migrations:
```bash
python manage.py migrate
```

6. Start development server:
```bash
python manage.py runserver
```

The backend server will start at http://localhost:8000

## Frontend Setup (Next.js)

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Setup Steps

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run development server:
```bash
npm run dev
# or
yarn dev
```

The frontend application will start at http://localhost:3000

## Features

- Real-time chat functionality
- AI-powered conversations
- Dark/Light theme support
- Conversation management
- Intelligence features

## Project Structure Details

### Frontend
- `/app` - Next.js 13+ app directory with route groups
- `/components` - Reusable React components
- `/lib` - Utilities and API handlers

### Backend
- `/api` - Django REST API endpoints
- `/chat` - Main Django project settings
- API includes AI module integration

## Available API Endpoints

The backend provides RESTful APIs for:
- Chat functionality
- AI interactions
- User management
- Conversation handling

## Environment Variables

### Backend
Create a `.env` file in the backend directory with:
```env
OPENAI_API_KEY=your_openai_api_key
```

### Frontend
Create a `.env.local` file in the frontend directory with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

1. Start the backend server first
2. Then start the frontend development server
3. Make sure both servers are running simultaneously for full functionality
