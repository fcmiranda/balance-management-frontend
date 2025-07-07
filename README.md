# Balance Management Frontend

A simple Angular v18 application with Jest testing framework.

## Features

- Angular v18 with standalone components
- Jest testing framework
- TypeScript configuration
- SCSS styling
- Responsive design
- Modern development setup

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

### Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Building

Build the project for production:
```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── home/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
├── index.html
├── main.ts
└── styles.scss
```

## Technologies Used

- **Angular**: v18.x
- **TypeScript**: v5.5.x
- **Jest**: v29.x
- **SCSS**: For styling
- **RxJS**: For reactive programming

## Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm run lint`: Run linter

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Run tests to ensure they pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
