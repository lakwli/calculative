# Calculative

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Calculative is a financial planning toolkit that helps you make smarter investment decisions through data-driven analysis. This project consists of a modern React-based web application and a powerful Python Flask backend for financial calculations.

## Features

### IRR Calculator
Calculate the true Internal Rate of Return (IRR) for investment opportunities by analyzing:
- Multi-phase investment returns
- Periodic contributions and withdrawals
- One-time or recurring cashflows
- Verification tables to validate investment performance

### Retirement Simulation (Simple)
Plan your retirement with our simple simulator that helps you understand:
- Portfolio longevity based on withdrawal rates
- Impact of different investment return types
- Effects of inflation over time
- Asset allocation strategies

### Portfolio Allocation
Optimize your investment portfolio with:
- Multiple fund type support (cash, market index, specific tickers)
- Custom allocation percentages
- Rebalancing strategies
- Dividend tax considerations

## Project Structure

The project is organized into three main components:

```
calculative/
├── calculative-web/     # React frontend application
├── calculative-backend/ # Flask backend API
└── calculative-oldweb/  # Legacy web interface
```

### Frontend (calculative-web)
- Built with React and Material-UI
- Vite for fast development and optimized builds
- Interactive financial calculators and visualizations

### Backend (calculative-backend)
- Flask-based REST API
- Financial calculation engine
- Market data processing
- Historical performance analysis

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/lakwli/calculative.git
   cd calculative
   ```

2. Install dependencies for the web interface:
   ```bash
   cd calculative-web
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the calculative-web directory with:
   ```
   VITE_SYNCFUSION_LICENSE_KEY=your_license_key  # Optional, for extended features
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd calculative-backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables by creating a `.env` file:
   ```
   FLASK_ENV=development
   SECRET_KEY=your-secret-key
   CORS_ORIGINS=http://localhost:3000
   ```

5. Start the backend server:
   ```bash
   python run.py
   ```

## Docker Deployment

For containerized deployment, use the included Docker configurations:

```bash
docker-compose up -d
```

This will start both the frontend and backend services.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security considerations when deploying, see the [backend README](calculative-backend/README.md#security-notes).