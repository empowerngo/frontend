import api from "./api";

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/userSignIn", credentials);
    const { token, user } = response.data.payload;
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const registerNgo = async (formData) => {
  try {
    console.log("formData - ", formData);
    const response = await api.post("/manageNGO", formData);
    console.log("response - ", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const retrieveNGOList = async (reqType, ngoId = null) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Missing authentication token");
    }
    if (!["list", "info"].includes(reqType)) {
      throw new Error('"reqType" must be one of [list, info]');
    }
    const requestData = { reqType };
    if (reqType === "info" && !ngoId) {
      throw new Error("ngoID is required when reqType is 'info'");
    }
    if (ngoId) {
      requestData.ngoID = ngoId;
    }
    console.log("Sending Request Data:", requestData);
    console.log("Token Sent:", token);
    const response = await api.post("/retrieveNGOInfo", requestData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("retrieveNGOList API Error:", error);
    throw error.response?.data || error.message;
  }
};

export const manageProject = async (formData, reqType) => {
  try {
    formData.append("reqType", reqType);
    console.log("manageProject API - Request:", formData);

    const response = await api.post("/manageProject", formData);
    console.log("manageProject API - Response:", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const managePurpose = async (formData, reqType) => {
  try {
    formData.append("reqType", reqType);
    console.log("managePurpose API - Request:", formData);

    const response = await api.post("/managePurpose", formData);
    console.log("managePurpose API - Response:", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProjects = async (ngoID) => {
  try {
    const response = await api.post("/manageProject", { reqType: "g", ngoID });
    return response.data.payload || [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPurposes = async (ngoID, projectID) => {
  try {
    const response = await api.post("/managePurpose", {
      reqType: "g",
      ngoID,
      projectID
    });
    return response.data.payload || [];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const registerUser = async (formData) => {
  try {
    console.log("formData - ", formData);
    const response = await api.post("/manageUserRegistration", formData, {});
    console.log("response - ", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const retrieveUserList = async (reqType) => {
  try {
    const requestData = { reqType };
    const response = await api.post("/retrieveUsersInfo", requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const handleStaffRequest = async (formData) => {
  try {
    const { reqType } = formData;

    if (!["s", "u"].includes(reqType)) {
      throw new Error(
        "Invalid reqType. Must be 's' for staff save or 'u' for staff update."
      );
    }
    if (reqType === "s") {
      if (formData.roleCode === 1) {
        if (formData.ngoId) {
          throw new Error(
            "NGO ID should not be provided for Super Admin role."
          );
        }
      } else if ([2, 3, 4].includes(formData.roleCode)) {
        if (!formData.ngoId) {
          throw new Error("NGO ID is required for roles 2, 3, or 4.");
        }
      } else {
        throw new Error("Invalid role code.");
      }
      const response = await api.post("/manageUserRegistration", formData);
      return response.data;
    }
    if (reqType === "u") {
      if ([2, 3, 4].includes(formData.roleCode)) {
        if (!formData.ngoId) {
          throw new Error("NGO ID is required for updating this role.");
        }
      } else if (formData.roleCode === 1) {
        if (formData.ngoId) {
          throw new Error(
            "NGO ID should not be provided for Super Admin role update."
          );
        }
      } else {
        throw new Error("Invalid role code.");
      }
      const response = await api.post("/manageUserRegistration", formData);
      return response.data;
    }

    throw new Error("Invalid request type.");
  } catch (error) {
    console.error("Error handling staff request:", error);
    throw error.response?.data || error.message;
  }
};

export const retrieveUserInfo = async (reqType, userID) => {
  try {
    const requestData = { reqType };

    if (reqType === "info") {
      requestData.userID = userID;
    }

    const response = await api.post("/retrieveUsersInfo", requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const handleDonorRequest = async (formData, reqType) => {
  try {
    if (!["s", "u"].includes(reqType)) {
      throw new Error(
        "Invalid reqType. Must be 's' for save or 'u' for update."
      );
    }
    if (reqType === "u") {
      if (!formData.donorNGOID) {
        throw new Error("NGO ID is required for updating donor details.");
      }
    }
    const payload = { ...formData, reqType };
    const response = await api.post("/manageDonor", payload);
    return response.data;
  } catch (error) {
    console.error("Error handling donor request:", error);
    throw error.response?.data || error.message;
  }
};

export const getDonorData = async (formData, reqType) => {
  try {
    if (!["info", "list"].includes(reqType)) {
      throw new Error("invalid reqType. Must be 'info' for get info or 'list' for list data");
    }

    if (reqType === "info" && !formData.donorID) {
      throw new Error("NGO ID is required for getting donor info");
    }

    if (reqType === "list" && !formData.ngoID) {
      throw new Error("NGO ID is required for getting donor info");
    }
    
    const payload = { ...formData, reqType };
    const response = await api.post("/retrieveDonorInfo", payload);
    
    return response.data; 
  } catch (error) {
    console.error("Error handling donor request:", error);
    throw error.response?.data || error.message;
  }
};

export const getSubsPlans = async () => {
  try {
    const requestData = { reqType: "fetch" };

    const response = await api.post("/retrieveSubsPackages", requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const registerPlan = async (formData) => {
  try {
    console.log("formData - ", formData);
    const response = await api.post("/manageSubsPackage", formData, {});
    console.log("response - ", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//method to parse csv file and call api to store csv data

export const importFile = async (csvData, ngoId, donationType) => {
  try {
    const response = await api.post("/importStatement", {
      ngoId,
      donationType,
      csvData,
    });

    console.log("Upload successful:", response.data);
    alert("Upload successful!");
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed.");
  }
};