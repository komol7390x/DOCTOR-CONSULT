# Doctor Consult API

Telemedicine appointment booking API built with Fastify, TypeScript, and Prisma.

## Features

- Book medical consultations (appointments)
- Complete appointments and create prescriptions
- Search doctors by specialization
- View appointment history
- Integer-based auto-increment IDs

## Tech Stack

- **Framework**: Fastify
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# View database in Prisma Studio
npm run db:studio
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000`

Swagger documentation: `http://localhost:3000/docs`

## API Endpoints

### Doctors

- `GET /api/doctors` - Get all doctors (optional: ?specialization=Cardiology)
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/:id/appointments` - Get doctor's appointments

### Appointments

- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id/complete` - Mark appointment as completed
- `POST /api/appointments/:id/prescription` - Create prescription for completed appointment
- `GET /api/appointments/patient/:patientId` - Get patient's appointments

## Project Structure

```
src/
├── database/           # Zod validation schemas
├── enums/             # Constants and enums
├── filters/           # Error handling
├── modules/           # Feature modules
│   ├── appointments/ # Appointment module (service, controller, routes)
│   └── doctor/       # Doctor module (service, controller, routes)
└── plugins/          # Fastify plugins (Swagger, etc.)
```

## Docker

```bash
# Start with SQLite
docker-compose up

# Start with PostgreSQL
docker-compose --profile postgres up
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
PORT=3000
HOST=localhost
```

## Error Handling

All errors are handled by a universal exception filter that provides consistent error responses across the API.

## License

MIT
