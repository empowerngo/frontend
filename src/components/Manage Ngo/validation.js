export const validateField = (name) => {
  const validations = {
    ngoName: { required: "NGO name is required" },
    ngoAddress: { required: "Address is required" },
    ngoCity: { required: "City is required" },
    ngoState: { required: "State is required" },
    ngoCountry: { required: "Country is required" },
    ngoPinCode: {
      required: "Pincode is required",
      pattern: { value: /^[0-9]{6}$/, message: "Invalid Pin Code number" },
      minLength: { value: 6, message: "Pin Code must be 6 digits" },
      maxLength: { value: 6, message: "Pin Code must be 6 digits" },
    },
    ngoEmail: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid email address",
      },
    },
    ngoPAN: {
      required: "PAN number is required",
      pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Invalid PAN number" },
    },
    ngoRegNumber: { required: "Registration number is required" },
    
    ngoContact: {
      required: "Mobile number is required",
      pattern: {
        value: /^[0-9]{10}$/, // Ensures exactly 10 digits
        message: "Mobile number must be exactly 10 digits",
      },
      minLength: { value: 10, message: "Mobile number must be exactly 10 digits" },
      maxLength: { value: 10, message: "Mobile number must be exactly 10 digits" },
    },
  };
  return validations[name] || {};
};
