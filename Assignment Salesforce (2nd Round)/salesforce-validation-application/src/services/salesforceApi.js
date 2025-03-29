import axios from "axios";

const CLIENT_ID = "3MVG9rZjd7MXFdLi8jPo63qmsl2BGyzujtREQfPLvVBeDxoXrvj3QZFzPWHTC6Jbr2dLAIJxtuY1cB_h_k5Xo";
const REDIRECT_URI = "http://localhost:5173/oauth/callback";
const AUTH_URL = `https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

export const loginUrl = AUTH_URL;

export const getSalesforceObjects = async (accessToken) => {
  const response = await axios.get(
    "https://your-instance.salesforce.com/services/data/v59.0/sobjects/",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data.sobjects;
};

export const getValidationRules = async (accessToken, objectName) => {
  const response = await axios.get(
    `https://your-instance.salesforce.com/services/data/v59.0/tooling/query/?q=SELECT+Id,Active,ValidationName+FROM+ValidationRule+WHERE+EntityDefinition.DeveloperName='${objectName}'`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data.records;
};

export const toggleValidationRule = async (accessToken, ruleId, isActive) => {
  await axios.patch(
    `https://your-instance.salesforce.com/services/data/v59.0/tooling/sobjects/ValidationRule/${ruleId}`,
    { Active: !isActive },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
};
