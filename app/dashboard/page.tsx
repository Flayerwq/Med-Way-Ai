"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Send, Clock, Bot, MessageSquare, Sparkles, Plus, Loader2, User, ChevronLeft, CalendarCheck } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { sendPromptImagePdf, sleep } from "@/services/api";

import ReactMarkdown from "react-markdown";

import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useEffect, useState, useRef, Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { callOpenAI } from "@/services/openai";
import { saveMessageToRTDB, subscribeToChats, getChatSession, deleteChatFromRTDB } from "@/services/chatService";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const { toast } = useToast();

  const [prompt, setPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>(uuidv4());
  const [width, setWidth] = useState(0);

  // Chat session state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!isMounted) return;
      if (firebaseUser) {
        setReady(true);
      } else {
        const hasToken = Cookies.get("jwt_token") || user?.jwt_token;
        if (!hasToken) {
          router.replace("/signup");
        } else {
          const timer = setTimeout(() => {
            if (isMounted && !auth.currentUser) router.replace("/signup");
          }, 5000);
          return () => clearTimeout(timer);
        }
      }
    });
    return () => { isMounted = false; unsub(); };
  }, [router, user]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle session param from URL
  useEffect(() => {
    const sessionId = searchParams.get("session");
    if (sessionId && ready && auth.currentUser) {
      getChatSession(auth.currentUser.uid, sessionId).then(session => {
        if (session) {
          setCurrentSessionId(sessionId);
          setMessages(session.messages);
        }
      });
    }
  }, [searchParams, ready]);

  // Subscribe to RTDB chats
  useEffect(() => {
    if (ready && auth.currentUser) {
      const unsub = subscribeToChats(auth.currentUser.uid, (chats) => {
        setChatHistory(chats);
      });
      return () => unsub();
    }
  }, [ready]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(uuidv4());
    setPrompt("");
    router.push("/dashboard");
  };

  const handleSelectHistory = (session: any) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
  };

  const handleDelete = async (uuid: string) => {
    if (!auth.currentUser) return;
    try {
      await deleteChatFromRTDB(auth.currentUser.uid, uuid);
      if (currentSessionId === uuid) startNewChat();
      toast({ title: "Session deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Delete failed.", variant: "destructive" });
    }
  };

  const performChat = async (text: string) => {
    if (!text.trim()) return;
    if (!auth.currentUser) return;

    const userMessage = text.trim();
    const updatedMessages: ChatMessage[] = [...messages, { role: "user", content: userMessage }];
    
    setMessages(updatedMessages);
    setPrompt("");
    setIsLoading(true);

    try {
      const aiResponse = await callOpenAI(updatedMessages);
      await saveMessageToRTDB(auth.currentUser.uid, currentSessionId, "user", userMessage);
      await saveMessageToRTDB(auth.currentUser.uid, currentSessionId, "assistant", aiResponse);
      await sendPromptImagePdf(userMessage, [], aiResponse);
      setMessages([...updatedMessages, { role: "assistant", content: aiResponse }]);
    } catch (error: any) {
      toast({ 
        title: "Connection Error", 
        description: error.message || "Failed to reach node.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    performChat(prompt);
  };

  if (!ready && !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Establishing Link...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider className="h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-col lg:flex-row w-full h-screen">
        
        {/* History Sidebar */}
        <div className={`w-full lg:w-72 flex flex-col h-full border-r bg-muted/5 shrink-0 ${messages.length > 0 && width < 1024 ? "hidden" : "flex"}`}>
          <SidebarInset className="h-full flex flex-col bg-transparent">
            <header className="flex h-12 shrink-0 items-center border-b px-4 justify-between bg-background">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 h-8 w-8" />
                <Separator orientation="vertical" className="h-4" />
                <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">History</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={startNewChat} 
                className="h-7 w-7 rounded-md bg-primary/10 text-primary"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </header>

            <ScrollArea className="flex-1 px-2 py-3">
              <div className="space-y-1">
                {chatHistory.length > 0 ? (
                  chatHistory.map((session) => (
                    <motion.div key={session.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <button 
                        onClick={() => handleSelectHistory(session)}
                        className={`w-full text-left p-2 rounded-md transition-all flex items-center gap-3 group border ${currentSessionId === session.id ? "bg-primary/5 border-primary/20" : "bg-transparent border-transparent hover:bg-muted"}`}
                      >
                        <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${currentSessionId === session.id ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="text-[11px] font-semibold truncate flex-1 uppercase tracking-tight">{session.title || "New Session"}</span>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button 
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive flex items-center justify-center rounded"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-lg border shadow-lg max-w-xs">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xs font-bold uppercase">Delete Session?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-[11px]">This record will be permanently erased.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-4">
                                    <AlertDialogCancel className="h-8 text-[10px] font-bold uppercase px-4">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(session.id)} className="h-8 text-[10px] font-bold uppercase px-4 bg-destructive">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-[10px] text-center py-10 text-muted-foreground font-bold uppercase tracking-widest opacity-50">Empty Archive</p>
                )}
              </div>
            </ScrollArea>
          </SidebarInset>
        </div>

        {/* Main Interface */}
        <div className={`flex-1 flex flex-col h-full bg-background ${messages.length === 0 && !currentSessionId && width < 1024 ? "hidden" : "flex"}`}>
          <header className="flex h-12 items-center border-b px-4 justify-between bg-background sticky top-0 z-20">
            <div className="flex items-center gap-3">
              {width < 1024 && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setMessages([]); setCurrentSessionId(uuidv4()); }}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-2 bg-primary/5 px-2.5 py-1 rounded border border-primary/10">
                <Bot className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-black text-primary tracking-widest uppercase">Node_Connected</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-6 border px-2 rounded font-bold text-[8px] uppercase tracking-tighter hidden sm:flex">v1.0.5</Badge>
                <div className="h-8 w-8 rounded border flex items-center justify-center bg-muted/30">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
            </div>
          </header>

          <div className="flex-1 overflow-hidden flex flex-col relative">
            <ScrollArea className="flex-1 p-4 lg:p-10">
              <div className="max-w-3xl mx-auto space-y-8 pb-32">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-black mb-2 text-foreground tracking-tight uppercase">Medical Consultation</h2>
                    <p className="max-w-md text-muted-foreground leading-relaxed mb-10 text-xs font-medium uppercase tracking-tight">
                      Describe your clinical symptoms or ask a health-related question to initiate analysis.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                      <button 
                          className="p-5 text-left border rounded-lg hover:border-primary transition-all bg-muted/10 hover:bg-background group shadow-sm flex flex-col" 
                          onClick={() => performChat("Initiate formal clinical evaluation for persistent symptoms.")}
                      >
                          <Sparkles className="h-4 w-4 mb-3 text-primary" />
                          <h3 className="font-bold text-[11px] mb-1 uppercase tracking-widest">Symptom Assessment</h3>
                          <p className="text-[10px] text-muted-foreground leading-normal font-medium">Standard clinical evaluation protocol node.</p>
                      </button>
                      <button 
                          className="p-5 text-left border rounded-lg hover:border-primary transition-all bg-muted/10 hover:bg-background group shadow-sm flex flex-col" 
                          onClick={() => router.push("/book-appointment")}
                      >
                          <CalendarCheck className="h-4 w-4 mb-3 text-primary" />
                          <h3 className="font-bold text-[11px] mb-1 uppercase tracking-widest">Book Appointment</h3>
                          <p className="text-[10px] text-muted-foreground leading-normal font-medium">Schedule a session with a clinical specialist.</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[90%] lg:max-w-[85%] rounded-lg px-4 py-3 border ${
                        msg.role === "user" 
                            ? "bg-primary text-white border-primary shadow-sm" 
                            : "bg-muted/30 border-border text-foreground"
                      }`}>
                        <div className="flex items-center gap-2 mb-2 opacity-50">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                            {msg.role === "user" ? "Patient" : "MedWay AI"}
                          </span>
                        </div>
                        <div className={`prose prose-xs lg:prose-sm max-w-none font-semibold leading-relaxed ${msg.role === "user" ? "prose-invert" : "text-foreground"}`}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/30 border rounded-lg px-4 py-3 flex gap-1.5 items-center">
                        <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Form */}
            <div className="p-4 lg:p-8 bg-background border-t">
              <div className="max-w-3xl mx-auto">
                <form className="relative flex items-end gap-2" onSubmit={handleSendMessage}>
                  <Textarea 
                    placeholder="Enter clinical symptoms..." 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                    className="min-h-[45px] max-h-[200px] py-3 px-4 resize-none rounded-md border focus-visible:ring-primary bg-muted/10 text-sm font-bold"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-[45px] w-[45px] shrink-0 rounded-md bg-primary text-white shadow-sm" 
                    disabled={isLoading || !prompt.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-[9px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-[0.3em] opacity-40">Clinical Standard v1.0.5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
