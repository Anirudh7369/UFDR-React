# ForensicAnalyst AI - Frontend

A modern React-based frontend for the ForensicAnalyst AI system, designed for digital forensics professionals to analyze UFDR reports through an intuitive chat interface.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Clone the repository
git clone <https://github.com/Anirudh7369/UFDR-React.git>
cd UFDR-React

# Install dependencies
npm install

# Start the development server
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── LoginPage.jsx    # Authentication page
│   ├── LandingPage.jsx  # Welcome/landing page
│   ├── AppLayout.jsx    # Main chat layout
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── MainContent.jsx  # Chat interface content
│   ├── UserMessage.jsx  # User message component
│   ├── AIMessage.jsx    # AI response component (legacy)
│   ├── AIMessageWithTyping.jsx  # AI response with typing effect
│   ├── ResultCard.jsx   # Analysis result cards
│   ├── ChatLayout.jsx   # Chat interface layout
│   └── NewChatLayout.jsx # Fresh chat layout
├── styles/
│   └── index.css        # Global styles and Tailwind
├── App.js              # Main application router
└── index.js            # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: `#9333ea` (Purple)
- **Background Dark**: `#121212`
- **Surface Dark**: `#1e1e1e`
- **Accent Dark**: `#2a2a2a`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800, 900

### UI Framework
- **Tailwind CSS**: Utility-first CSS framework
- **Material Symbols**: Google's icon font
- **React Markdown**: For rendering AI responses

## 🛠 Key Technologies

- **React 18**: Frontend framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling framework
- **Material Symbols**: Icon system
- **React Markdown**: Markdown rendering
- **Fetch API**: HTTP client for backend communication

## 📱 Application Flow

### Authentication Flow
1. **Login Page** (`/`) → User authentication
2. **Landing Page** (`/landing`) → Welcome screen with upload button
3. **Dashboard** (`/dashboard`) → Main chat interface

### Chat System
- **New Chat** (`/new-chat`) → Fresh conversation with welcome screen
- **Existing Chat** → Persistent conversation state
- **Message Flow**: User input → API call → Typing effect response

## 🔧 Component Architecture

### Core Layout Components

#### `App.js`
- Main application router
- Handles global styling and dark mode
- Route configuration

#### `Sidebar.jsx`
- Navigation component
- Logo/branding
- "New Chat" button
- Recent chat history
- Navigation between routes

#### `MainContent.jsx`
- Central chat interface
- Message state management
- API communication
- User input handling
- Welcome screen when no messages

### Message Components

#### `UserMessage.jsx`
```jsx
<UserMessage message="Your message content" />
```
- Displays user messages
- User avatar (JD initials)
- Message bubble styling

#### `AIMessageWithTyping.jsx`
```jsx
<AIMessageWithTyping fullContent="AI response in markdown" />
```
- AI responses with typing animation
- Markdown rendering support
- Character-by-character reveal effect
- Custom markdown styling for dark theme

#### `ResultCard.jsx`
```jsx
<ResultCard 
  title="Analysis Title"
  description="Description with <strong>HTML</strong>"
  attachment="file.csv"
  listItems={["Item 1", "Item 2"]}
/>
```
- Displays structured analysis results
- Supports attachments, lists, and formatted text
- Used within AI responses

### Layout Components

#### `AppLayout.jsx`
- Main chat layout with sidebar
- Used for persistent conversations

#### `NewChatLayout.jsx`
- Fresh chat layout
- Forces component remount to clear state

#### `ChatLayout.jsx`
- Chat interface layout (alternative)

## 🌐 API Integration

### Backend Communication
- **Endpoint**: `http://localhost:8000/api/analytics`
- **Method**: POST
- **Content-Type**: application/json

### Request Format
```json
{
  "query": "User's message",
  "current_timestamp": "2025-01-10T12:00:00Z",
  "session_id": "test-session-123",
  "email_id": "investigator@example.com"
}
```

