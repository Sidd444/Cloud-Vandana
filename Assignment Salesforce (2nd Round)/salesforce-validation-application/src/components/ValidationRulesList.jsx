import { useState, useEffect } from "react";
import { getValidationRules, toggleValidationRule } from "../services/salesforceApi";

const ValidationRulesList = ({ accessToken, objectName }) => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    if (accessToken && objectName) {
      getValidationRules(accessToken, objectName).then(setRules);
    }
  }, [accessToken, objectName]);

  const handleToggle = async (ruleId, isActive, rullFullName) => {
    try {
      await toggleValidationRule(accessToken, ruleId, !isActive, rullFullName); // Toggle the value
      const updatedRules = await getValidationRules(accessToken, objectName);
      setRules(updatedRules);
    } catch (error) {
      console.error("Error toggling validation rule:", error);
    }
  };

  const handleToggleAll = async (activate) => {
    try {
      for (const rule of rules) {
        if (rule.Active !== activate) {
          await toggleValidationRule(accessToken, rule.ValidationName, activate); // Pass the correct value
        }
      }
      const updatedRules = await getValidationRules(accessToken, objectName);
      setRules(updatedRules);
    } catch (error) {
      console.error("Error toggling all validation rules:", error);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-xl font-bold">{objectName} Validation Rules</h2>
      <div className="flex gap-2 mt-3">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
          onClick={() => handleToggleAll(true)}
        >
          Enable All
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          onClick={() => handleToggleAll(false)}
        >
          Disable All
        </button>
      </div>
      <ul className="mt-3">
        {rules.map((rule) => (
          <li key={rule.Id} className="flex justify-between items-center">
            <span>{rule.ValidationName}</span>
            <button
              className={`px-3 py-1 rounded ${rule.Active ? "bg-red-500" : "bg-green-500"}`}
              onClick={() => handleToggle(rule.Id, rule.Active, rule.ValidationName)}
            >
              {rule.Active ? "Disable" : "Enable"}
            </button>
            {console.log("rule", rule)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationRulesList;
