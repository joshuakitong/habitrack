import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import HabitTracker from "./pages/HabitTracker";
import Habit from "./pages/Habits";
import Overview from "./pages/Overview";

function App() {
  return (
    <Router>
      <div className="bg-gray-800 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Navbar />
          <Routes>
            <Route path="/" element={<HabitTracker />} />
            <Route path="/habits" element={<Habit />} />
            <Route path="/overview" element={<Overview />} />
          </Routes>
        </div>
      </div>
      <div className="text-center">App description to be added here</div>
      <div className="text-center"><i>(work in progress)</i></div>
    </Router>
  );
}

export default App;