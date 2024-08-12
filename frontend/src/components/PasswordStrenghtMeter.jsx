import { Check, X } from "lucide-react";

/**
 * Component to display the password criteria and its status.
 * @param {Object} props - The component props.
 * @param {string} props.password - The password to check against the criteria.
 * @returns {JSX.Element} The rendered component.
 */
const PasswordCriteria = ({ password }) => {
  // Define the criteria for a strong password
  const criteria = [
    {
      // Minimum 6 characters
      label: "Minimum 6 characters",
      met: password.length >= 6,
    },
    {
      // At least one uppercase letter
      label: "At least one uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      // At least one lowercase letter
      label: "At least one lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      // At least one number
      label: "At least one number",
      met: /[0-9]/.test(password),
    },
    {
      // At least one special character
      label: "At least one special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    // Render the criteria with their status
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            // Show check icon if the criteria is met
            <Check className="mr-2 text-green-500 size-4" />
          ) : (
            // Show X icon if the criteria is not met
            <X className="mr-2 text-gray-500 size-4" />
          )}
          <span
            className={item.met ? "text-green-500" : "text-gray-400"} // Change the color of the text based on the status
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};


/**
 * Component to display the password strength and its status.
 * @param {Object} props - The component props.
 * @param {string} props.password - The password to check against the strength.
 * @returns {JSX.Element} The rendered component.
 */
const PasswordStrenghtMeter = ({ password }) => {
  // Function to calculate the strength of the password
  /**
   * Calculates the strength of a password.
   * @param {string} pass - The password to check.
   * @returns {number} The strength of the password.
   */
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++; // At least 6 characters
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++; // At least one uppercase and one lowercase letter
    if (pass.match(/\d/)) strength++; // At least one number
    if (pass.match(/[^a-zA-Z\d]/)) strength++; // At least one special character
    if (pass.length >= 6) strength++; // At least 6 characters
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++; // At least one uppercase and one lowercase letter
    if (pass.match(/\d/)) strength++; // At least one number
    if (pass.match(/[^a-zA-Z\d]/)) strength++; // At least one special character
    return strength;
  };
  const strength = getStrength(password);

  // Function to determine the color of the strength meter based on the strength.
   
  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500"; // Red 500 color for very weak password
    if (strength === 1) return "bg-red-400"; // Red 400 color for weak password
    if (strength === 2) return "bg-yellow-500"; // Yellow 500 color for fair password
    if (strength === 3) return "bg-yellow-400"; // Yellow 400 color for good password
    return "bg-green-500"; // Green 500 color for strong password
  };

  // Function to determine the text of the strength meter
  /**
   * Determines the text of the strength meter based on the strength.
   * @param {number} strength - The strength of the password.
   * @returns {string} The text for the strength meter.
   */
  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak"; // Very weak password
    if (strength === 1) return "Weak"; // Weak password
    if (strength === 2) return "Fair"; // Fair password
    if (strength === 3) return "Good"; // Good password
    return "Strong"; // Strong password
  };

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>

      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 
            ${index < strength ? getColor(strength) : "bg-gray-600"}
          `}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrenghtMeter;
