"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginComp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { custom_login } = useAuth();

  async function handleFormSubmits(e: React.FormEvent) {
    e.preventDefault();
    await custom_login(email, password);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center lg:text-left">
        <h2 className="text-2xl font-black tracking-tight uppercase">Welcome Back</h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">Re-authenticate your clinical node.</p>
      </div>

      <form onSubmit={handleFormSubmits} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="login-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Clinical Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="email@node.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-2 rounded-xl px-4 font-bold"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between ml-1">
              <Label htmlFor="login-password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Cipher</Label>
              <Link 
                href="/forgot-password" 
                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
              >
                Forgot Cipher?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 border-2 rounded-xl px-4 pr-12 font-bold"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-4"
        >
          Initialize Session
        </Button>
      </form>
    </div>
  );
}
