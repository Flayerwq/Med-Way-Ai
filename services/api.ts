import { auth } from "@/firebase";
import { setPromptHistory } from "@/redux/features/promptSlice";
import { setPayData } from "@/redux/features/usePayData";

import { setUser } from "@/redux/features/userSlice";
import { setSubData } from "@/redux/features/useSubData";

import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import Cookies from "js-cookie";

import { jwtDecode } from "jwt-decode";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

import { useDispatch, useSelector } from "react-redux";

// console.log("API Base URL:", BASE_URL); // Debug log

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // This is important for CORS
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug log for requests
    // console.log("API Request:", {
    //   url: config.url,
    //   method: config.method,
    //   headers: config.headers,
    //   data: config.data,
    // });
    return config;
  },
  (error) => {
    // console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Debug log for successful responses
    // console.log("API Response:", {
    //   status: response.status,
    //   data: response.data,
    //   headers: response.headers,
    // });
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.error("Response error:", {
      //   status: error.response.status,
      //   data: error.response.data,
      //   headers: error.response.headers,
      // });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

import { getAuth } from "firebase/auth";
import { setSubscriptionPlans } from "@/redux/features/subSlice";
import { setnewSubscriptionPlans } from "@/redux/features/getSubSlice";

export const getFreshToken = async (): Promise<string | null> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // console.log(currentUser, "this is current user");

  if (currentUser) {
    try {
      const token = await currentUser.getIdToken(true); // 👈 'true' forces refresh
      Cookies.set("jwt_token", token);
      // console.log(token, "this is token");
      return token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  } else {
    return null;
  }
};

interface RegisterData {
  email: string | null | undefined;
  full_name: string | null | undefined;
  // jwt_token: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const jwt_token = await getFreshToken(); // 👈 get FRESH token here

    if (!jwt_token) {
      console.error("No valid token found");
      return;
    }
    // Ensure we send non-null values
    const sanitizedData = {
      email: data.email || "",
      full_name: data.full_name || "",
      // jwt_token: data.jwt_token
    };

    // console.log("Starting registration request:", {
    //   url: `${BASE_URL}/api/auth/register/`,
    //   email: sanitizedData.email,
    //   // hasToken: !!sanitizedData.jwt_token
    // });

    try {
      const response = await api.post("/api/auth/register/", sanitizedData, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
      });

      // console.log("Registration successful:", {
      //   status: response.status,
      //   data: response.data,
      // });

      return response;
    } catch (error: any) {
      console.error("Registration failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
  update: async (data: RegisterData) => {
    const jwt_token = await getFreshToken(); // 👈 get FRESH token here

    if (!jwt_token) {
      console.error("No valid token found");
      return;
    }
    // Ensure we send non-null values
    const sanitizedData = {
      email: data.email || "",
      full_name: data.full_name || "",
      // jwt_token: data.jwt_token
    };

    // console.log("Starting update request:", {
    //   url: `${BASE_URL}/api/auth/update/`,
    //   email: sanitizedData.email,
    //   // hasToken: !!sanitizedData.jwt_token
    // });

    try {
      const response = await api.put("/api/auth/update/", sanitizedData, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
        },
      });

      // console.log("Update successful:", {
      //   status: response.status,
      //   data: response.data,
      // });

      return response;
    } catch (error: any) {
      console.error("Update failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },
  login: (data: any) => api.post("/api/auth/login/", data),
  logout: () => api.post("/api/auth/logout/"),
  getCurrentUser: () => api.get("/api/auth/me/"),
};

interface PaymentData {
  sub_name: string;
}

export const createpayment =
  (formdata: PaymentData) => async (dispatch: AppDispatch) => {
    try {
      const jwt_token = await getFreshToken(); // 👈 get FRESH token here

      if (!jwt_token) {
        console.error("No valid token found");
        return;
      }

      // console.log("✅ Making API call with data:", formdata);

      const response = await api.post("/api/create_sub/", formdata, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "application/json",
        },
      });

      // console.log("✅ API Response:", response);

      return response;
    } catch (err) {
      console.error("❌ Failed to create payment:", err);
      throw err; // Optional: rethrow so you can handle outside if needed
    }
  };

export const postpayment =
  (formdata: PaymentData) => async (dispatch: AppDispatch) => {
    try {
      const jwt_token = await getFreshToken(); // 👈 get FRESH token here

      if (!jwt_token) {
        console.error("No valid token found");
        return;
      }

      // console.log("✅ Making API call with data:", formdata);

      const response = await api.post("/api/post_payment/", formdata, {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "application/json",
        },
      });

      // console.log("✅ API Response:", response);

      return response;
    } catch (err) {
      console.error("❌ Failed to fetch processed files:", err);
      throw err; // optional: throw if you want to handle it outside
    }
  };

export const postIssue = (title, message) => async (dispatch: AppDispatch) => {
  try {
    const jwt_token = await getFreshToken(); // 👈 get FRESH token here

    if (!jwt_token) {
      console.error("No valid token found");
      return;
    }

    const data = { title, message }; // 👈 create the data object

    // console.log("✅ Making API call with data:", data);

    const response = await api.post("/api/report_issue/", data, {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
        "Content-Type": "application/json",
      },
    });

    // console.log("✅ API Response:", response);

    return response;
  } catch (err) {
    console.error("❌ Failed to report issue:", err);
    throw err; // optional: throw if you want to handle it outside
  }
};

export const postMessage =
  (name, email, message) => async (dispatch: AppDispatch) => {
    try {
      const data = { name, email, message }; // 👈 create the data object

      // console.log("✅ Making API call with data:", data);

      const response = await api.post("/api/post_messages/", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("✅ API Response:", response);

      return response;
    } catch (err) {
      console.error("❌ Failed to report issue:", err);
      throw err; // optional: throw if you want to handle it outside
    }
  };

export const getSubData = () => async (dispatch: AppDispatch) => {
  try {
    const jwt_token = await getFreshToken(); // 👈 get FRESH token here

    if (!jwt_token) {
      console.error("No valid token found");
      return;
    }

    // console.log("✅ JWT Token:", jwt_token);

    const response = await api.get("/api/get_sub_details/", {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });

    dispatch(setSubData(response.data.subscription_details));
  } catch (err) {
    console.error("❌ Failed to fetch subscription data:", err);
  }
};

export const getPayData = () => async (dispatch: AppDispatch) => {
  try {
    const jwt_token = await getFreshToken(); // 👈 get FRESH token here

    if (!jwt_token) {
      console.error("No valid token found");
      return;
    }

    // console.log("✅ JWT Token:", jwt_token);

    const response = await api.get("/api/get_pay_data/", {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });

    dispatch(setPayData(response.data.payment_history));
  } catch (err) {
    console.error("❌ Failed to fetch payment data:", err);
  }
};

export const getSubscriptions = () => async (dispatch: AppDispatch) => {
  try {
    const jwt_token = await getFreshToken(); // 👈 Get a fresh token here

    if (!jwt_token) {
      console.error("No valid token found");
      return;
    }

    const response = await api.get("/api/get_all_sub/", {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });

    // Dispatch the subscription data to Redux store
    dispatch(setSubscriptionPlans(response.data.subs));
  } catch (err) {
    console.error("❌ Failed to fetch subscriptions:", err);
  }
};


export const getnewSubscriptions = () => async (dispatch: AppDispatch) => {
  try {
    const response = await api.get("/api/get_new_sub/", {});

    // Dispatch the subscription data to Redux store
    dispatch(setnewSubscriptionPlans(response.data.subs));
  } catch (err) {
    console.error("❌ Failed to fetch subscriptions:", err);
  }
};

export const getPrompts = () => async (dispatch: AppDispatch) => {
  try {
    const jwt_token = await getFreshToken();

    if (!jwt_token) {
      console.warn("No token available for getPrompts");
      return;
    }

    const response = await api.get("/api/get_prompts/", {
      headers: {
        Authorization: `Bearer ${jwt_token}`,
      },
    });

    if (response.data && response.data.queries) {
      const formattedData = response.data.queries.map((query: any) => ({
        uuid: query.uuid,
        prompt: query.prompt,
        response: query.response,
        images: query.images || [],
        timestamp: new Date(query.created_at).toLocaleString(),
        thumbnail:
          query.images && query.images.length > 0 ? query.images[0] : "",
        fileSize:
          query.images && query.images.length > 0 ? query.images.length : "0",
        pdf_url: query.pdf_url,
      }));

      dispatch(setPromptHistory(formattedData));
    } else {
      console.warn("API returned no queries:", response.data);
    }

    return response.data;
  } catch (err: any) {
    console.error("❌ Failed to fetch prompts:", err.response?.data || err.message);
  }
};

export const sendPromptImagePdf = async (prompt: string, files: File[], aiResponse?: string) => {
  try {
    const jwt_token = await getFreshToken();

    const formData = new FormData();
    formData.append("prompt_text", prompt);
    if (aiResponse) {
      formData.append("response", aiResponse); // Changed from ai_response to response
    }

    // Append files
    files.forEach((file) => {
      if (file.type === "application/pdf") {
        formData.append("pdfs", file);
      } else {
        formData.append("images", file);
      }
    });

    const response = await api.post(
      "/api/post_text_or_image_prompt/",
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwt_token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error sending prompt with files:", error);
    throw error;
  }
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(ms, resolve));

export const deletePrompt =
  (prompt_uuid: string) => async (dispatch: AppDispatch) => {
    try {
      const jwt_token = await getFreshToken(); // ✅ Fetch fresh token here

      const response = await api.post(
        "/api/delete_prompt/",
        { query_id: prompt_uuid },
        {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error("❌ Failed to delete prompt:", err);
    }
  };
