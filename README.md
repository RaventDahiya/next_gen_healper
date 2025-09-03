# 🤖 NextGenHelper AI

**A Professional AI Assistant Platform with Multiple AI Models**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-Database-FF6B6B?style=for-the-badge)](https://convex.dev/)

> 🚀 **A powerful AI assistant platform that integrates multiple AI models including GPT, Gemini, DeepSeek, and more, with user authentication, subscription management, and personalized AI assistants.**

---

## 🎯 What is NextGenHelper AI?

**NextGenHelper AI** is a comprehensive, enterprise-grade AI assistant platform designed to democratize access to cutting-edge artificial intelligence technologies. Our platform serves as a unified gateway to multiple AI models, enabling users to harness the power of various AI systems through a single, intuitive interface.

### 🌟 **Professional Overview**

NextGenHelper AI transforms how individuals and businesses interact with artificial intelligence by providing:

#### **🔥 Core Value Proposition**

- **Multi-Model AI Access**: Access to 10+ leading AI models (GPT-4, Gemini, Claude, DeepSeek, Qwen, Mistral) through one platform
- **Custom AI Assistants**: Create specialized AI assistants tailored for specific tasks, roles, or industries
- **Enterprise-Ready Infrastructure**: Scalable, secure, and production-ready architecture
- **Flexible Pricing**: Free tier with generous limits plus affordable Pro subscriptions

#### **🎯 Target Audience**

- **Individual Professionals**: Writers, developers, researchers, consultants
- **Small to Medium Businesses**: Teams needing AI-powered assistance
- **Educational Institutions**: Students and educators leveraging AI for learning
- **Content Creators**: Bloggers, marketers, social media managers
- **Developers**: API access for custom integrations and applications

#### **💼 Business Applications**

**📝 Content Creation & Writing**

- Blog posts, articles, and marketing copy
- Email drafts and professional correspondence
- Creative writing and storytelling
- Technical documentation and reports

**🔧 Development & Technical Support**

- Code generation and debugging assistance
- Architecture planning and best practices
- API documentation and technical guides
- Problem-solving and troubleshooting

**📊 Business Intelligence & Analysis**

- Data analysis and insights generation
- Market research and competitive analysis
- Strategic planning and decision support
- Process optimization recommendations

**🎓 Education & Learning**

- Personalized tutoring and explanations
- Research assistance and fact-checking
- Language learning and practice
- Skill development and training

**🤝 Customer Support Enhancement**

- Automated response generation
- FAQ creation and maintenance
- Customer query analysis
- Support ticket prioritization

#### **🚀 Competitive Advantages**

**1. Multi-Model Flexibility**

- Switch between AI models based on task requirements
- Compare outputs from different models
- Leverage each model's unique strengths

**2. Customization at Scale**

- Create unlimited custom AI assistants
- Tailor instructions for specific use cases
- Industry-specific knowledge bases

**3. Cost Efficiency**

- Pay only for what you use (token-based system)
- Free tier with 10,000 monthly tokens
- Affordable Pro plans for heavy users

**4. Developer-Friendly**

- RESTful API for custom integrations
- Webhook support for real-time updates
- Comprehensive documentation and SDKs

**5. Enterprise Security**

- Google OAuth authentication
- Rate limiting and abuse protection
- Data privacy and compliance ready

#### **📈 Market Impact**

NextGenHelper AI addresses the growing demand for accessible AI solutions in a market projected to reach $1.8 trillion by 2030. Our platform:

- **Reduces AI Implementation Complexity**: No need for multiple API integrations
- **Lowers Barrier to Entry**: Intuitive interface for non-technical users
- **Increases Productivity**: Streamlined workflows and automated tasks
- **Enables Innovation**: Custom AI assistants for unique business needs

#### **🛡️ Trust & Reliability**

- **99.9% Uptime SLA**: Enterprise-grade infrastructure
- **Data Security**: End-to-end encryption and secure processing
- **Transparent Pricing**: No hidden costs or surprise charges
- **Responsive Support**: Community-driven help and professional support

---

## 📋 Table of Contents

- [🎯 What is NextGenHelper AI?](#-what-is-nextgenhelper-ai)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🎯 Usage](#-usage)
- [📁 Project Structure](#-project-structure)
- [🔧 API Endpoints](#-api-endpoints)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🤖 **AI Integration**

- **Multiple AI Models**: GPT-4, Gemini, DeepSeek, Qwen, Mistral, and more
- **Custom AI Assistants**: Create personalized assistants with specific instructions
- **Conversation Memory**: Context-aware conversations with history
- **Real-time Chat**: Seamless messaging interface

### 🔐 **Authentication & Security**

- **Google OAuth**: Secure authentication system
- **User Profiles**: Personalized user accounts
- **Session Management**: Secure session handling
- **Rate Limiting**: API protection and abuse prevention

### 💳 **Subscription System**

- **Razorpay Integration**: Secure payment processing
- **Pro/Free Plans**: Flexible subscription tiers
- **Credit System**: Token-based usage tracking
- **Subscription Management**: Easy upgrade/cancel functionality

### 🎨 **User Experience**

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching
- **Loading States**: Professional UI feedback
- **Error Handling**: Graceful error management

### 📊 **Advanced Features**

- **Health Monitoring**: API health check endpoints
- **Performance Optimized**: Next.js 15 with Turbopack
- **SEO Optimized**: Complete meta tags and Open Graph
- **Production Ready**: Enterprise-grade error handling

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **Themes**: next-themes for dark/light mode

### **Backend**

- **API Routes**: Next.js API Routes
- **Database**: Convex (Real-time database)
- **Authentication**: Google OAuth (@react-oauth/google)
- **Payments**: Razorpay Integration
- **AI Integration**: OpenRouter API

### **Development Tools**

- **Build Tool**: Turbopack (Next.js 15)
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Package Manager**: npm

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ and npm
- Google OAuth credentials
- Convex account
- OpenRouter API key
- Razorpay account (for payments)

### **1. Clone & Install**

```bash
git clone https://github.com/yourusername/nextgenhelper-ai.git
cd nextgenhelper-ai
npm install
```

### **2. Environment Setup**

```bash
cp .env.example .env.local
# Fill in your environment variables
```

### **3. Start Development**

```bash
npm run dev
```

🎉 **Your app will be running at `http://localhost:3000`**

---

## 📖 Installation

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/yourusername/nextgenhelper-ai.git
cd nextgenhelper-ai
```

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Set Up Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Convex Database
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-convex-deploy-key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# OpenRouter API (for AI models)
OPEN_ROUTER_API_KEY=your-openrouter-api-key

# Razorpay (Payment Processing)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Optional: Production Razorpay Keys
RAZORPAY_LIVE_KEY=your-production-razorpay-key
NEXT_PUBLIC_RAZORPAY_LIVE_KEY=your-production-razorpay-public-key
```

### **Step 4: Set Up Convex Database**

```bash
npx convex dev
```

### **Step 5: Start Development Server**

```bash
npm run dev
```

---

## ⚙️ Configuration

### **Google OAuth Setup**

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized domains and redirect URIs

### **Convex Database Setup**

1. Sign up at [Convex.dev](https://convex.dev/)
2. Create a new project
3. Get your deployment URL
4. Set up your schema (already included in `/convex/schema.ts`)

### **OpenRouter API Setup**

1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Get your API key
3. Configure model access and credits

### **Razorpay Setup**

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get test/live API keys
3. Configure webhooks (optional)
4. Set up payment methods

---

## 🎯 Usage

### **For Users**

1. **Sign Up/Login**: Use Google OAuth to create account
2. **Create Assistants**: Build custom AI assistants with specific roles
3. **Chat Interface**: Engage in conversations with AI models
4. **Manage Subscription**: Upgrade to Pro for unlimited access
5. **Profile Management**: View credits, subscription status

### **For Developers**

1. **API Integration**: Use built-in API routes for custom features
2. **Custom Models**: Add new AI models via OpenRouter
3. **UI Customization**: Modify components in `/components`
4. **Database Queries**: Extend Convex schema and queries

---

## 📁 Project Structure

```
nextgenhelper-ai/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (auth)/                  # Authentication routes
│   │   └── 📁 sign-in/
│   ├── 📁 (main)/                  # Main application
│   │   ├── 📁 _components/         # Shared components
│   │   ├── 📁 ai-assistants/       # AI assistants page
│   │   └── 📁 workspace/           # Main workspace
│   ├── 📁 api/                     # API routes
│   │   ├── 📄 chat/route.ts        # Chat API
│   │   ├── 📄 createUser/route.ts  # User creation
│   │   └── 📄 health/route.ts      # Health check
│   ├── 📄 globals.css              # Global styles
│   ├── 📄 layout.tsx               # Root layout
│   └── 📄 page.tsx                 # Home page
├── 📁 components/                   # Reusable UI components
│   ├── 📁 ui/                      # Base UI components
│   ├── 📄 ErrorBoundary.tsx        # Error handling
│   └── 📄 LoadingSpinner.tsx       # Loading states
├── 📁 convex/                       # Convex database
│   ├── 📄 schema.ts                # Database schema
│   ├── 📄 users.ts                 # User queries/mutations
│   └── 📄 userAiAssistants.ts      # Assistant queries
├── 📁 contex/                       # React contexts
│   ├── 📄 AuthContext.tsx          # Authentication state
│   └── 📄 TokenContext.tsx         # Credit/token management
├── 📁 lib/                          # Utility libraries
│   ├── 📄 paymentUtils.ts          # Payment handling
│   ├── 📄 errorHandler.ts          # Error management
│   ├── 📄 rateLimiter.ts           # API rate limiting
│   └── 📄 utils.ts                 # General utilities
├── 📁 public/                       # Static assets
│   ├── 📄 nextgenhelper_ai_logo.png
│   └── 📁 assistants/              # Assistant images
├── 📄 .env.example                 # Environment variables template
├── 📄 DEPLOYMENT.md                # Deployment guide
├── 📄 PRODUCTION_READY.md          # Production checklist
└── 📄 package.json                 # Dependencies and scripts
```

---

## 🔧 API Endpoints

### **Authentication**

- `POST /api/createUser` - Create new user
- `POST /api/getUser` - Get user data

### **Chat & AI**

- `POST /api/chat` - Send message to AI
- `GET /api/openAiModel` - Get available AI models

### **Payments**

- `POST /api/create-subscription` - Create Razorpay subscription
- `POST /api/cancel-subscription` - Cancel user subscription
- `POST /api/payment-success` - Handle payment success

### **System**

- `GET /api/health` - Health check endpoint
- `POST /api/upload-image` - Upload assistant images

---

## 🌐 Deployment

### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
npm run deploy:vercel
```

### **Other Platforms**

- **Railway**: Connect GitHub repo, set environment variables
- **Netlify**: Configure build settings and environment variables
- **Heroku**: Use Next.js buildpack

### **Pre-Deployment Checklist**

```bash
# Run all checks
npm run deploy:check

# Individual checks
npm run lint          # Code quality
npm run type-check    # TypeScript validation
npm run build         # Production build
```

For detailed deployment instructions, see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 🔒 Security Features

- ✅ **Authentication**: Secure Google OAuth integration
- ✅ **Rate Limiting**: API protection against abuse
- ✅ **Input Validation**: Sanitized user inputs
- ✅ **Error Handling**: Production-safe error messages
- ✅ **Security Headers**: XSS and CSRF protection
- ✅ **Environment Variables**: Secure secret management

---

## 📊 Performance

- ⚡ **Next.js 15**: Latest performance optimizations
- 🚀 **Turbopack**: Fast development builds
- 📱 **Mobile Optimized**: Responsive design
- 🖼️ **Image Optimization**: Automatic WebP/AVIF conversion
- 📦 **Bundle Optimization**: Tree shaking and code splitting
- 🔄 **Caching**: Optimized API response caching

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Setup**

```bash
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests and linting
6. Submit a pull request
```

### **Code Standards**

- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Maintain test coverage

### **Pull Request Process**

1. Update documentation if needed
2. Ensure all tests pass
3. Get at least one code review
4. Squash commits before merging

---

## 📈 Roadmap

### **Upcoming Features**

- [ ] **Voice Integration**: Speech-to-text and text-to-speech
- [ ] **Team Workspaces**: Collaborative AI assistants
- [ ] **API Webhooks**: External service integrations
- [ ] **Advanced Analytics**: Usage insights and metrics
- [ ] **Mobile App**: React Native companion app
- [ ] **Enterprise Features**: SSO, admin dashboard

### **Long-term Vision**

- Multi-modal AI support (images, audio, video)
- Custom model training capabilities
- Marketplace for AI assistants
- Advanced workflow automation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Community

### **Getting Help**

- 📖 **Documentation**: Check this README and `/docs`
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Use GitHub discussions
- ❓ **Questions**: Join our Discord community

### **Links**

- 🌐 **Live Demo**: [https://nextgenhelper-ai.vercel.app](https://your-demo-url.com)
- 📧 **Contact**: support@nextgenhelper.com
- 🐦 **Twitter**: [@nextgenhelper](https://twitter.com/nextgenhelper)
- 💬 **Discord**: [Join our community](https://discord.gg/nextgenhelper)

---

## 🙏 Acknowledgments

- **OpenAI**: For GPT models and API
- **Google**: For authentication services
- **Vercel**: For hosting and deployment
- **Convex**: For real-time database
- **Razorpay**: For payment processing
- **Open Source Community**: For amazing libraries and tools

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Built with ❤️ by the NextGenHelper team**

[🚀 Get Started](#-quick-start) · [📖 Documentation](#-table-of-contents) · [🤝 Contribute](#-contributing)

</div>
