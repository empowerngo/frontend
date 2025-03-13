export const validateField = (name) => {
  const validations = {
    donorFName: { required: "First name is required" },
    donorLName: { required: "Last name is required" },
    donorAddress: { required: "Address is required" },
    donorCity: { required: "City is required" },
    donorState: { required: "State is required" },
    donorCountry: { required: "Country is required" },
    donorPinCode: {
      required: "Pincode is required",
      pattern: { value: "^[0-9]{6}$", message: "Invalid Pin Code number" },
      minLength: { value: 6, message: "Pin Code must be 6 digits" },
      maxLength: { value: 6, message: "Pin Code must be 6 digits" },
    },
    donorPinCode: {
      required: "Pincode is required",
      pattern: {
        value: "^[0-9]{6}$", // Convert regex to string
        message: "Invalid Pin Code number",
      },
      minLength: { value: 6, message: "Pin Code must be 6 digits" },
      maxLength: { value: 6, message: "Pin Code must be 6 digits" },
    },
    donorEmail: {
      required: "Email is required",
      pattern: {
        value: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
        message: "Invalid email address",
      },
    },
    ngoCountry: { required: "Country is required" },
    ngoState: { required: "State is required" },
    ngoCity: { required: "City is required" },
    donorPAN: {
      // required: "PAN number is required",
      pattern: {
        value: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        message: "Invalid PAN number",
      },
    },
    donorProfession: { required: "Profession is required" },
    donorType: {
      required: "Donor Type is required",
      validate: {
        validValues: (value) => {
          const allowedValues = ["Individual", "Corporate", "Group", "NGO"];
          if (!allowedValues.includes(value)) {
            return "Invalid Donor Type";
          }
          return true;
        },
      },
    },
  };
  return validations[name] || {};
};
