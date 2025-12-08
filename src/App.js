import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChatProvider } from "./context/ChatContext";
import { UserProvider } from "./context/UserContext";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import AppLayout from "./components/AppLayout";
import ChatLayout from "./components/ChatLayout";
import NewChatLayout from "./components/NewChatLayout";

// Google OAuth Client ID - Must be set in .env file
// See GOOGLE_OAUTH_SETUP.md for setup instructions
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn(
    "⚠️ REACT_APP_GOOGLE_CLIENT_ID is not set. Please check GOOGLE_OAUTH_SETUP.md for setup instructions."
  );
}

function App() {
  return (
    <div className="dark">
      <div className="font-display text-gray-300 antialiased">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <UserProvider>
            <ChatProvider>
              <Router>
                <Routes>
                  {/* Login */}
                  <Route path="/" element={<LoginPage />} />

                  {/* Marketing / hero landing */}
                  <Route path="/landing" element={<LandingPage />} />

                  {/* Main dashboard layout (chat list + main content) */}
                  <Route path="/dashboard" element={<AppLayout />} />

                  {/* Existing chat session */}
                  <Route path="/chat/:sessionId" element={<ChatLayout />} />

                  {/* Fresh new chat session */}
                  <Route path="/new-chat" element={<NewChatLayout />} />
                </Routes>
              </Router>
            </ChatProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default App;
