import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton";
import ObjectList from "./components/ObjectList";
import ValidationRulesList from "./components/ValidationRulesList"; // Corrected name

function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
      console.log("Access Token:", token);
      localStorage.setItem("access_token", token);
      navigate("/dashboard"); // Redirect to dashboard after storing the token
    } else {
      console.error("Access token not found");
      navigate("/error"); // Redirect to error page if no token found
    }
  }, [location, navigate]);

  return <div>Processing OAuth...</div>;
}

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null);
  const [selectedObject, setSelectedObject] = useState(null);

  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">Salesforce Validation Rule Manager</h1>
        
        <Routes>
          <Route path="/" element={!accessToken ? <LoginButton /> : <ObjectList accessToken={accessToken} onSelectObject={setSelectedObject} />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/dashboard" element={<h2>Welcome to Dashboard</h2>} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>

        {selectedObject && <ValidationRulesList accessToken={accessToken} objectName={selectedObject} />}
      </div>
    </Router>
  );
}

export default App;
