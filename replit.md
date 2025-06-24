# Veeduría Nacional de Salud - Sistema de Quejas

## Overview

This is a complaint management system for the National Health Oversight Board of Colombia (Veeduría Nacional por el Derecho a la Salud del Magisterio). The system allows citizens to submit health-related complaints through a web interface, with automated email notifications and content filtering capabilities.

The application is built as a Node.js web server with vanilla HTML/CSS/JavaScript frontend, featuring complaint submission, administrative panels, and email notification services.

## System Architecture

### Frontend Architecture
- **Technology**: Vanilla HTML, CSS, and JavaScript
- **Compatibility**: Includes polyfills for Internet Explorer support
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Pages**:
  - `index.html`: Main complaint submission interface
  - `admin.html`: Administrative panel for managing complaints
  - Multiple backup HTML files for development/testing

### Backend Architecture
- **Runtime**: Node.js 20
- **Framework**: Native HTTP server (no Express framework used yet, though Express is in dependencies)
- **Entry Point**: `app.js` → `servidor.js`
- **Architecture Pattern**: Monolithic server with modular services

### Key Technologies
- **Node.js**: Server runtime
- **HTTP Module**: Core web server functionality
- **Multer**: File upload handling (configured for 5MB max)
- **bcryptjs**: Password hashing for user authentication
- **nodemailer**: Email service integration

## Key Components

### 1. Main Server (`servidor.js`)
- HTTP server implementation
- Request routing and handling
- File upload management
- User authentication system
- In-memory data storage (users, complaints)
- Integration with Google Forms for complaint submission

### 2. Email Service (`email-service.js`)
- Automated email notifications
- Department-specific email routing
- Integration with nodemailer
- Complaint notification system

### 3. Content Filtering (`filtro-quejas.js`)
- Advanced profanity and inappropriate content detection
- Multi-level sensitivity filtering
- Automatic content correction suggestions
- Supports Spanish language offensive content detection

### 4. File Upload System
- Multer-based file handling
- 5MB file size limit
- Uploads stored in `/uploads` directory
- Support for complaint attachments

## Data Flow

1. **Complaint Submission**:
   - User fills form on `index.html`
   - Content filtered through `filtro-quejas.js`
   - Files uploaded via multer
   - Data stored in memory arrays
   - Email notifications sent via `email-service.js`
   - Optional Google Forms integration

2. **Administrative Access**:
   - Admin authentication via `admin.html`
   - Complaint management and review
   - Configuration of email recipients by department

3. **Email Notifications**:
   - Department-specific routing
   - Automated complaint forwarding
   - Internal notification system

## External Dependencies

### Core Dependencies
- **@sendgrid/mail**: Email service integration
- **nodemailer**: Alternative email service
- **multer**: File upload handling
- **bcryptjs**: Password hashing

### Database Dependencies (Not Yet Implemented)
- **drizzle-orm**: ORM for database operations
- **drizzle-kit**: Database migration toolkit
- **@neondatabase/serverless**: Serverless database connection

### Development Dependencies
- **vite**: Build tool for frontend assets
- **typescript**: Type checking
- **tailwindcss**: CSS framework (configured but not actively used)

## Deployment Strategy

### Environment Configuration
- **Platform**: Replit with PostgreSQL 16 module
- **Port**: Application runs on port 5000
- **Build Process**: `npm run build` (Vite-based)
- **Production Command**: `npm run start`
- **Development Command**: `npm run dev`

### Deployment Target
- **Type**: Autoscale deployment
- **External Port**: 80 (mapped from internal 5000)
- **File Exclusions**: `.config`, `.git`, `node_modules`, `dist`

### Database Setup
- PostgreSQL 16 module configured in Replit
- Drizzle ORM ready for implementation
- Database schemas not yet implemented (using in-memory storage)

## Changelog

```
Changelog:
- June 24, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Notes for Development

1. **Database Migration Needed**: The application currently uses in-memory storage but has Drizzle ORM configured for PostgreSQL migration
2. **Google Forms Integration**: The system includes integration with Google Apps Script for form submission
3. **Content Filtering**: Advanced Spanish language profanity filtering is implemented
4. **Email Configuration**: Department-specific email routing is configured for Colombian departments
5. **File Management**: Upload directory needs to be created for file attachments
6. **Security**: Basic authentication is implemented, but may need enhancement for production use