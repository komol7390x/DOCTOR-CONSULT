import { PrismaClient, UserRole, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create doctors
  const drSmith = await prisma.user.create({
    data: {
      email: 'dr.smith@doctor.com',
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1234567890',
      role: UserRole.DOCTOR,
      doctorProfile: {
        create: {
          specialty: 'Cardiology',
          experience: 15,
          consultationPrice: 150.00,
          description: 'Specialist in cardiovascular diseases with 15 years of experience',
        },
      },
    },
  });

  const drJohnson = await prisma.user.create({
    data: {
      email: 'dr.johnson@doctor.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567891',
      role: UserRole.DOCTOR,
      doctorProfile: {
        create: {
          specialty: 'General Practice',
          experience: 10,
          consultationPrice: 100.00,
          description: 'General practitioner with expertise in family medicine',
        },
      },
    },
  });

  const drWilliams = await prisma.user.create({
    data: {
      email: 'dr.williams@doctor.com',
      firstName: 'Michael',
      lastName: 'Williams',
      phone: '+1234567892',
      role: UserRole.DOCTOR,
      doctorProfile: {
        create: {
          specialty: 'Pediatrics',
          experience: 8,
          consultationPrice: 120.00,
          description: 'Pediatrician specializing in child healthcare',
        },
      },
    },
  });

  // Create patients
  const patient1 = await prisma.user.create({
    data: {
      email: 'alice.patient@email.com',
      firstName: 'Alice',
      lastName: 'Brown',
      phone: '+1234567893',
      role: UserRole.PATIENT,
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: 'bob.patient@email.com',
      firstName: 'Bob',
      lastName: 'Davis',
      phone: '+1234567894',
      role: UserRole.PATIENT,
    },
  });

  const patient3 = await prisma.user.create({
    data: {
      email: 'charlie.patient@email.com',
      firstName: 'Charlie',
      lastName: 'Wilson',
      phone: '+1234567895',
      role: UserRole.PATIENT,
    },
  });

  console.log('✅ Created 3 doctors and 3 patients');

  // Create some sample appointments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: drSmith.id,
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000), // 1 hour later
      status: AppointmentStatus.SCHEDULED,
      notes: 'Regular cardiac checkup',
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: drJohnson.id,
      startTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
      endTime: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000), // 3 hours later
      status: AppointmentStatus.SCHEDULED,
      notes: 'General health consultation',
    },
  });

  const completedAppointment = await prisma.appointment.create({
    data: {
      patientId: patient3.id,
      doctorId: drWilliams.id,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      endTime: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
      status: AppointmentStatus.COMPLETED,
      notes: 'Child wellness checkup - completed successfully',
    },
  });

  console.log('✅ Created sample appointments');

  // Create a sample prescription for the completed appointment
  const prescription = await prisma.prescription.create({
    data: {
      appointmentId: completedAppointment.id,
      patientId: patient3.id,
      doctorId: drWilliams.id,
      diagnosis: 'Common cold with mild fever',
      instructions: 'Rest well, stay hydrated, and take medications as prescribed. Follow up if symptoms persist.',
      medications: {
        create: [
          {
            name: 'Acetaminophen',
            dosage: '500mg',
            frequency: 'Every 6 hours as needed',
            duration: '3 days',
            notes: 'For fever and pain relief',
          },
          {
            name: 'Cough syrup',
            dosage: '10ml',
            frequency: 'Twice daily',
            duration: '5 days',
            notes: 'Take after meals',
          },
        ],
      },
    },
  });

  console.log('✅ Created sample prescription');

  // Log created data for easy reference
  console.log('\n📋 Created User IDs:');
  console.log('Doctors:');
  console.log(`  Dr. Smith (Cardiology): ${drSmith.id}`);
  console.log(`  Dr. Johnson (General Practice): ${drJohnson.id}`);
  console.log(`  Dr. Williams (Pediatrics): ${drWilliams.id}`);
  
  console.log('\nPatients:');
  console.log(`  Alice Brown: ${patient1.id}`);
  console.log(`  Bob Davis: ${patient2.id}`);
  console.log(`  Charlie Wilson: ${patient3.id}`);

  console.log('\n📅 Appointment IDs:');
  console.log(`  Scheduled Appointment 1: ${appointment1.id}`);
  console.log(`  Scheduled Appointment 2: ${appointment2.id}`);
  console.log(`  Completed Appointment: ${completedAppointment.id}`);

  console.log('\n💊 Prescription ID:');
  console.log(`  Sample Prescription: ${prescription.id}`);

  console.log('\n🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
