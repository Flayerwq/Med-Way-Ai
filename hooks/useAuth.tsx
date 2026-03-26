import { googleProvider, auth } from "@/firebase";
import {
  setLoading,
  setUser,
  setError,
  logoutUser,
  setVerificationComplete,
  setverification,
  setStatus,
} from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  applyActionCode,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
// import { toast } from "sonner";
import { authApi } from "@/services/api";
import axios from "axios";
import Cookies from "js-cookie";
import { persistor, RootState } from "@/redux/store";

import { useSelector } from "react-redux";
import { deleteFile, getFile } from "@/lib/fileStore";

import { useToast } from "@/hooks/use-toast";
import { resetPromptHistory } from "@/redux/features/promptSlice";
import { resetSubscriptionPlans } from "@/redux/features/subSlice";
import { resetPayData } from "@/redux/features/usePayData";
import { resetSubData } from "@/redux/features/useSubData";
// import { useLogoutTimer } from "@/lib/LogoutTimerContext";

class RateLimiter {
  private attempts: number = 0;
  private lastAttempt: number = 0;
  private readonly maxAttempts: number;
  private readonly timeWindow: number;

  constructor(maxAttempts: number = 5, timeWindow: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindow;
  }

  canAttempt(): boolean {
    const now = Date.now();
    if (now - this.lastAttempt > this.timeWindow) {
      this.attempts = 0;
    }

    if (this.attempts >= this.maxAttempts) {
      const waitTime = Math.ceil(
        (this.timeWindow - (now - this.lastAttempt)) / 1000
      );
      throw new Error(
        `Too many login attempts. Please try again in ${waitTime} seconds.`
      );
    }

    this.attempts++;
    this.lastAttempt = now;
    return true;
  }
}

// Usage in your login functions:
const loginRateLimiter = new RateLimiter(5, 60000);

