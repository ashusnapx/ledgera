# Ledgera

A modern, multi-tenant project management system built with Django, GraphQL, React, and TypeScript. Ledgera provides organization-based data isolation, real-time task management, and a clean, responsive interface for managing projects and tasks.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![Django](https://img.shields.io/badge/django-4.x-green.svg)
![React](https://img.shields.io/badge/react-18+-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- **Multi-tenant Architecture**: Complete organization-based data isolation ensuring secure data separation
- **Project Management**: Create, update, and track projects with status indicators and due dates
- **Task Management**: Comprehensive task tracking with assignments, statuses, and due dates
- **Comment System**: Collaborative commenting on tasks with timestamps and author tracking
- **Real-time Statistics**: Dynamic project statistics including task counts and completion rates

### Technical Features
- **GraphQL API**: Efficient data fetching with Graphene-Django
- **Type Safety**: Full TypeScript implementation on the frontend
- **Responsive Design**: Mobile-first design using TailwindCSS
- **Optimistic Updates**: Instant UI feedback with Apollo Client cache management
- **Error Handling**: Comprehensive error handling across backend and frontend
- **Dark Mode**: Built-in theme switching with next-themes

## 🛠 Tech Stack

### Backend
- **Framework**: Django 4.x
- **API Layer**: GraphQL (Graphene-Django)
- **Database**: PostgreSQL / SQLite (development)
- **Testing**: Pytest with Django integration

### Frontend
- **Framework**: Next.js 14 (React 18+)
- **Language**: TypeScript 5.x
- **State Management**: Apollo Client 3.x
- **Styling**: TailwindCSS with shadcn/ui components
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Package Management**: npm
- **Version Control**: Git

## 🏗 Architecture

### Backend Architecture
```
backend/
├── api/              # GraphQL schema, queries, and mutations
├── core/             # Shared utilities and base models
├── organizations/    # Organization models and business logic
├── projects/         # Project management
├── tasks/            # Task management
├── comments/         # Comment system
└── tests/            # Integration and unit tests
```

### Frontend Architecture
```
frontend/
├── app/              # Next.js app router pages
├── components/       # React components
│   └── ui/          # Reusable UI components (shadcn/ui)
├── context/          # React context providers
├── graphql/          # GraphQL queries and mutations
├── lib/              # Utilities and Apollo Client setup
└── types/            # TypeScript type definitions
```

### Data Model
```
Organization (1) ──────< (N) Project (1) ──────< (N) Task (1) ──────< (N) TaskComment
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **PostgreSQL**: 14.x or higher (optional for production)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ledgera.git
cd ledgera
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

#### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Environment Setup

#### Backend (.env)
Create a `.env` file in the `backend/` directory:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/ledgera
ALLOWED_HOSTS=localhost,127.0.0.1

# For SQLite (development)
# DATABASE_URL=sqlite:///db.sqlite3
```

#### Frontend
Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql/
```

## 💻 Usage

### Creating an Organization

1. Navigate to the application homepage
2. Click "Create Organization" in the top navigation
3. Fill in the organization details:
   - Name
   - Slug (auto-generated from name)
   - Contact Email
4. Submit the form

### Managing Projects

1. Select an organization from the dropdown
2. Click "New Project" to create a project
3. Fill in project details:
   - Name
   - Description
   - Status (Active, Completed, On Hold)
   - Due Date
4. View project statistics and task counts on the dashboard

### Managing Tasks

1. Select a project to view its tasks
2. Click "Add Task" to create a new task
3. Update task status by clicking on status badges
4. Assign tasks using email addresses
5. Add comments to tasks for collaboration

## 📚 API Documentation

### GraphQL Endpoint
```
http://localhost:8000/graphql/
```

### Available Queries

#### Get All Organizations
```graphql
query {
  allOrganizations {
    id
    name
    slug
    contactEmail
    createdAt
  }
}
```

#### Get Organization Projects
```graphql
query GetProjects($orgSlug: String!) {
  organizationProjects(orgSlug: $orgSlug) {
    id
    name
    description
    status
    dueDate
    taskCount
    completedTasks
    createdAt
  }
}
```

#### Get Project Tasks
```graphql
query GetTasks($projectId: ID!) {
  projectTasks(projectId: $projectId) {
    id
    title
    description
    status
    assigneeEmail
    dueDate
    createdAt
  }
}
```

### Available Mutations

#### Create Organization
```graphql
mutation CreateOrg($name: String!, $contactEmail: String!) {
  createOrganization(name: $name, contactEmail: $contactEmail) {
    organization {
      id
      name
      slug
    }
  }
}
```

#### Create Project
```graphql
mutation CreateProject($orgSlug: String!, $name: String!, $description: String, $status: String, $dueDate: Date) {
  createProject(
    orgSlug: $orgSlug
    name: $name
    description: $description
    status: $status
    dueDate: $dueDate
  ) {
    project {
      id
      name
      status
    }
  }
}
```

#### Create Task
```graphql
mutation CreateTask($projectId: ID!, $title: String!, $description: String, $status: String, $assigneeEmail: String) {
  createTask(
    projectId: $projectId
    title: $title
    description: $description
    status: $status
    assigneeEmail: $assigneeEmail
  ) {
    task {
      id
      title
      status
    }
  }
}
```

#### Add Comment
```graphql
mutation AddComment($taskId: ID!, $content: String!, $authorEmail: String!) {
  addComment(
    taskId: $taskId
    content: $content
    authorEmail: $authorEmail
  ) {
    comment {
      id
      content
      createdAt
    }
  }
}
```

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_multitenancy.py

# Run with verbose output
pytest -v
```

### Frontend Tests

```bash
cd frontend

# Run tests (if configured)
npm test

# Run linting
npm run lint
```

## 📁 Project Structure

### Backend Structure
```
backend/
├── api/
│   ├── mutations.py       # GraphQL mutations
│   ├── queries.py         # GraphQL queries
│   └── types.py           # GraphQL type definitions
├── config/
│   ├── settings.py        # Django settings
│   ├── schema.py          # Root GraphQL schema
│   └── urls.py            # URL configuration
├── core/
│   ├── models.py          # Base models
│   ├── querysets.py       # Custom querysets for multi-tenancy
│   └── organization.py    # Organization context management
├── organizations/
│   └── models.py          # Organization model
├── projects/
│   └── models.py          # Project model
├── tasks/
│   └── models.py          # Task model
├── comments/
│   └── models.py          # TaskComment model
└── tests/
    └── test_multitenancy.py  # Multi-tenancy tests
```

### Frontend Structure
```
frontend/
├── app/
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard page
│   └── providers.tsx      # Apollo Client provider
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── TopBar.tsx         # Navigation bar
│   ├── OrgSwitcher.tsx    # Organization selector
│   ├── CreateProjectDialog.tsx
│   ├── TaskList.tsx
│   └── CommentsPanel.tsx
├── context/
│   └── OrgContext.tsx     # Organization state management
├── graphql/
│   ├── queries.ts         # GraphQL query definitions
│   └── mutations.ts       # GraphQL mutation definitions
├── lib/
│   ├── apolloClient.ts    # Apollo Client configuration
│   └── utils.ts           # Utility functions
└── types/
    ├── project.ts         # Project type definitions
    └── task.ts            # Task type definitions
```

## 🎯 Design Decisions

### Multi-Tenancy Implementation
- **Organization-based isolation**: All queries and mutations are scoped to an organization using the organization slug
- **Custom querysets**: Implemented `OrganizationQuerySet` to automatically filter data by organization context
- **Middleware integration**: Organization context is managed through Django's request cycle

### GraphQL Over REST
- **Reduced over-fetching**: Clients request only the data they need
- **Type safety**: Strong typing from backend to frontend
- **Single endpoint**: Simplified API surface with introspection support
- **Efficient batching**: Multiple queries in a single request

### State Management Strategy
- **Apollo Client cache**: Centralized cache management with automatic updates
- **Optimistic updates**: Immediate UI feedback before server confirmation
- **React Context**: Organization-level state shared across components
- **Local component state**: Task and comment management within components

### UI/UX Decisions
- **shadcn/ui components**: Accessible, customizable, and production-ready components
- **Dark mode support**: System preference detection with manual override
- **Responsive design**: Mobile-first approach with Tailwind breakpoints
- **Loading states**: Skeleton screens and spinners for async operations

## 🔮 Future Improvements

### Backend Enhancements
- [ ] Add authentication and authorization (JWT/OAuth)
- [ ] Implement role-based access control (RBAC)
- [ ] Add GraphQL subscriptions for real-time updates
- [ ] Implement comprehensive logging and monitoring
- [ ] Add API rate limiting and throttling
- [ ] Set up Celery for background tasks
- [ ] Implement full-text search with PostgreSQL or Elasticsearch

### Frontend Enhancements
- [ ] Add drag-and-drop task reordering
- [ ] Implement Kanban board view
- [ ] Add file attachments to tasks
- [ ] Implement @mentions in comments
- [ ] Add notification system
- [ ] Implement advanced filtering and search
- [ ] Add data export functionality (CSV, PDF)
- [ ] Implement keyboard shortcuts

### DevOps & Infrastructure
- [ ] Docker Compose for local development
- [ ] Kubernetes deployment configurations
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Automated testing in CI
- [ ] Performance monitoring with Sentry or similar
- [ ] Database backup and recovery procedures
- [ ] CDN integration for static assets

### Testing & Quality
- [ ] Increase test coverage to 90%+
- [ ] Add E2E tests with Playwright
- [ ] Implement visual regression testing
- [ ] Add performance testing
- [ ] Set up automated accessibility testing

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint and Prettier for TypeScript/React code
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Django](https://www.djangoproject.com/) - Backend framework
- [Graphene-Django](https://docs.graphene-python.org/projects/django/) - GraphQL integration
- [Next.js](https://nextjs.org/) - React framework
- [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL client
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

---

**Built with ❤️ by Ashutosh Kumar**

For questions or support, please open an issue or contact [ashu.kumarexam@gmail.com]