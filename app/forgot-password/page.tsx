"use client";

import { useState } from "react";
import { Button } from "@/components/ui/loginbutton";
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
// import { useAuth } from '@/hooks/useAuth';
// import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import LoginComp from "@/components/cutom_comp/LoginComp";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const [email, setEmail] = useState("");

  const { handleForgotPassword } = useAuth();
  const { toast } = useToast();

  function formSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      handleForgotPassword(email);
    } else {
      toast({
        title: "Enter your email",
        description: "Please enter your email address",
      });
    }
  }

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
              <form onSubmit={formSubmit}>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Email address</Label>
                      <Input
                        type="email"
                        id="email"
                        placeholder="john@gmail.com"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Please write your email address
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center w-full gap-4">
                  <Button type="submit" className="w-full">
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
