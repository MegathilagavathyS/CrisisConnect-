# Overview

This is an Intelligent Location Finder and Crisis Resource Dashboard designed for disaster management. The system extracts and standardizes place names from multilingual, unstructured text reports (SMS, social media, PDFs), resolves ambiguous locations using contextual clues, and provides real-time resource shortage analysis. It combines Natural Language Processing (NLP), geospatial intelligence, and humanitarian datasets into a unified platform with map visualization and AI chatbot interaction.

**Enhanced Multilingual Support**: The system now supports comprehensive location extraction across multiple Indian languages and scripts including Hindi (Devanagari), Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi (Gurmukhi), and Oriya scripts, with over 250 location mappings covering states, cities, abbreviations, misspellings, and regional variations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI components with shadcn/ui for consistent design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js loaded dynamically for resource visualization
- **Maps**: Leaflet for interactive mapping functionality

## Backend Architecture

**Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints following `/api/*` convention
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod schemas for runtime type checking
- **Error Handling**: Centralized error middleware with structured responses

## Data Storage Solutions

**Database**: PostgreSQL configured through Drizzle ORM
- **Connection**: Neon Database serverless driver
- **Migration Strategy**: Drizzle Kit for schema management
- **Schema Design**: 
  - `locations` table for standardized geographic data
  - `reports` table for original text and extracted information
  - `resources` table for capacity and availability tracking
  - `chat_messages` table for conversational AI history

## Authentication and Authorization

Currently implements a basic storage interface with in-memory fallback, designed to be extended with proper authentication mechanisms. The system includes user schema but authentication is not yet implemented.

## External Service Integrations

**AI/NLP Processing**:
- Cohere API for natural language understanding and chatbot responses
- Advanced multilingual NLP service supporting 9 Indian language scripts (Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Oriya)
- Comprehensive location mapping with 250+ entries covering abbreviations, misspellings, regional variations, and local names
- Script detection and Unicode-aware text preprocessing for accurate multilingual processing
- Enhanced fuzzy matching algorithms with confidence scoring for location disambiguation

**Geospatial Services**:
- Coordinate lookup functionality for location positioning
- Map visualization through Leaflet integration
- Geographic data processing for Indian states and cities

**Development Tools**:
- Replit integration for cloud development environment
- Hot module replacement for development workflow
- Runtime error overlay for debugging

## Key Design Patterns

**Shared Schema Pattern**: Common TypeScript types and Zod schemas in `/shared` directory ensure consistency between frontend and backend

**Component Composition**: Modular React components with clear separation of concerns (location extraction, resource visualization, chatbot interaction)

**Progressive Enhancement**: Core functionality works with fallbacks for external services (Chart.js, Leaflet loaded dynamically)

**Type Safety**: End-to-end TypeScript with runtime validation using Zod schemas

**Responsive Design**: Mobile-first approach with Tailwind CSS responsive utilities

# External Dependencies

- **Neon Database**: Serverless PostgreSQL hosting
- **Cohere API**: AI language model for chatbot and NLP processing
- **Chart.js**: Dynamic chart visualization (loaded via CDN)
- **Leaflet**: Interactive mapping library (loaded via CDN)
- **Radix UI**: Headless component library for accessible UI primitives
- **TanStack Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL