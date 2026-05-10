# Contributing to TaskFlow

First off, thank you for considering contributing to TaskFlow!

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/AliNaseem123456789/IDoneThis/issues)
- Use the bug report template (if available)
- Include detailed steps to reproduce
- Mention your environment (OS, browser, Node version)

### Suggesting Enhancements

- Open an issue with the "enhancement" label
- Clearly describe the feature and its benefits
- Provide examples of how it would work

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

### Prerequisites

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | v18+ | [nodejs.org](https://nodejs.org/) |
| Python | 3.10+ | [python.org](https://python.org/) |
| Supabase Account | Free tier | [supabase.com](https://supabase.com) |
| Groq API Key | Free tier | [console.groq.com](https://console.groq.com) |

### Backend Setup

```bash
# Clone repository
git clone https://github.com/AliNaseem123456789/IDoneThis
cd IDoneThis/backend

npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

### AI Service
```bash
cd chatbot
python main.py  
```

### Commit Changess
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# AI service tests
cd chatbot && pytest
```


## Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code change |
| `test` | Add tests |

### Push & Create PR

```bash
git push origin your-branch-name
```


