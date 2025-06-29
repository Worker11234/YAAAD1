# Yaadein AI Backend

A production-ready Node.js Express backend for Yaadein AI, an intelligent photo tagging and memory management system. This backend powers AI-driven image analysis, smart tag generation, facial recognition, and interactive memory games to help users organize and rediscover their precious memories.

## 🎯 Project Overview

Yaadein AI Backend is a robust, scalable backend that analyzes uploaded images using state-of-the-art AI models, generates contextually relevant tags, implements facial recognition for people tagging, and provides gamified experiences for users to interact with their memory collections.

## 🏗️ Technology Stack

- **Runtime**: Node.js 18+ with Express.js
- **Language**: TypeScript for type safety and better development experience
- **AI Models**: Hugging Face Inference API + OpenAI Vision API fallback
  - Primary: `Salesforce/blip-image-captioning-large` for image captioning
  - Secondary: `microsoft/DialoGPT-medium` for conversational tag suggestions
  - Facial Recognition: `microsoft/DialoGPT-medium` for face detection
  - Tag Generation: `mistralai/Mistral-7B-Instruct-v0.1` for intelligent tagging
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **File Storage**: Supabase Storage with CDN optimization
- **Image Processing**: Sharp.js for optimization
- **Caching**: Redis for high-performance caching
- **Queue Management**: Bull Queue for background processing
- **Security**: Helmet.js, rate limiting, input validation with Express Validator
- **Monitoring**: Winston logging

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Redis server
- Supabase account and project
- Hugging Face API key (for AI features)
- OpenAI API key (optional, for fallback)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yaadein-ai-backend.git
   cd yaadein-ai-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your credentials and configuration.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Start the worker processes (in a separate terminal):
   ```bash
   npm run queue:worker
   ```

## 🗄️ Database Schema

The backend uses Supabase PostgreSQL with the following core tables:

- `users`: User profiles and preferences
- `memories`: Uploaded images and metadata
- `tags`: AI-generated and user-created tags
- `people`: Recognized individuals in photos
- `face_detections`: Detected faces in images
- `game_sessions`: Memory game sessions
- `collections`: Memory collections/albums

## 🚀 API Endpoints

### Memory Management

- `POST /api/v1/memories/analyze`: Upload and analyze images
- `GET /api/v1/memories`: Get user's memories
- `GET /api/v1/memories/:id`: Get a specific memory
- `DELETE /api/v1/memories/:id`: Delete a memory
- `GET /api/v1/memories/search`: Search memories

### People & Face Management

- `POST /api/v1/people`: Create a new person
- `GET /api/v1/people`: Get all people
- `GET /api/v1/people/:id`: Get a specific person
- `PUT /api/v1/people/:id`: Update a person
- `DELETE /api/v1/people/:id`: Delete a person
- `GET /api/v1/people/:id/memories`: Get memories containing a person
- `POST /api/v1/memories/:memory_id/faces/verify`: Verify a face detection

### Collections

- `POST /api/v1/collections`: Create a collection
- `GET /api/v1/collections`: Get all collections
- `GET /api/v1/collections/:id`: Get a specific collection
- `PUT /api/v1/collections/:id`: Update a collection
- `DELETE /api/v1/collections/:id`: Delete a collection
- `POST /api/v1/collections/:id/memories`: Add a memory to a collection
- `DELETE /api/v1/collections/:id/memories/:memory_id`: Remove a memory from a collection
- `POST /api/v1/collections/auto-generate`: Generate a smart collection

### Games

- `POST /api/v1/games/start`: Start a new game session
- `POST /api/v1/games/:session_id/answer`: Submit an answer
- `GET /api/v1/games/history`: Get game history
- `GET /api/v1/games/achievements`: Get achievements

## 🔒 Security

- JWT authentication
- Rate limiting
- Input validation
- Helmet.js for security headers
- Supabase Row Level Security (RLS)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.