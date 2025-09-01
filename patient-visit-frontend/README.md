# Patient Visit Manager - Angular Frontend

A complete Angular v17 frontend application for managing patient visits, doctors, patients, fees, and activity logs.

## Features

### 🔐 Authentication & Authorization
- User registration and login
- Role-based access control (User, Receptionist, Doctor, Admin)
- JWT token management
- Password change functionality

### 👥 Patient Management
- View all patients
- Add new patients
- Edit patient information
- Delete patients
- Patient details: name, date of birth, gender, phone, email, address

### 👨‍⚕️ Doctor Management
- View all doctors
- Add new doctors
- Edit doctor information
- Delete doctors
- Doctor details: name, specialty, phone, email

### 🏥 Visit Management
- View all visits
- Schedule new visits
- Edit visit details
- Delete visits
- Visit details: patient, doctor, date/time, status, notes

### 💰 Fee Management
- View all fees
- Add new service fees
- Edit fee amounts
- Delete fees
- Fee details: service name, amount

### 📊 Activity Logs (Admin Only)
- View system activity logs
- Track user actions
- Monitor system usage

### 👤 User Profile
- View profile information
- Change password
- Role-based navigation

## Technology Stack

- **Angular**: v17 (Latest)
- **TypeScript**: ES2022
- **CSS**: Custom styling with utility classes
- **HTTP Client**: Angular HttpClient for API communication
- **Routing**: Angular Router with lazy loading
- **Authentication**: JWT-based with role guards

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI v17
- .NET 7.0 backend running (PatientVisitManager)

## Installation & Setup

### 1. Install Dependencies

```bash
cd patient-visit-frontend
npm install
```

### 2. Configure Backend URL

Update the API URLs in the services to match your backend:

- **Auth Service**: `https://localhost:7001/api/auth`
- **Patient Service**: `https://localhost:7001/api/patients`
- **Doctor Service**: `https://localhost:7001/api/doctors`
- **Visit Service**: `https://localhost:7001/api/visits`
- **Fee Service**: `https://localhost:7001/api/fees`
- **Activity Log Service**: `https://localhost:7001/api/activitylogs`

### 3. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200`

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/           # Login component
│   │   ├── register/        # Registration component
│   │   ├── dashboard/       # Main dashboard with navigation
│   │   ├── patients/        # Patient management
│   │   ├── doctors/         # Doctor management
│   │   ├── visits/          # Visit management
│   │   ├── fees/            # Fee management
│   │   ├── activity-logs/   # Activity logs (Admin only)
│   │   └── profile/         # User profile management
│   ├── models/              # TypeScript interfaces
│   ├── services/            # API services
│   ├── guards/              # Route guards
│   ├── app.component.ts     # Main app component
│   ├── app.config.ts        # App configuration
│   └── app.routes.ts        # Routing configuration
├── styles.css               # Global styles
├── main.ts                  # Application entry point
└── index.html               # Main HTML file
```

## API Endpoints

The frontend communicates with the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor

### Visits
- `GET /api/visits` - Get all visits
- `GET /api/visits/{id}` - Get visit by ID
- `POST /api/visits` - Create new visit
- `PUT /api/visits/{id}` - Update visit
- `DELETE /api/visits/{id}` - Delete visit

### Fees
- `GET /api/fees` - Get all fees
- `GET /api/fees/{id}` - Get fee by ID
- `POST /api/fees` - Create new fee
- `PUT /api/fees/{id}` - Update fee
- `DELETE /api/fees/{id}` - Delete fee

### Activity Logs
- `GET /api/activitylogs` - Get all activity logs (Admin only)

## Role-Based Access Control

### User Roles
- **User**: Basic access, view profile
- **Receptionist**: Manage patients, doctors, fees
- **Doctor**: Manage visits, view patients
- **Admin**: Full access to all features including activity logs

### Route Protection
- `/dashboard/*` - Requires authentication
- `/dashboard/patients` - Requires Receptionist or Admin role
- `/dashboard/doctors` - Requires Receptionist or Admin role
- `/dashboard/visits` - Requires Doctor or Admin role
- `/dashboard/fees` - Requires Receptionist or Admin role
- `/dashboard/activity-logs` - Requires Admin role only

## Features Implementation

### 🔐 Authentication System
- JWT token storage in localStorage
- Automatic token decoding and user role extraction
- Route guards for protected routes
- Automatic logout on token expiration

### 📱 Responsive Design
- Mobile-friendly interface
- Clean, modern UI with minimal styling
- Consistent button and form styling
- Modal dialogs for forms

### 📊 Data Management
- CRUD operations for all entities
- Real-time data updates
- Loading states and error handling
- Success/error message display

### 🎯 User Experience
- Intuitive navigation
- Form validation
- Confirmation dialogs for deletions
- Responsive feedback for all actions

## Development

### Running Tests
```bash
npm test
```

### Code Quality
The project uses Angular's built-in linting and follows Angular best practices:
- Standalone components
- TypeScript strict mode
- Proper error handling
- Consistent naming conventions

### Adding New Features
1. Create new component in `src/app/components/`
2. Add route in `src/app/app.routes.ts`
3. Create models in `src/app/models/`
4. Create services in `src/app/services/`
5. Update navigation if needed

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from `http://localhost:4200`
2. **API Connection**: Verify backend is running and accessible
3. **Build Errors**: Check Node.js and npm versions
4. **Routing Issues**: Ensure all components are properly imported

### Backend Requirements
- .NET 7.0
- SQL Server database
- JWT authentication configured
- CORS policy allowing frontend origin

## Contributing

1. Follow Angular coding standards
2. Use standalone components
3. Implement proper error handling
4. Add appropriate TypeScript types
5. Test all CRUD operations

## License

This project is part of the PatientVisitManager system.

## Support

For issues or questions:
1. Check the backend logs
2. Verify API endpoints are accessible
3. Check browser console for errors
4. Ensure all dependencies are installed

---

**Note**: This frontend application is designed to work with the PatientVisitManager .NET backend. Make sure the backend is running and properly configured before using the frontend.

