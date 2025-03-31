import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import LoginButton from "./components/LoginButton";
import ObjectList from "./components/ObjectList";
import ValidationRulesList from "./components/ValidationRulesList";
import { getUserInfo } from "./services/salesforceApi";

function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const instanceUrl = params.get("instance_url");

    if (token && instanceUrl) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("instance_url", instanceUrl);
      toast.success("Login successful!");
      
      navigate("/", { replace: true });
      window.location.replace("/");
    } else {
      toast.error("Login failed. Please try again.");
      navigate("/error", { replace: true });
    }
  }, [location, navigate]);

  return <div>Processing OAuth...</div>;
}


function Navbar({ accessToken, handleLogout, userName }) {
  return (
    <nav className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-6 shadow-lg flex justify-between items-center">
      <div className="text-2xl font-extrabold tracking-wide">
        <Link to="/" className="text-gray-200 transition duration-300">
          Salesforce Manager
        </Link>
      </div>
      {accessToken ? (
        <div className="flex items-center gap-6">
          <span className="text-xl font-medium text-white font-bold">Welcome, {userName}</span>
          <Link
            to="/"
            className="text-xl px-4 py-2 bg-blue-900 hover:bg-gray-700 rounded-lg text-white font-semibold transition duration-300"
          >
            Objects
          </Link>
          <Link
            to="/validation"
            className="text-xl px-4 py-2 bg-blue-900 hover:bg-gray-700 rounded-lg text-white font-semibold transition duration-300"
          >
            Validation Rules
          </Link>
          <button
            className="text-xl px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-semibold transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <LoginButton />
      )}
    </nav>
  );
}

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token") || null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (accessToken) {
      getUserInfo(accessToken)
        .then((data) => setUserName(data.name))
        .catch(() => toast.error("Failed to fetch user info."));
    }
  }, [accessToken]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("instance_url");
    setAccessToken(null);
    setSelectedObject(null);
    setUserName("");
    toast.success("Logged out successfully!");
  };

  return (
    <Router>
      <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white text-xl">
        <Toaster position="top-right" />
        <Navbar accessToken={accessToken} handleLogout={handleLogout} userName={userName} />
        <div className="flex flex-col items-center justify-center py-10 px-6">
          <div className="w-full max-w-4xl bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-8">
            <Routes>
              <Route
                path="/"
                element={
                  !accessToken ? (
                    <LoginButton />
                  ) : (
                    <ObjectList accessToken={accessToken} onSelectObject={setSelectedObject} />
                  )
                }
              />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              <Route path="/validation" element={
                selectedObject ? (
                  <ValidationRulesList accessToken={accessToken} objectName={selectedObject} />
                ) : (
                  <h2 className="text-2xl font-bold text-center">Please select an object first.</h2>
                )
              } />
              <Route path="*" element={<h2 className="text-2xl font-bold text-center">404 - Page Not Found</h2>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
