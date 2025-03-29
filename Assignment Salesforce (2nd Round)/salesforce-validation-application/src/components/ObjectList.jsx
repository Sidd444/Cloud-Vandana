import { useState, useEffect } from "react";
import { getSalesforceObjects } from "../services/salesforceApi";

const ObjectList = ({ accessToken, onSelectObject }) => {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    if (accessToken) {
      getSalesforceObjects(accessToken).then(setObjects);
    }
  }, [accessToken]);

  return (
    <div className="mt-5">
      <h2 className="text-xl font-bold">Salesforce Objects</h2>
      <ul className="mt-3">
        {objects.map((obj) => (
          <li key={obj.name} className="cursor-pointer text-blue-300 hover:text-blue-500" onClick={() => onSelectObject(obj.name)}>
            {obj.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObjectList;
