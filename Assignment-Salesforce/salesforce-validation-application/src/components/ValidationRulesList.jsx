import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { getValidationRules, toggleValidationRule } from "../services/salesforceApi";

const ValidationRulesList = ({ accessToken, objectName }) => {
  const [rules, setRules] = useState([]);
  const [isTogglingAll, setIsTogglingAll] = useState(false);

  useEffect(() => {
    if (accessToken && objectName) {
      getValidationRules(accessToken, objectName)
        .then(setRules)
        .catch(() => toast.error("Failed to fetch validation rules."));
    }
  }, [accessToken, objectName]);

  const handleToggle = async (ruleId, isActive, ruleFullName) => {
    try {
      await toggleValidationRule(accessToken, ruleId, !isActive, ruleFullName);
      const updatedRules = await getValidationRules(accessToken, objectName);
      setRules(updatedRules);
      toast.success(`Validation rule "${ruleFullName}" toggled successfully!`);
    } catch (error) {
      toast.error("Error toggling validation rule.");
    }
  };

  const handleToggleAll = async (activate) => {
    setIsTogglingAll(true);
    try {
      for (const rule of rules) {
        if (rule.Active !== activate) {
          await toggleValidationRule(accessToken, rule.Id, activate, rule.ValidationName);
        }
      }
      const updatedRules = await getValidationRules(accessToken, objectName);
      setRules(updatedRules);
      toast.success(`All validation rules ${activate ? "enabled" : "disabled"} successfully!`);
    } catch (error) {
      toast.error("Error toggling all validation rules.");
    } finally {
      setIsTogglingAll(false);
    }
  };

  return (
    <div className="mt-5">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold">{objectName} Validation Rules</h2>
      <div className="flex gap-2 mt-3">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
          onClick={() => handleToggleAll(true)}
          disabled={isTogglingAll}
        >
          {isTogglingAll ? "Enabling..." : "Enable All"}
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
          onClick={() => handleToggleAll(false)}
          disabled={isTogglingAll}
        >
          {isTogglingAll ? "Disabling..." : "Disable All"}
        </button>
      </div>
      <ul className="mt-3">
        {rules.map((rule) => (
          <li key={rule.Id} className="flex justify-between items-center">
            <span>{rule.ValidationName}</span>
            <button
              className={`px-3 py-1 rounded ${rule.Active ? "bg-red-500" : "bg-green-500"}`}
              onClick={() => handleToggle(rule.Id, rule.Active, rule.ValidationName)}
              disabled={isTogglingAll}
            >
              {rule.Active ? "Disable" : "Enable"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationRulesList;