### Response Format
```json
{
  "message": "### **ForensicAnalyst Report**\n\nAnalysis content...",
  "status": "success",
  "response": { "query": "User query" },
  "session_id": "test-session-123"
}
```

### Error Handling
- **CORS Issues**: Mock responses for development
- **Network Errors**: User-friendly error messages
- **API Failures**: Graceful degradation with fallback responses

## 🎯 Key Features

### Chat Interface
- **Real-time messaging**: Instant user message display
- **Typing animation**: Character-by-character AI responses
- **Markdown support**: Rich text formatting in AI responses
- **Auto-scroll**: Automatic scrolling to new messages
- **Loading states**: Visual feedback during API calls

### User Experience
- **Responsive design**: Works on desktop and mobile
- **Dark theme**: Consistent dark mode throughout
- **Keyboard shortcuts**: Enter to send, Shift+Enter for new lines
- **Auto-resize textarea**: Input field grows with content
- **Prompt suggestions**: Clickable example queries

### State Management
- **Message persistence**: Conversations maintain state during session
- **Fresh chats**: New chat button creates clean slate
- **Input management**: Controlled form inputs with validation
- **Loading states**: Prevents duplicate requests

## 🎨 Styling Guide

### Custom CSS Classes

#### Aurora Bar Effect
```css
.aurora-bar {
    position: relative;
    width: 100%;
    height: 2px;
    background-color: transparent;
    overflow: hidden;
}
```
- Creates animated gradient bar effect
- Used in landing page design

#### Background Gradient
```css
body {
  background-color: #121212;
  background-image: radial-gradient(circle, rgba(152, 51, 235, 0.15) 0%, #121212 70%);
}
```
- Subtle purple glow from center
- Applied globally for consistent theming

### Tailwind Configuration
- Extended color palette with custom forensics theme
- Custom border radius values
- Material Symbols font integration
- Container queries plugin
- Forms plugin for better input styling

## 🔄 Development Workflow

### Adding New Components
1. Create component in `/src/components/`
2. Use functional components with hooks
3. Follow naming convention: `ComponentName.jsx`
4. Import and use in parent components

### State Management Patterns
```jsx
// Message state
const [messages, setMessages] = useState([]);

// Add new message
setMessages(prevMessages => [...prevMessages, newMessage]);

// Message object structure
{
  id: Date.now(),
  sender: 'user' | 'ai',
  content: 'Message content',
  isTyping: true // for AI messages
}
```

### API Call Pattern
```jsx
const handleSendMessage = async (e) => {
  e.preventDefault();
  
  // 1. Add user message immediately
  const userMessage = { id: Date.now(), sender: 'user', content: inputValue };
  setMessages(prev => [...prev, userMessage]);
  
  // 2. Clear input
  setInputValue('');
  setIsLoading(true);
  
  // 3. API call
  try {
    const response = await fetch('/api/analytics', { /* ... */ });
    const data = await response.json();
    
    // 4. Add AI response
    const aiMessage = { id: Date.now() + 1, sender: 'ai', content: data.message };
    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false);
  }
};
```

## 🚧 Known Issues & Troubleshooting

### CORS Issues
**Problem**: `Access to fetch at 'http://localhost:8000/api/analytics' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution**: Backend needs CORS configuration:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

### Styling Issues
**Problem**: Background gradient not visible

**Solution**: Ensure no components override body background with solid colors

### State Management
**Problem**: Messages not clearing on new chat

**Solution**: Use unique keys to force component remount or implement proper state reset

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.1",
  "react-markdown": "^8.0.7"
}
```

### Styling
```json
{
  "tailwindcss": "^3.3.0",
  "@tailwindcss/forms": "^0.5.3",
  "@tailwindcss/container-queries": "^0.1.1"
}
```

### Build Tools
```json
{
  "react-scripts": "5.0.1",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.24"
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_VERSION=1.0.0
```

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

### Code Style
- Use functional components with hooks
- Follow ESLint configuration
- Use Tailwind for styling
- Add PropTypes for component props
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review component documentation in code comments

---

Built with ❤️ for digital forensics professionals