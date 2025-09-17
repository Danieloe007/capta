# Contributing to Business Dates API

Thank you for your interest in contributing to the Business Dates API! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- AWS CLI configured with appropriate permissions
- AWS CDK CLI installed
- Git

### Setup Development Environment

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/Dagiiloe007/cp
   cd cp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Test deployment locally**
   ```bash
   npm run synth
   ```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with verbose output
npx ts-node test-local.ts
```

### Test Coverage
The project includes comprehensive tests covering:
- All specification examples
- Error handling and validation
- Edge cases (holidays, weekends, work hours)
- Timezone conversions
- Business logic validation

## 📝 Code Style

### TypeScript Guidelines
- Use explicit typing for all functions and interfaces
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Use meaningful variable and function names

### File Structure
```
src/
├── handler.ts              # Lambda entry point
├── services/
│   └── date.service.ts     # Core business logic
├── utils/
│   └── holidays.ts         # Holiday utilities
└── types/
    └── index.ts            # Type definitions
```

## 🔄 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following the established patterns
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Format
Follow conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `test:` test additions or modifications
- `refactor:` code refactoring
- `chore:` maintenance tasks

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, AWS region, etc.)
- Relevant logs or error messages

## 💡 Feature Requests

For new features:
- Describe the use case
- Explain the expected behavior
- Consider backward compatibility
- Provide examples if applicable

## 🔍 Code Review Process

1. All changes must be submitted via Pull Request
2. PRs require at least one approval
3. All tests must pass
4. Code must follow established style guidelines
5. Documentation must be updated for new features

## 📚 Documentation

### Updating Documentation
- Update README.md for user-facing changes
- Update CHANGELOG.md following semantic versioning
- Add JSDoc comments for new functions
- Update API examples if endpoints change

## 🚀 Deployment

### Testing Deployment
Before submitting PRs that affect infrastructure:

1. **Test CDK synthesis**
   ```bash
   npm run synth
   ```

2. **Test deployment (optional)**
   ```bash
   npm run deploy
   ```

3. **Clean up test resources**
   ```bash
   npm run destroy
   ```

## 📋 Pull Request Checklist

Before submitting a PR, ensure:
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New functionality includes tests
- [ ] Documentation is updated
- [ ] Commit messages follow conventional format
- [ ] No breaking changes (or clearly documented)
- [ ] PR description explains the changes

## 🤝 Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the code of conduct

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed information in issue descriptions

## 🏷️ Versioning

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

Thank you for contributing to Business Dates API! 🎉