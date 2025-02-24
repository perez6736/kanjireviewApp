# Kanji Review App - Functional Specification

## Overview

The Kanji Review App helps users study kanji through three modes: Jouyou, JLPT, and Frequency. Users can select kanji based on difficulty levels and receive detailed performance feedback after each review session.

## Tech Stack

- Frontend: React Native with TypeScript, Expo, and Expo Router
- Backend/Database: Supabase
- UI Framework: React Native Paper

## App Flow

### 1. Welcome Screen

#### Elements

- App logo
- Mode selection buttons:
  - Jouyou
  - JLPT
  - Frequency
- Clear app title/purpose indication

#### User Interaction

Users select one of three study modes to configure their review session.

### 2. Kanji Selection Screen

#### Elements

- Configuration options:
  - Number of kanji to review
  - Difficulty level selection:
    - **Jouyou**: Grade 1-6, Secondary School
    - **JLPT**: N5-N1 levels
    - **Frequency**: Top 100 or 500 most frequent
- "Start Review" button

#### User Interaction

Users set their preferences and begin the review session.

### 3. Kanji Review Screen

#### Elements

- Single kanji display
- Interactive quiz components
- Navigation controls:
  - Next/Previous buttons
  - "Finish Review" button

#### User Interaction

Users progress through kanji reviews according to their chosen study mode.

### 4. Results Screen

#### Elements

- Performance summary:
  - Correct/incorrect counts
  - Score percentage
  - Reviewed kanji list
- Interactive kanji display with:
  - Meaning
  - Readings (Onyomi/Kunyomi)
  - Stroke order
  - Example words

#### User Interaction

- Review performance statistics
- Access detailed kanji information via hover modals
- Option to start new review session

## Technical Implementation

### API Integration

- Dynamic kanji data fetching
- Comprehensive study material retrieval

### User Experience

- Smooth screen transitions
- Responsive design (desktop/mobile)
- Consistent visual theming

### Development Considerations

- **State Management**: Efficient tracking of user selections and progress
- **Modal System**: Non-disruptive information display
- **API Optimization**: Implement caching for performance
- **Navigation**: Intuitive movement between screens

## Database Schema

### Users Table
