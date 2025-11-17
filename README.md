# HealthSakhi - Community Health Companion

HealthSakhi is a comprehensive maternal and child health support platform designed for Indian families, featuring AI-powered health assistance, government scheme navigation, and trusted home remedies in regional languages.

## Features

- 🤖 **AI Health Assistant**: Voice and text-based health guidance powered by Llama 3.3 70B via Cerebras
- 👶 **Maternal & Child Health**: Pregnancy care, vaccination schedules, and growth milestones
- 🏛️ **Government Schemes**: Eligibility checker for PMMVY, JSY, and state welfare programs
- 🌿 **Home Remedies**: WHO-approved remedies with multilingual support
- 📅 **Health Reminders**: Track vaccinations, checkups, and important health dates
- 🌐 **Multilingual**: Support for English, Hindi, and Marathi

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **AI**: Llama 3.3 70B via Cerebras Cloud SDK (direct API, ultra-fast inference ~2100 tokens/sec)
- **Authentication**: Supabase Auth
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Docker & Docker Compose (for containerized deployment)
- Supabase account
- Cerebras API key

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd HealthSakhi
\`\`\`

### 2. Install dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Set up environment variables

 Updated instructions to clarify Cerebras direct API usage 
**Important**: Add the following environment variable in your v0 Project Settings (click the gear icon in the top right):

\`\`\`
CEREBRAS_API_KEY=csk-txkwf5x8kre6k2dt5pejy4ph656f6m8pe3t5hh3x6p5ww6kv
\`\`\`

This key enables direct access to Cerebras Cloud API for Llama 3.3 70B inference, bypassing any intermediary gateways.

The Supabase environment variables are already configured through the integration.

For local development, copy the example environment file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 4. Set up the database

Run the SQL migration scripts in order through the v0 interface or your Supabase SQL editor:

\`\`\`bash
scripts/001_create_profiles.sql
scripts/002_create_health_reminders.sql
scripts/003_create_government_schemes.sql
scripts/004_create_home_remedies.sql
scripts/005_create_chat_history.sql
\`\`\`

### 5. Run the development server

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Docker Deployment

### Build and run with Docker Compose

\`\`\`bash
# Build the image
docker-compose build

# Start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
\`\`\`

### Build Docker image manually

\`\`\`bash
docker build -t HealthSakhi .
docker run -p 3000:3000 --env-file .env.local HealthSakhi
\`\`\`

## Project Structure

\`\`\`
HealthSakhi/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── assistant/        # AI chat endpoint (Cerebras direct)
│   │   └── health/           # Health check endpoint
│   ├── assistant/            # Health assistant page
│   ├── auth/                 # Authentication pages
│   ├── remedies/             # Home remedies page
│   ├── reminders/            # Health reminders page
│   ├── schemes/              # Government schemes page
│   └── page.tsx              # Landing page
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── health-assistant.tsx
│   ├── remedies-view.tsx
│   ├── reminders-view.tsx
│   └── scheme-navigator.tsx
├── lib/                      # Utility libraries
│   └── supabase/             # Supabase client setup
├── scripts/                  # Database migration scripts
├── public/                   # Static assets
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
└── README.md
\`\`\`

## API Endpoints

- `POST /api/assistant/chat` - AI chat endpoint using Cerebras Cloud SDK (requires authentication)
- `GET /api/health` - Health check endpoint

## Database Schema

- **profiles**: User profiles with language preferences
- **health_reminders**: Vaccination and checkup reminders
- **government_schemes**: Welfare scheme information
- **home_remedies**: WHO-approved home remedies
- **chat_history**: Conversation history

## AI Model Configuration

 Clarified direct Cerebras API usage 
HealthSakhi uses **Llama 3.3 70B** via **Cerebras Cloud SDK** for direct, ultra-fast inference (~2100 tokens/second). The implementation:
- Uses `@cerebras/cerebras_cloud_sdk` package for direct API access
- No intermediary gateways or proxies
- Context length: 128k tokens
- Multilingual support for English, Hindi, and Marathi
- Specialized knowledge in maternal and child health

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
