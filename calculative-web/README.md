# Calculative Web Frontend

This is the frontend component of the Calculative financial planning toolkit, built with React and Vite.

## Features

- **IRR Calculator**: Calculate the true Internal Rate of Return for investment opportunities
- **Retirement Simulation**: Visualize your retirement funding scenarios
- **Portfolio Allocation**: Optimize investment distribution across different assets
- **Income/Expense Planning**: Manage and forecast income and expenses for financial planning

## Technology Stack

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Material UI](https://mui.com/) - Component library
- [Syncfusion](https://www.syncfusion.com/) - Advanced UI components for data visualization

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Calculative backend (optional but recommended for full functionality)

### Installation

1. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/lakwli/calculative.git
   cd calculative/calculative-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following:
   ```
   VITE_SYNCFUSION_LICENSE_KEY=your_license_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers for state management
- `src/models/` - Data models and type definitions
- `src/pages/` - Main page components
- `src/styles/` - CSS and styled components
- `src/utils/` - Utility functions
- `src/locales/` - Internationalization resources

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build locally

## Connection to Backend

By default, the application connects to the Calculative backend API for financial calculations. The API endpoint can be configured in the environment settings.

## Contributing

Please read the [Contributing Guide](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
