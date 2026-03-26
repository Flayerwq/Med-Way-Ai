"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  AlertCircle,
  HelpCircle,
  LifeBuoy,
  User,
  Activity,
  FileText,
  Calendar,
  Shield,
  Key,
  Mail,
  Smartphone,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { postIssue } from "@/services/api";

import { getAuth } from "firebase/auth";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AccountPage() {
  const dispatch = useDispatch();
  const auth = getAuth();
  const users = useSelector((state: RootState) => state.user.user);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [dialogType, setDialogType] = useState("support");
  const [loading, setLoading] = useState(false);

  const handleOpen = (type: "support" | "issue") => {
    setDialogType(type);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast({ title: "Validation Error", description: "Title and message are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await (dispatch as any)(postIssue(title, message));
      toast({ title: "Protocol Dispatched", description: "Your report has been transmitted to clinical support." });
      setOpen(false);
      setTitle("");
      setMessage("");
    } catch (err) {
      toast({ title: "Transmission Failed", description: "Node error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider className="h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex w-full h-screen relative">
        <div className="w-full flex flex-col bg-muted/5">
          <SidebarInset className="h-full flex flex-col bg-transparent">
            <header className="flex h-20 shrink-0 items-center border-b px-8 bg-background/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4 w-full">
                <SidebarTrigger className="-ml-1 h-10 w-10 rounded-xl" />
                <Separator orientation="vertical" className="mx-2 h-6" />
                <div>
                    <h1 className="text-lg font-black uppercase tracking-widest text-foreground leading-none">Node Profile</h1>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 block font-mono">ID: {auth.currentUser?.uid.substring(0, 12)}...</span>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              <div className="mx-auto max-w-5xl p-8 lg:p-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="mb-12 border-none bg-primary/5 rounded-[2.5rem] overflow-hidden relative group">
                        <div className="absolute inset-0 violet-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
                        <CardContent className="p-10">
                            <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-[2.5rem] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 transform -rotate-6 border-4 border-white/10 relative z-10">
                                    <User className="h-16 w-16 text-white" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-green-500 border-4 border-background flex items-center justify-center z-20 shadow-lg">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                            </div>
                            <div className="text-center md:text-left flex-1 space-y-4">
                                <div>
                                    <h1 className="text-4xl font-black text-foreground tracking-tight uppercase mb-2">
                                        {users?.full_name || "Clinical_Node_01"}
                                    </h1>
                                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-muted-foreground">
                                        <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border-2">
                                            <Mail className="h-3.5 w-3.5 text-primary" />
                                            <span className="text-xs font-bold uppercase tracking-tight">{users?.email}</span>
                                        </div>
                                        <Badge className="font-black uppercase tracking-[0.2em] bg-primary text-white border-none px-4 py-1.5 h-auto text-[10px] shadow-lg shadow-primary/20">
                                            Standard clinical node
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <Tabs defaultValue="identity" className="space-y-10">
                  <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-14 w-fit border-2">
                    <TabsTrigger value="identity" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-full data-[state=active]:bg-background data-[state=active]:shadow-lg">Identity</TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-full data-[state=active]:bg-background data-[state=active]:shadow-lg">Security</TabsTrigger>
                  </TabsList>

                  <TabsContent value="identity" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                        <Card className="border-2 rounded-[2rem] card-shadow overflow-hidden bg-background">
                            <CardHeader className="bg-muted/20 border-b p-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Activity className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-primary">
                                        Node Integrity
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Identity</Label>
                                    <div className="h-14 bg-muted/30 rounded-2xl flex items-center px-6 border-2 font-bold uppercase text-sm">
                                        {users?.full_name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Clinical Communication</Label>
                                    <div className="h-14 bg-muted/30 rounded-2xl flex items-center px-6 border-2 font-bold uppercase text-sm">
                                        {users?.email}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-2 rounded-[2rem] card-shadow overflow-hidden bg-background">
                            <CardHeader className="bg-muted/20 border-b p-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-violet-600">
                                        Clinical History
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="flex justify-between items-center bg-muted/30 p-6 rounded-2xl border-2 border-dashed">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Node Status</p>
                                        <p className="font-black uppercase text-sm text-primary">Operational</p>
                                    </div>
                                    <Badge className="bg-green-500/10 text-green-600 border-none font-black text-[9px] uppercase tracking-widest px-3 h-7">Verified</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed italic px-2">
                                    Authentication protocols established and verified by MedWay Clinical Central.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-2 rounded-[2rem] card-shadow overflow-hidden bg-background max-w-2xl">
                        <CardHeader className="bg-muted/20 border-b p-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                                    <Key className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">
                                    Access Protocols
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center justify-between p-6 rounded-2xl border-2 hover:border-primary/30 transition-all cursor-pointer group bg-muted/5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-background border-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Shield className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1.5">Cipher Management</p>
                                        <p className="font-bold text-sm">Update Access Cipher</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="rounded-xl"><Key className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex items-center justify-between p-6 rounded-2xl border-2 hover:border-primary/30 transition-all cursor-pointer group bg-muted/5">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-background border-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1.5">Authentication</p>
                                        <p className="font-bold text-sm">Two-Factor Encryption</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="font-black uppercase tracking-widest text-[8px] h-6">Disabled</Badge>
                            </div>
                        </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="mt-16 text-center space-y-8 bg-muted/20 rounded-[3rem] p-12 border-4 border-dashed border-muted transition-all hover:bg-muted/30">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-background border-2 flex items-center justify-center shadow-sm">
                        <HelpCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Need Protocol Assistance?</h3>
                        <p className="text-sm text-muted-foreground font-medium mt-1">Our clinical node operators are available 24/7.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Button
                      variant="outline"
                      className="gap-3 border-2 font-black uppercase text-[10px] tracking-[0.2em] h-14 rounded-2xl bg-background hover:bg-primary hover:text-white hover:border-primary transition-all"
                      onClick={() => handleOpen("support")}
                    >
                      <LifeBuoy className="h-5 w-5" />
                      Clinical Node Support
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-3 border-2 font-black uppercase text-[10px] tracking-[0.2em] h-14 rounded-2xl bg-background hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                      onClick={() => handleOpen("issue")}
                    >
                      <AlertCircle className="h-5 w-5" />
                      Report Discrepancy
                    </Button>
                  </div>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="w-full max-w-sm mx-auto rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                    <div className="bg-primary p-8 text-center text-white">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase tracking-[0.3em] text-center text-xs leading-none">
                                {dialogType === "support"
                                ? "Clinical Uplink"
                                : "Emergency Protocol"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mt-6">
                            {dialogType === "support" ? <LifeBuoy className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                        </div>
                    </div>
                    <div className="p-8 space-y-6 bg-background">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
                                <Input
                                    placeholder="PROTOCOL_IDENTIFIER"
                                    value={title}
                                    required
                                    className="border-2 rounded-xl h-12 font-bold uppercase placeholder:opacity-30"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transmission Data</Label>
                                <Textarea
                                    className="min-h-[140px] border-2 rounded-2xl p-5 font-medium resize-none"
                                    required
                                    placeholder={
                                        dialogType === "support"
                                        ? "Enter clinical inquiry parameters..."
                                        : "Enter observed protocol discrepancy..."
                                    }
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-[10px] p-5 rounded-2xl bg-muted/50 font-black uppercase tracking-[0.1em] leading-relaxed border-2 border-dashed">
                            <div className="flex justify-between mb-2">
                                <span className="text-primary">Clinical Hub:</span>
                                <span className="text-foreground">Support_01</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-primary">Emergency:</span>
                                <span className="text-foreground">+91-9320402128</span>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "TRANSMITTING..." : "Execute Uplink"}
                            </Button>
                        </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
