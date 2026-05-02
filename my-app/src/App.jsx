import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Calender from "./pages/Calender";
import MyDones from "./pages/MyDones";
import Reminders from "./pages/Remainders";
import HowItWorks from "./pages/HowItWorks";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/Terms-of-service";
import ProductivityGuides from "./components/ProductivityGuide";
import SuccessStories from "./pages/SuccessStories";
import PricingPage from "./pages/Pricing";
import ReportsPage from "./pages/ReportsPage";
import Layout from "./layout";
export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Reminders" element={<Reminders />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mydones" element={<MyDones />} />
          <Route path="/calendar" element={<Calender />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/How It works" element={<HowItWorks />} />
          <Route path="/Productivity-Guide" element={<ProductivityGuides />} />
          <Route path="/case-studies" element={<SuccessStories />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/Reports" element={<ReportsPage />} />
        </Routes>
      </Layout>
      <Footer />
    </Router>
  );
}
