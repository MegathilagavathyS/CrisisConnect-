# Geospatial Query System

A comprehensive natural language processing system for identifying and mapping geospatial entities from text input.

## Overview

This system automatically identifies names of places from natural language sentences and maps them to canonical names from predefined tables (Country, City, State). It handles spelling errors, multiple variations, and provides fuzzy matching capabilities.

## Features

- **Natural Language Processing**: Filters out non-place words and focuses on geospatial entities
- **Fuzzy Matching**: Handles spelling errors and variations using Levenshtein distance
- **Canonical Name Mapping**: Maps various spellings to standardized names
- **Multi-table Support**: Organizes places into Country, City, and State categories
- **Confidence Scoring**: Provides confidence levels for each identified entity
- **Formatted Output**: Returns structured results in the specified format

## API Endpoint

### POST /api/geospatial-query

**Request Body:**
```json
{
  "query": "Which of the following saw the highest average temperature in January, Maharashtra, Ahmedabad or entire New-Zealand?"
}
```

**Response:**
```json
{
  "query": "Which of the following saw the highest average temperature in January, Maharashtra, Ahmedabad or entire New-Zealand?",
  "entities": [
    {
      "token": "maharashtra",
      "canonicalName": "maharashtra",
      "table": "State",
      "confidence": 0.9
    },
    {
      "token": "ahmedabad",
      "canonicalName": "ahmedabad",
      "table": "City",
      "confidence": 0.9
    },
    {
      "token": "new-zealand",
      "canonicalName": "new zealand",
      "table": "Country",
      "confidence": 0.95
    }
  ],
  "formattedOutput": "Token: maharashtra, Canonical name: maharashtra, table: State\nToken: ahmedabad, Canonical name: ahmedabad, table: City\nToken: new-zealand, Canonical name: new zealand, table: Country",
  "entityCount": 3
}
```

## Example Usage

### Input Examples

1. **Question Format:**
   - "Which of the following saw the highest average temperature in January, Maharashtra, Ahmedabad or entire New-Zealand?"
   
2. **Imperative Format:**
   - "Show me a graph of rainfall for Chennai for the month of October"

3. **Comparison Format:**
   - "Compare population density between California, Texas and New York"

4. **Query Format:**
   - "What's the weather like in Mumbai, Delhi and Bangalore?"

### Expected Output Format

For the input: "Which of the following saw the highest average temperature in January, Maharashtra, Ahmedabad or entire New-Zealand?"

```
Token: maharashtra, Canonical name: maharashtra, table: State
Token: ahmedabad, Canonical name: ahmedabad, table: City
Token: new-zealand, Canonical name: new zealand, table: Country
```

## System Architecture

### Backend Components

1. **Geospatial Query Service** (`server/services/geospatial-query.ts`)
   - Core entity recognition logic
   - Fuzzy matching algorithms
   - Canonical name mapping

2. **API Endpoint** (`server/routes.ts`)
   - RESTful API for processing queries
   - Error handling and validation

3. **Canonical Place Database**
   - Predefined tables for Countries, Cities, and States
   - Multiple aliases and variations for each place

### Frontend Components

1. **Geospatial Query Component** (`client/src/components/geospatial-query.tsx`)
   - User interface for entering queries
   - Results display with confidence scores
   - Visual categorization by entity type

2. **Dashboard Integration**
   - Tabbed interface alongside existing location extraction
   - Seamless integration with existing CrisisConnect features

## Technical Implementation

### Fuzzy Matching Algorithm

The system uses Levenshtein distance for fuzzy matching:
- **Threshold**: 60% similarity minimum
- **Confidence Calculation**: Based on similarity score
- **Multi-word Support**: Handles 2-3 word phrases

### Entity Recognition Process

1. **Text Preprocessing**
   - Tokenization and normalization
   - Removal of non-place words
   - Case handling for different scripts

2. **Direct Matching**
   - 3-word phrase matching
   - 2-word phrase matching
   - Single word matching

3. **Fuzzy Matching**
   - Similarity calculation against canonical names
   - Confidence scoring
   - Duplicate removal

### Canonical Place Tables

#### Countries
- India, United States, United Kingdom, Canada, Australia, New Zealand, etc.

#### States
- Indian states: Maharashtra, Tamil Nadu, Karnataka, etc.
- US states: California, Texas, New York, etc.

#### Cities
- Major cities: Ahmedabad, Mumbai, Delhi, Bangalore, Chennai, etc.

## Testing

Run the test suite to verify functionality:

```bash
cd server
npx tsx services/test-geospatial.ts
```

## Usage in CrisisConnect

The geospatial query system is integrated into the main dashboard:

1. Navigate to the CrisisConnect dashboard
2. Click on the "Query" tab in the sidebar
3. Enter your natural language query
4. View the identified entities with confidence scores
5. See the formatted output in the specified format

## Error Handling

- **Invalid Input**: Returns 400 status for missing or invalid query text
- **Processing Errors**: Returns 500 status for internal errors
- **No Entities Found**: Returns appropriate message when no geospatial entities are detected

## Performance Considerations

- **Efficient Algorithm**: Optimized Levenshtein distance calculation
- **Caching**: Canonical place database loaded in memory
- **Scalable**: Designed to handle large volumes of queries

## Future Enhancements

- **Real-time Geocoding**: Integration with geocoding APIs
- **Multi-language Support**: Extended support for more languages and scripts
- **Machine Learning**: Advanced NLP models for better accuracy
- **Database Integration**: Dynamic place name databases