export const useAuth = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getActionCodeSettings = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://reportrx.in";
    return {
      url: `${origin}/signup/action`,
      handleCodeInApp: true,
    };
  };

  const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast({ title: "An error occurred", description: error.response.data?.message || "Server error" });
      } else if (error.request) {
        toast({ title: "No response from server" });
      } else {
        toast({ title: "An error occurred" });
      }
    } else {
      toast({ title: "Wrong email or password" });
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      dispatch(setLoading(true));
      await sendPasswordResetEmail(auth, email, getActionCodeSettings());
      toast({ title: "Reset email sent!", description: "Please check your inbox." });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast({ title: "Failed to send reset email", description: error.message });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      dispatch(setLoading(true));

      const result = await signInWithPopup(auth, googleProvider);

      if (result) {
        const token = await result.user.getIdToken();

        const userData = {
          email: result.user.email || "",
          full_name: result.user.displayName || "",
        };

        try {
          await authApi.update(userData);
        } catch (updateError: any) {
          try {
            await authApi.register(userData);
          } catch (registerError: any) {
            console.error("Registration failed:", registerError);
            toast({
              title: "Warning: User data may not be fully synchronized",
            });
          }
        }

        dispatch(
          setUser({
            email: result.user.email || "",
            full_name: result.user.displayName || "",
            jwt_token: token,
          })
        );

        dispatch(setVerificationComplete(true));

        Cookies.set("email_verified", "true", {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        Cookies.set("jwt_token", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        toast({ title: "Successfully signed in!" });
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      dispatch(setError(error.message));
      dispatch(setVerificationComplete(false));
      toast({ title: "Sign-in failed. Please try again.", description: error.message });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      dispatch(setLoading(true));

      const result = await signInWithPopup(auth, googleProvider);

      if (result) {
        const token = await result.user.getIdToken();

        const metadata = result.user.metadata;
        const isFirstVerifiedLogin =
          metadata.lastSignInTime === metadata.creationTime;

        const userData = {
          email: result.user.email || "",
          full_name: result.user.displayName || "",
          jwt_token: token,
        };

        if (isFirstVerifiedLogin) {
          try {
            await authApi.register(userData);
          } catch (error: any) {
            console.error("Failed to register new verified user:", error);
            toast({ title: "Failed to register. Please try again." });
            return;
          }
        }

        dispatch(setVerificationComplete(true));

        dispatch(
          setUser({
            email: result.user.email || "",
            full_name: result.user.displayName || "",
            jwt_token: token,
          })
        );

        Cookies.set("email_verified", "true", {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("jwt_token", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        toast({ title: "Successfully signed Up!" });
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Google sign-up error:", error);
      dispatch(setError(error.message));
      dispatch(setVerificationComplete(false));
      toast({ title: "Sign-up failed", description: error.message });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const custom_sign_in = async (
    full_name: string,
    email: string,
    password: string
  ) => {
    try {
      dispatch(setLoading(true));

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential) {
        await updateProfile(userCredential.user, {
          displayName: full_name,
        });
        
        try {
          await sendEmailVerification(userCredential.user, getActionCodeSettings());
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        } catch (emailError: any) {
          console.error("Error sending verification email:", emailError);
          toast({
            title: "Account created, but failed to send verification email.",
            description: emailError.message,
          });
        }
      }
    } catch (error: any) {
      console.error("Error during sign-up:", error.code, error.message);

      if (error.code === "auth/email-already-in-use") {
        toast({ title: "User already exists! Please sign in instead." });
      } else {
        toast({ title: "An error occurred. Please try again.", description: error.message });
      }

      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const verifyEmail = async (mode: string, oobCode: string) => {
    if (mode === "verifyEmail" && oobCode) {
      try {
        dispatch(setStatus("loading"));
        await applyActionCode(auth, oobCode);

        dispatch(
          setverification({
            mode: mode,
            oobCode: oobCode,
          })
        );

        Cookies.set("email_verified", "true", {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        dispatch(setStatus("success"));
        dispatch(setVerificationComplete(true));

        toast({ title: "Email verified successfully!" });
      } catch (error: any) {
        console.error("Error during email verification:", error);
        Cookies.set("email_verified", "false", {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        dispatch(setStatus("error"));
        dispatch(setVerificationComplete(false));

        toast({ title: "Verification failed.", description: error.message });
      }
    } else {
      router.push("/signup");
    }
  };

  const custom_login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));

      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();

      if (!result.user.emailVerified) {
        try {
          await sendEmailVerification(result.user, getActionCodeSettings());
          toast({
            title: "Email not verified",
            description: "A new verification email has been sent. Please check your inbox.",
          });
        } catch (emailError: any) {
          console.error("Error sending verification email:", emailError);
          toast({
            title: "Email not verified",
            description: "Please check your inbox for the verification link.",
          });
        }
        
        dispatch(setVerificationComplete(false));
        Cookies.set("email_verified", "false", {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        // We set the token so the user is "logged in" but limited by verified=false in middleware
        Cookies.set("jwt_token", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });
        return;
      }

      const full_name = result.user.displayName || email.split("@")[0] || "User";
      
      const userData = {
        email: result.user.email || "",
        full_name: full_name.trim(),
      };

      try {
        await authApi.update(userData);
      } catch (error) {
        console.error("User sync failed:", error);
      }

      dispatch(setVerificationComplete(true));

      dispatch(
        setUser({
          email: result.user.email || "",
          full_name: full_name,
          jwt_token: token,
        })
      );

      Cookies.set("email_verified", "true", {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("jwt_token", token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      toast({ title: "Successfully signed in!" });
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Login error:", error);
      let message = "Invalid email or password. Please try again.";
      if (error.code === "auth/user-disabled") {
        message = "Your account has been disabled. Please contact support.";
      }
      toast({ title: "Login failed", description: message });
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    // const { toast } = useToast()
    try {
      await signOut(auth);
      dispatch(logoutUser());
      dispatch(resetPromptHistory());
      dispatch(resetSubscriptionPlans());
      dispatch(resetPayData());
      dispatch(resetSubData());

      // Remove cookies and clear storage
      Cookies.remove("jwt_token");
      Cookies.remove("email_verified");
      localStorage.clear();
      sessionStorage.clear();

      // Clear any persisted state
      clearPersistedState();

      persistor.purge();

      // clearLogoutTimer();

      router.push("/signup");

      return Promise.resolve();
    } catch (error: any) {
      // Handle errors and dispatch error state if needed
      console.error("Logout failed:", error);
      dispatch(setError(error.message));
      return Promise.reject(error);
    }
  };

  const clearPersistedState = () => {
    persistor.purge(); // This will clear the persisted state
  };

  return {
    custom_sign_in,
    custom_login,
    handleGoogleSignIn,
    handleGoogleSignUp,
    logout,
    verifyEmail,
    handleForgotPassword,
  };
};
