import axios from "axios";
import { BASE_URL } from "../config/baseUrl";

const CLIENT_ID = "3MVG9rZjd7MXFdLi8jPo63qmsl2BGyzujtREQfPLvVBeDxoXrvj3QZFzPWHTC6Jbr2dLAIJxtuY1cB_h_k5Xo";
const REDIRECT_URI = `${BASE_URL}/oauth/callback`;
const AUTH_URL = `https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

export const loginUrl = AUTH_URL;

const instanceUrl = localStorage.getItem("instance_url");

export const getSalesforceObjects = async (accessToken) => {
  const response = await axios.get(
    `/#/services/data/v59.0/sobjects/`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data.sobjects;
};

export const getValidationRules = async (accessToken, objectName) => {
  const response = await axios.get(
    `/#/services/data/v59.0/tooling/query/?q=SELECT+Id,Active,ValidationName+FROM+ValidationRule+WHERE+EntityDefinition.DeveloperName='${objectName}'`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data.records;
};

export const toggleValidationRule = async (accessToken, ruleId, isActive, validationName) => {
  try {
    const response = await axios.get(
      `/#/services/data/v59.0/tooling/sobjects/ValidationRule/${ruleId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const metadata = response.data.Metadata || {};
    const updatedMetadata = {
      ...metadata,
      active: isActive,
    };

    await axios.patch(
      `/#/services/data/v59.0/tooling/sobjects/ValidationRule/${ruleId}`,
      { Metadata: updatedMetadata },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Validation rule with Name ${validationName} successfully toggled to ${isActive}`);
  } catch (error) {
    console.log("Error toggling validation rule:", error.message);
  }
};

export const getUserInfo = async (accessToken) => {
  const response = await axios.get(
    `/#/services/oauth2/userinfo`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
};
