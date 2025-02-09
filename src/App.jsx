import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import './App.css';
import SignUpPage from './sign-up';
import Home from './pages/home/home';
import SignInPage from "./Signin"
import Dashboard from './pages/dashboard/dashboard';
import AddDashboard from './pages/dashboard/Add';
import AddDashboard2 from './pages/dashboard/add2';
// import DnDFlowWrapper from './components/workflow/workflow';
// import Workflow from './workflow';
import { GoogleProvider } from "./components/api_int/GoogleContext";
import GoogleAuth from "./components/api_int/GoogleAuth";
import Gmail from './pages/gmail/gmail';
// import GoogleButton from "./components/api_int/GoogleButton";
// import GmailAttachmentViewer from './pages/gmail/gmail';

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
function RedirectAfterSignIn() {
  const navigate = useNavigate();
  navigate('/dashboard');
  return null;
}

function App() {
  return (
    <GoogleProvider>
      <Router>
        <SignedOut>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/sign-in" />} />
          </Routes>
        </SignedOut>

        <SignedIn>
          <RedirectAfterSignIn />
          <Routes>
          <Route path="/google_int" element={<GoogleAuth />} />
          <Route path="/email" element={<Gmail/>} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<>hello</>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/dashboard/add" element={<AddDashboard/>} />
            <Route path="/dashboard/add2" element={<AddDashboard2/>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SignedIn>
      </Router>
      </GoogleProvider>
  );
}

export default App;
