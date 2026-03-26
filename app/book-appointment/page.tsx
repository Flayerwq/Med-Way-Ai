"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ChevronLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { bookAppointment } from "@/services/appointmentService";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb";

const doctors = [
  { name: "Dr. Arpit Sharma", specialization: "General Physician" },
  { name: "Dr. Sarah Wilson", specialization: "Cardiologist" },
  { name: "Dr. Michael Chen", specialization: "Dermatologist" },
  { name: "Dr. Emily Brown", specialization: "Neurologist" },
  { name: "Dr. James Miller", specialization: "Orthopedic" },
];

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function BookAppointmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.user.user);
  
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setReady(true);
      } else {
        router.push("/signup");
      }
    });
    return () => unsub();
  }, [router]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !date || !selectedDoctor || !selectedTime) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const doctor = doctors.find(d => d.name === selectedDoctor);
      await bookAppointment(auth.currentUser.uid, {
        patientName: user?.full_name || "Patient",
        doctorName: selectedDoctor,
        specialization: doctor?.specialization || "General",
        date: format(date, "PPP"),
        time: selectedTime,
        description,
      });

      toast({ 
        title: "Appointment Scheduled", 
        description: `Confirmed with ${selectedDoctor} on ${format(date, "PPP")} at ${selectedTime}.` 
      });
      router.push("/appointments");
    } catch (error: any) {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
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
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Book Appointment</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-6 lg:p-12">
              <div className="max-w-2xl mx-auto">
                <Button 
                  variant="ghost" 
                  className="mb-6 h-9 px-3 font-bold uppercase text-[10px] tracking-widest gap-2"
                  onClick={() => router.back()}
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>

                <Card className="border-2 rounded-[2rem] card-shadow overflow-hidden bg-background">
                  <CardHeader className="bg-primary p-10 text-white">
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter">Schedule Consultation</CardTitle>
                    <CardDescription className="text-primary-foreground/80 font-medium text-base">Book an online session with our specialist clinical network.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10">
                    <form onSubmit={handleBooking} className="space-y-8">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Patient Name</Label>
                          <Input value={user?.full_name || ""} disabled className="h-12 border-2 rounded-xl font-bold bg-muted/30" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Specialist</Label>
                          <Select onValueChange={setSelectedDoctor} required>
                            <SelectTrigger className="h-12 border-2 rounded-xl font-bold">
                              <SelectValue placeholder="Choose a doctor" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-2">
                              {doctors.map((doc) => (
                                <SelectItem key={doc.name} value={doc.name} className="font-bold uppercase text-[10px] py-3">
                                  {doc.name} — {doc.specialization}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2 flex flex-col">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2">Preferred Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-12 border-2 rounded-xl justify-start text-left font-bold",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl border-2 shadow-2xl" align="start">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preferred Time</Label>
                          <Select onValueChange={setSelectedTime} required>
                            <SelectTrigger className="h-12 border-2 rounded-xl font-bold">
                              <SelectValue placeholder="Select a slot" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-2">
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot} className="font-bold uppercase text-[10px] py-3">
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Symptoms / Reason for visit</Label>
                        <Textarea 
                          placeholder="Please describe your clinical observations..." 
                          className="min-h-[120px] border-2 rounded-2xl p-5 font-medium resize-none"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing Request
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Confirm Appointment
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
