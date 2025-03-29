import { loginUrl } from "../services/SalesforceAPI";

const LoginButton = () => (
  <a href={loginUrl} className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Login with Salesforce
  </a>
);

export default LoginButton;
