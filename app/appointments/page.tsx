"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Trash2, 
  Loader2, 
  Plus,
  CalendarCheck,
  AlertCircle
} from "lucide-react";
import { subscribeToAppointments, cancelAppointment, Appointment } from "@/services/appointmentService";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";
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

export default function AppointmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setReady(true);
        const subUnsub = subscribeToAppointments(firebaseUser.uid, (data) => {
          setAppointments(data);
          setLoading(false);
        });
        return () => subUnsub();
      } else {
        router.push("/signup");
      }
    });
    return () => unsub();
  }, [router]);

  const handleCancel = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await cancelAppointment(auth.currentUser.uid, id);
      toast({ title: "Appointment Cancelled", description: "The consultation record has been removed." });
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to cancel appointment.", variant: "destructive" });
    }
  };

  if (!ready) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider className="h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex w-full h-screen relative">
        <div className="w-full flex flex-col bg-muted/5">
          <SidebarInset className="h-full flex flex-col bg-transparent">
            <header className="flex h-16 shrink-0 items-center border-b px-8 bg-background/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4 w-full">
                <SidebarTrigger className="-ml-1 h-10 w-10 rounded-xl" />
                <Separator orientation="vertical" className="mx-2 h-6" />
                <div className="flex-1">
                    <h1 className="text-lg font-black uppercase tracking-widest text-foreground leading-none">Consultation History</h1>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1 block">Clinical Schedule Index</span>
                </div>
                <Button 
                  onClick={() => router.push("/book-appointment")}
                  className="rounded-xl h-10 px-4 font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-primary/20"
                >
                  <Plus className="h-4 w-4" /> New Booking
                </Button>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6 lg:p-12">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight uppercase">Scheduled Visits</h2>
                        <p className="text-sm text-muted-foreground font-medium mt-1">Review and manage your upcoming medical consultations.</p>
                    </div>
                    <Badge variant="outline" className="h-8 border-2 px-4 rounded-lg font-black text-[10px] uppercase tracking-widest bg-background">
                        {appointments.length} Appointments
                    </Badge>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Syncing Clinical Data...</p>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    {appointments.map((app) => (
                      <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Card className="border-2 border-transparent hover:border-primary/50 transition-all bg-background group rounded-[2rem] card-shadow overflow-hidden">
                          <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                <CalendarCheck className="h-6 w-6" />
                              </div>
                              <Badge className="bg-green-500/10 text-green-600 border-none font-black text-[9px] uppercase tracking-widest px-3 h-7">
                                {app.status}
                              </Badge>
                            </div>

                            <div className="space-y-4 mb-8">
                              <div>
                                <h3 className="font-black text-xl uppercase tracking-tight text-foreground line-clamp-1">{app.doctorName}</h3>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">{app.specialization}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-[11px] font-bold uppercase">{app.date}</span>
                                </div>
                                <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-[11px] font-bold uppercase">{app.time}</span>
                                </div>
                              </div>

                              <div className="bg-muted/20 p-4 rounded-xl border-2 border-dashed border-muted">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Clinical Notes</p>
                                <p className="text-xs font-medium text-foreground line-clamp-2 italic">&ldquo;{app.description}&rdquo;</p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" className="flex-1 border-2 rounded-xl font-black uppercase text-[10px] tracking-widest h-11 hover:bg-destructive hover:text-white hover:border-destructive transition-all">
                                    <Trash2 className="h-4 w-4 mr-2" /> Cancel Session
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="font-black uppercase tracking-tight">Abort Consultation?</AlertDialogTitle>
                                    <AlertDialogDescription className="font-medium">This will permanently remove the appointment with {app.doctorName} from your schedule.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl border-2 font-bold uppercase text-[10px] tracking-widest">Keep Appointment</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancel(app.id)} className="rounded-xl bg-destructive text-white font-bold uppercase text-[10px] tracking-widest">Cancel Booking</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 bg-background/50 rounded-[3rem] border-4 border-dashed border-muted text-center px-6">
                    <div className="h-20 w-20 rounded-[2.5rem] bg-muted/50 flex items-center justify-center mb-8">
                        <AlertCircle className="h-10 w-10 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-2">No Active Consultations</h3>
                    <p className="max-w-xs text-xs text-muted-foreground font-medium uppercase tracking-widest leading-relaxed">Your medical appointment queue is currently empty.</p>
                    <Button 
                      onClick={() => router.push("/book-appointment")}
                      className="mt-10 rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em]"
                    >
                      Initialize Booking
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
