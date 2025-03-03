import * as Yup from "yup";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  ngoName: Yup.string().required("NGO Name is required"),
  address: Yup.string().required("Address is required"),
  phone: Yup.string().required("Phone number is required").matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
  city: Yup.string().required("City is required"),
  terms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  documents: Yup.array().min(1, "At least one document is required"),
});

export default validationSchema;
