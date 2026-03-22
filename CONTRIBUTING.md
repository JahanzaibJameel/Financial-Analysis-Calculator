# Contributing to Financial Analysis Calculator

Thank you for your interest in contributing to this project! This guide will help you get started.

## 🚀 Quick Start

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/financial-analysis-calculator.git
   cd financial-analysis-calculator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 📋 Development Workflow

### Before You Start

- [ ] Read the [Code of Conduct](./CODE_OF_CONDUCT.md)
- [ ] Check existing [Issues](https://github.com/your-username/financial-analysis-calculator/issues)
- [ ] Look at [Pull Requests](https://github.com/your-username/financial-analysis-calculator/pulls)

### Development Standards

#### Code Quality

- **TypeScript**: All new code must be written in TypeScript
- **ESLint**: Code must pass linting (`npm run lint`)
- **Prettier**: Code must be formatted (`npm run lint:fix`)
- **Tests**: New features must include tests (`npm run test`)

#### Git Conventions

- **Branch names**: `feature/description`, `fix/description`, `docs/description`
- **Commit messages**: Follow [Conventional Commits](https://www.conventionalcommits.org/)

  ```
  type(scope): description

  feat(calculator): add compound interest calculation
  fix(chatbot): resolve theme provider issue
  docs(readme): update installation guide
  ```

#### File Naming

- **Components**: PascalCase (`FinancialCalculator.tsx`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- **Unit Tests**: Test individual functions and utilities
- **Component Tests**: Test React components with user interactions
- **Integration Tests**: Test component interactions

```typescript
// Example test
import { render, screen } from '../utils/test-utils'
import MyComponent from '../components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── components/        # Page-specific components
│   ├── api/              # API routes
│   └── globals.css        # Global styles
├── components/              # Shared components
│   └── ui/               # Reusable UI components
├── utils/                  # Utility functions
├── __tests__/              # Test files
│   ├── components/        # Component tests
│   └── utils/            # Utility tests
└── types/                  # TypeScript type definitions
```

## 🚀 Submitting Changes

1. **Update your branch**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

2. **Create Pull Request**
   - Use descriptive title
   - Reference related issues
   - Include screenshots for UI changes
   - Add tests for new functionality

3. **Pull Request Template**

   ```markdown
   ## Description

   Brief description of changes

   ## Type of Change

   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing

   - [ ] All tests pass
   - [ ] New tests added
   - [ ] Manual testing completed

   ## Checklist

   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   ```

## 🐛 Bug Reports

When filing bug reports, please include:

- **Environment**: OS, browser, Node.js version
- **Reproduction Steps**: Clear steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable

## 💡 Feature Requests

- **Use Case**: Describe the problem you're trying to solve
- **Proposed Solution**: How you envision the feature
- **Alternatives**: Other approaches you considered
- **Additional Context**: Any relevant information

## 📧 Development Setup

### VS Code Extensions (Recommended)

- TypeScript Importer
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Jest Runner

### Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your API keys to `.env.local`
3. Never commit `.env.local` to version control

## 🎯 Code Review Process

### Reviewers Should Check

- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or clearly documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

### Author Guidelines

- [ ] Request review from at least one maintainer
- [ ] Address all review comments
- [ ] Keep PRs focused and small
- [ ] Update PR based on feedback

## 🏆 Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes for significant contributions
- Special thanks in project announcements

## 📞 Get Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas
- **Email**: For security issues (security@project.com)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Financial Analysis Calculator! 🎉
