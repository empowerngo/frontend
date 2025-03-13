export const validateField = (name) => {
  const validations = {
    ngoName: {
      required: "NGO name is required",
      minLength: {
        value: 3,
        message: "NGO name must be at least 3 characters",
      },
      maxLength: { value: 50, message: "NGO name cannot exceed 50 characters" },
    },
    ngoRegNumber: {
      required: "Registration number is required",
      pattern: {
        value: /^[a-zA-Z0-9-]+$/,
        message: "Invalid registration number format",
      },
    },
    ngoAddress: {
      required: "Address is required",
      minLength: { value: 5, message: "Address must be at least 5 characters" },
    },
    ngoCountry: { required: "Country is required" },
    ngoState: { required: "State is required" },
    ngoCity: { required: "City is required" },
    subscriptionp: { required: "Subscription plan is required" },

    ngoPinCode: {
      required: "Pincode is required",
      pattern: {
        value: /^[1-9][0-9]{5}$/,
        message: "Pincode must be a 6-digit number starting with 1-9",
      },
      minLength: {
        value: 6,
        message: "Pincode must be at least 6 Digits",
      },
      maxLength: { value: 6, message: "Pincode must be at max 6 Digits" },
    },

    ngoEmail: {
      required: "Email is required",
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Invalid email address",
      },
    },
    ngoContact: {
      required: "Mobile number is required",
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: "Mobile number must be 10 digits starting with 6-9",
      },
    },
    authorizedPerson: {
      required: "Authorized person name is required",
      minLength: { value: 3, message: "Name must be at least 3 characters" },
    },
    ngoPAN: {
      required: "PAN number is required",
      pattern: {
        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        message: "Invalid PAN number format (e.g., ABCDE1234F)",
      },
    },
    contactPerson: {
      required: "Contact person name is required",
      minLength: { value: 3, message: "Name must be at least 3 characters" },
    },
    ngo12ANumber: {
      required: "12A Number is required",
      pattern: {
        value: /^[A-Z0-9]+$/,
        message: "Invalid 12A number format",
      },
    },
    ngoCSRNumber: {
      required: "CSR Number is required",
      pattern: {
        value: /^[A-Z0-9]+$/,
        message: "Invalid CSR number format",
      },
    },
    ngoFCRANumber: {
      required: "FCRA Number is required",
      pattern: {
        value: /^[A-Z0-9]+$/,
        message: "Invalid FCRA number format",
      },
    },
    ngo80GNumber: {
      required: "80G Number is required",
      pattern: {
        value: /^[A-Z0-9]+$/,
        message: "Invalid 80G number format",
      },
    },
    ngo80GDate: {
      required: "80G Date is required",
      pattern: {
        value: /^\d{4}-\d{2}-\d{2}$/,
        message: "Invalid date format (YYYY-MM-DD)",
      },
    },
    logourl: {
      required: "NGO Logo is required",
    },
    signatureurl: {
      required: "Signature is required",
    },
    sealurl: {
      required: "NGO Seal is required",
    },
  };
  return validations[name] || {};
};
