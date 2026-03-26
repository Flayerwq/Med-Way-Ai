"use client";

import { auth } from "@/firebase";
import { applyActionCode, confirmPasswordReset } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/loginbutton";

export default function ActionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const { status } = useSelector((state: RootState) => state.user);
  const { verifyEmail } = useAuth();

  useEffect(() => {
  if (status === "success") {
    document.cookie =
      "email_verified=true; path=/; max-age=86400; SameSite=Lax";
  }
}, [status]);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const oobCode = searchParams.get("oobCode");

    if (!mode || !oobCode) {
      toast({
        title: "Invalid verification link",
        description: "Please try again",
      });
      router.push("/signup");
      return;
    }

    if (mode === "verifyEmail") {
      verifyEmail(mode, oobCode);
    } else if (mode === "resetPassword") {
      setIsResetting(true);
    }
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const oobCode = searchParams.get("oobCode");

    if (!oobCode) {
      toast({ title: "Invalid reset code", description: "Please try again" });
      // toast.error('Invalid reset code');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please try again",
      });
      // toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password must be at least 6 characters",
        description: "Please try again",
      });
      // toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast({ title: "Password reset successful!" });
      router.push("/signup");
    } catch (error: any) {
      toast(error.message || "Failed to reset password");
    }
  };

  if (isResetting) {
    return (
      <div className="login__div1">
        <div className="flex justify-between">
          <div className="flex-1 border w-full h-screen flex justify-center items-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="flex-1 border w-full h-screen flex justify-center items-center bg-background">
            <div className="mt-7">
              <Card className="w-[470px] mt-5">
                <CardHeader>
                  <CardTitle>Forgot password?</CardTitle>
                  <CardDescription>
                    Enter your email to reset the password
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordReset}>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">New password</Label>
                        <Input
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Please write your new password
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="phone">Confirm Password</Label>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center justify-center w-full gap-4">
                    <Button
                      type="submit"
                      className="w-full"
                      // onClick={handlePasswordReset}
                    >
                      Reset password
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div
        className="max-w-md w-full rounded-xl shadow-2xl p-8 text-center m-4 border border-zinc-800"
        style={{ backgroundColor: "#000", color: "#fff" }}
      >
        {status === "loading" && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <h2 className="text-2xl font-bold">Verifying Your Email</h2>
            <p className="text-zinc-700">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/10 p-3">
                <svg
                  className="h-12 w-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold">Email Verified!</h2>
            <p className="text-zinc-700">
              Your email has been successfully verified.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push("/signup")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
              >
                Continue to Login
              </button>
              <button
                onClick={() => window.close()}
                className="w-full bg-zinc-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-zinc-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-opacity-50"
              >
                Close This Window
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-500/10 p-3">
                <svg
                  className="h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold">Verification Failed</h2>
            <p className="text-zinc-700">
              Unable to verify your email. The link may have expired.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => router.push("/auth")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
              >
                Return to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
