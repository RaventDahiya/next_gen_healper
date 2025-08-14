import axios from "axios";

// Create an axios instance with default timeout
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
});

export const GetAuthUserData = async (token: string, signal?: AbortSignal) => {
  try {
    const config: any = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Add AbortSignal if provided
    if (signal) {
      config.signal = signal;
    }

    const userInfo = await apiClient.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      config
    );
    return userInfo.data;
  } catch (error: any) {
    // Don't log cancelled requests as errors
    if (error.code !== "ERR_CANCELED" && !axios.isCancel(error)) {
      console.error("GetAuthUserData error:", error);
    }
    throw error; // Re-throw the error so it can be handled by the caller
  }
};
