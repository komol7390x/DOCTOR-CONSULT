# Doctor Consult API

Telemedicine platform API for booking consultations and managing prescriptions.

## 🚀 Features

- **User Management**: Patients and Doctors with role-based access
- **Doctor Profiles**: Specialties, consultation pricing, experience
- **Appointment Booking**: Schedule appointments with conflict prevention
- **Prescription Management**: Create prescriptions for completed appointments
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript implementation
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Validation**: Zod schemas for request/response validation
- **Docker Support**: Containerized deployment
- **CI/CD**: GitHub Actions pipeline

## 📋 API Endpoints

### Doctors
- `GET /api/doctors` - Get all doctors with optional specialty filter

### Appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id/complete` - Complete an appointment
- `POST /api/appointments/:id/prescription` - Create prescription for completed appointment

### Health Check
- `GET /health` - Service health check

### Documentation
- `GET /docs` - Swagger UI documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Fastify
- **ORM**: Prisma
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker (optional)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd doctor-consult
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

5. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/docs`

## 🐳 Docker Deployment

### Quick Start with Docker Compose

1. **Build and run with SQLite**
```bash
docker-compose up --build
```

2. **Run with PostgreSQL**
```bash
docker-compose --profile postgres up --build
```

3. **Run with PostgreSQL and Redis**
```bash
docker-compose --profile postgres --profile redis up --build
```

### Production Deployment

1. **Build the Docker image**
```bash
docker build -t doctor-consult-api .
```

2. **Run the container**
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="file:./prod.db" \
  -e NODE_ENV=production \
  doctor-consult-api
```

## 📚 API Usage Examples

### Get Doctors
```bash
# Get all doctors
curl http://localhost:3000/api/doctors

# Filter by specialty
curl "http://localhost:3000/api/doctors?specialty=cardiology"
```

### Create Appointment
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "patient_user_id",
    "doctorId": "doctor_user_id",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T11:00:00Z",
    "notes": "Regular checkup"
  }'
```

### Complete Appointment
```bash
curl -X PUT http://localhost:3000/api/appointments/appointment_id/complete \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Patient examined successfully"
  }'
```

### Create Prescription
```bash
curl -X POST http://localhost:3000/api/appointments/appointment_id/prescription \
  -H "Content-Type: application/json" \
  -d '{
    "diagnosis": "Hypertension",
    "instructions": "Take medication as prescribed",
    "medications": [
      {
        "name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Once daily",
        "duration": "30 days",
        "notes": "Take with water"
      }
    ]
  }'
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📊 Database Schema

### User Model
- `id`: Unique identifier
- `email`: Email address (unique)
- `firstName`: First name
- `lastName`: Last name
- `phone`: Phone number (optional)
- `role`: User role (DOCTOR/PATIENT)

### DoctorProfile Model
- `id`: Unique identifier
- `userId`: Reference to User
- `specialty`: Medical specialty
- `experience`: Years of experience
- `consultationPrice`: Consultation fee
- `description`: Professional description

### Appointment Model
- `id`: Unique identifier
- `patientId`: Reference to Patient User
- `doctorId`: Reference to Doctor User
- `startTime`: Appointment start time
- `endTime`: Appointment end time
- `status`: Appointment status (SCHEDULED/COMPLETED/CANCELLED)
- `notes`: Additional notes

### Prescription Model
- `id`: Unique identifier
- `appointmentId`: Reference to Appointment
- `patientId`: Reference to Patient User
- `doctorId`: Reference to Doctor User
- `diagnosis`: Medical diagnosis
- `instructions`: Patient instructions

### MedicationItem Model
- `id`: Unique identifier
- `prescriptionId`: Reference to Prescription
- `name`: Medication name
- `dosage`: Dosage information
- `frequency`: Frequency of intake
- `duration`: Treatment duration
- `notes`: Additional notes

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3000
HOST=localhost

# Environment
NODE_ENV=development

# JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Documentation
SWAGGER_ENABLED=true
```

## 🚨 Business Logic Rules

### Appointment Booking
- Cannot book appointments in the past
- Cannot double-book doctors (time conflict prevention)
- End time must be after start time
- Both patient and doctor must exist with correct roles

### Prescription Creation
- Only allowed for completed appointments
- One prescription per appointment
- Must include diagnosis, instructions, and medications

### Error Handling
- 400: Validation errors, invalid time ranges
- 404: Resource not found (user, appointment)
- 409: Conflicts (time conflicts, duplicate prescriptions)
- 500: Internal server errors

## 🔄 CI/CD Pipeline

The project includes a comprehensive CI/CD pipeline using GitHub Actions:

1. **Test Stage**: 
   - Code checkout
   - Dependency installation
   - Database setup
   - Linting
   - Building
   - Testing

2. **Build Stage** (main branch only):
   - Docker image building
   - Push to container registry

3. **Deploy Stage** (main branch only):
   - SSH deployment to production server
   - Docker Compose updates

## 📝 Postman Collection

A Postman collection is included in the `postman/` directory with all API endpoints pre-configured for easy testing.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `/docs`
- Review the database schema in `prisma/schema.prisma`
