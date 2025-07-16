import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from "react-router-dom";
import './index.css';
import App from './App.jsx';
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import { HabitManagerProvider } from "./context/HabitManagerContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <HabitManagerProvider>
          <Router>
            <App />
          </Router>
        </HabitManagerProvider>
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>,
)
