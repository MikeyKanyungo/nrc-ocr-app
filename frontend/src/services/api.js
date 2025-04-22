import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; 

export const processKYC = async (frontFile, backFile, selfieFile) => {
  const formData = new FormData();
  formData.append("front", frontFile);
  formData.append("back", backFile);
  formData.append("selfie", selfieFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/process-id/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error calling KYC API:", error);
    throw error;
  }
};
