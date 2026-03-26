"use client";

import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import LoginComp from "@/components/cutom_comp/LoginComp";

import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Brain, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function SignUpContent() {
  const [email, setEmail] = useState("");
  const [full_name, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const isVerifyMode = searchParams.get("verify") === "true";

  const { toast } = useToast();
  const { custom_sign_in, handleGoogleSignUp } = useAuth();

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "Security Requirement",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    await custom_sign_in(full_name, email, password);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row items-center justify-center p-4 lg:p-0">
      {/* Branding - Top Left on Desktop */}
      <Link href={"/"} className="fixed top-8 left-8 z-50 hidden lg:flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-black uppercase tracking-widest text-foreground">
          MedWay
        </span>
      </Link>

      {/* Decorative Background for Desktop */}
      <div className="hidden lg:flex flex-1 h-screen relative overflow-hidden bg-muted/30">
        <div className="absolute inset-0 violet-gradient opacity-10 blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-full h-full violet-gradient opacity-5 blur-3xl rounded-full transform translate-x-1/4 translate-y-1/4" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-center max-w-2xl mx-auto">
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-6 text-foreground uppercase">
            Clinical Intelligence <span className="text-primary">Standard</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            The next generation of AI-powered medical consultation and laboratory analysis. 
            Join the elite healthcare network.
          </p>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="flex-1 w-full max-w-[450px] lg:max-w-none lg:h-screen flex flex-col justify-center items-center bg-background px-4 sm:px-12 lg:px-24">
        <div className="w-full max-w-[400px]">
          {/* Mobile Branding */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-12">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black uppercase tracking-widest text-foreground">
              MedWay
            </span>
          </div>

          {isVerifyMode && (
            <Alert variant="default" className="mb-8 border-primary/20 bg-primary/5 rounded-2xl p-6">
              <AlertCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="font-bold text-primary">Verification Pending</AlertTitle>
              <AlertDescription className="text-muted-foreground font-medium mt-1">
                Please verify your clinical email to access the terminal. We&apos;ve dispatched a link to your inbox.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-2xl h-12 mb-8">
              <TabsTrigger value="account" className="rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Register
              </TabsTrigger>
              <TabsTrigger value="password" className="rounded-xl font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-black tracking-tight uppercase">Create Account</h2>
                  <p className="text-sm text-muted-foreground font-medium mt-1">Establish your clinical node identity.</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 font-bold uppercase text-[10px] tracking-widest gap-3 transition-all hover:bg-muted/50"
                  onClick={handleGoogleSignUp}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      style={{ fill: "#4285F4" }}
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      style={{ fill: "#34A853" }}
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      style={{ fill: "#FBBC05" }}
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      style={{ fill: "#EA4335" }}
                    />
                  </svg>
                  Connect with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                    <span className="bg-background px-4 text-muted-foreground">Protocol Terminal</span>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity</Label>
                      <Input
                        id="name"
                        placeholder="Clinical Name"
                        required
                        minLength={3}
                        className="h-12 border-2 rounded-xl px-4 font-bold"
                        value={full_name}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Clinical Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@node.com"
                        required
                        className="h-12 border-2 rounded-xl px-4 font-bold"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Cipher</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-2 rounded-xl px-4 pr-12 font-bold"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-4">
                    Establish Identity
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="password">
              <LoginComp />
            </TabsContent>
          </Tabs>

          <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-12">
            MedWay Clinical Terminal v1.0.5
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Establishing Node...</span>
        </div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}
