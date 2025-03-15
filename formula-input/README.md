# Formula Input - Causal Clone

This project is a clone of Causal's formula input functionality, built with Next.js, Tailwind CSS, React Query, and Zustand.

## Features

- Formula input with support for variables, operators, and numbers
- Autocomplete suggestions for variables
- Dropdown menu for each variable tag
- Real-time formula calculation
- Responsive design

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and caching library
- **Zustand**: State management library

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Click on the formula input field
2. Start typing to search for variables
3. Select a variable from the suggestions
4. Add operators (+, -, *, /, ^) and numbers
5. See the calculated result in real-time
6. Click on a variable tag to select it
7. Click the dropdown button on a tag to see more options
8. Use the backspace key to delete items

## Project Structure

- `src/app`: Next.js app directory
- `src/components`: React components
- `src/store`: Zustand store
- `src/services`: API services
- `src/hooks`: Custom React hooks
- `src/utils`: Utility functions

## Implementation Details

- Used Zustand for managing the formula input state
- Used React Query for fetching and caching variable data
- Implemented a custom formula calculator
- Created reusable components for tags and autocomplete suggestions
- Added keyboard navigation support
- Implemented responsive design with Tailwind CSS

## Future Improvements

- Add support for more complex formulas
- Implement a proper formula parser/evaluator
- Add unit and integration tests
- Improve accessibility
- Add more keyboard shortcuts
- Implement drag-and-drop for reordering formula items
