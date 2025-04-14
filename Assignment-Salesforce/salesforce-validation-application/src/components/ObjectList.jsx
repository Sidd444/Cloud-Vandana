import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { getSalesforceObjects, getValidationRules } from "../services/salesforceApi";

const ObjectList = ({ accessToken, onSelectObject }) => {
  const [objects, setObjects] = useState([]);
  const [validationRules, setValidationRules] = useState([]);

  useEffect(() => {
    if (accessToken) {
      getSalesforceObjects(accessToken)
        .then((allObjects) => {
          const filteredObjects = allObjects.filter((obj) =>
            ["Account", "Contact", "Lead", "Opportunity"].includes(obj.name)
          );
          setObjects(filteredObjects);
        })
        .catch(() => toast.error("Failed to fetch Salesforce objects"));
    }
  }, [accessToken]);

  const handleObjectClick = async (objectName) => {
    try {
      const rules = await getValidationRules(accessToken, objectName);
      setValidationRules(rules);
      onSelectObject(objectName);
      toast.success(`Selected object: ${objectName}`);
    } catch {
      toast.error("Failed to fetch validation rules for the selected object.");
    }
  };

  return (
    <div className="mt-5">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold">Salesforce Objects</h2>
      <ul className="mt-3">
        {objects.map((obj) => (
          <li
            key={obj.name}
            className="cursor-pointer text-blue-300 hover:text-blue-500"
            onClick={() => handleObjectClick(obj.name)}
          >
            {obj.label}
          </li>
        ))}
      </ul>
      {validationRules.length > 0 && (
        <div className="mt-5">
          <h3 className="text-lg font-bold">Validation Rules</h3>
          <ul>
            {validationRules.map((rule) => (
              <li key={rule.Id} className="mt-2">
                {rule.ValidationName} - {rule.Active ? "Active" : "Inactive"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ObjectList;
