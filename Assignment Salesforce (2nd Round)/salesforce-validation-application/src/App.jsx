import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginButton from "./components/LoginButton";
import ObjectList from "./components/ObjectList";
import ValidationRulesList from "./components/ValidationRulesList";
import { getUserInfo } from "./services/SalesforceAPI";

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
      navigate("/");
      window.location.reload();
    } else {
      navigate("/error");
    }
  }, [location, navigate]);

  return <div>Processing OAuth...</div>;
}

function Navbar({ accessToken, handleLogout, userName }) {
  return (
    <nav className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Salesforce Manager</div>
      {accessToken ? (
        <div className="flex items-center gap-4">
          <span>Welcome, {userName}</span>
          <Link to="/" className="hover:underline">Object List</Link>
          <Link to="/validation" className="hover:underline">Validation Rules</Link>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
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
      getUserInfo(accessToken).then((data) => setUserName(data.name));
    }
  }, [accessToken]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("instance_url");
    setAccessToken(null);
    setSelectedObject(null);
    setUserName("");
    navigate("/");
  };

  return (
    <Router>
      <div className="min-h-screen w-screen bg-gray-900 text-white">
        <Navbar accessToken={accessToken} handleLogout={handleLogout} userName={userName} />
        <div className="flex flex-col items-center justify-center">
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
                <h2>Please select an object first.</h2>
              )
            } />
            <Route path="*" element={<h2>404 - Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
