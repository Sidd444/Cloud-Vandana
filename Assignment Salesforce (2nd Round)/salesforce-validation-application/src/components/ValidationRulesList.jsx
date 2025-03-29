import { useState, useEffect } from "react";
import { getValidationRules, toggleValidationRule } from "../services/salesforceApi";

const ValidationRulesList = ({ accessToken, objectName }) => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    if (accessToken && objectName) {
      getValidationRules(accessToken, objectName).then(setRules);
    }
  }, [accessToken, objectName]);

  const handleToggle = async (ruleId, isActive) => {
    await toggleValidationRule(accessToken, ruleId, isActive);
    getValidationRules(accessToken, objectName).then(setRules);
  };

  return (
    <div className="mt-5">
      <h2 className="text-xl font-bold">{objectName} Validation Rules</h2>
      <ul className="mt-3">
        {rules.map((rule) => (
          <li key={rule.Id} className="flex justify-between items-center">
            <span>{rule.ValidationName}</span>
            <button className={`px-3 py-1 rounded ${rule.Active ? "bg-red-500" : "bg-green-500"}`} onClick={() => handleToggle(rule.Id, rule.Active)}>
              {rule.Active ? "Disable" : "Enable"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationRulesList;
