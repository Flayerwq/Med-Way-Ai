import { database } from "@/firebase";
import { ref, push, set, onValue, serverTimestamp, get, remove } from "firebase/database";

export interface Appointment {
  id: string;
  userId: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  description: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  createdAt: any;
}

export const bookAppointment = async (userId: string, data: Omit<Appointment, "id" | "userId" | "status" | "createdAt">) => {
  const appointmentsRef = ref(database, `users/${userId}/appointments`);
  const newAppointmentRef = push(appointmentsRef);
  const appointmentId = newAppointmentRef.key;

  const appointmentData = {
    id: appointmentId,
    userId,
    ...data,
    status: "Scheduled",
    createdAt: serverTimestamp(),
  };

  await set(newAppointmentRef, appointmentData);
  return appointmentId;
};

export const subscribeToAppointments = (userId: string, callback: (appointments: Appointment[]) => void) => {
  const appointmentsRef = ref(database, `users/${userId}/appointments`);
  return onValue(appointmentsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const appointmentsList = Object.values(data) as Appointment[];
      // Sort by date and time (simplistic sort)
      appointmentsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(appointmentsList);
    } else {
      callback([]);
    }
  });
};

export const cancelAppointment = async (userId: string, appointmentId: string) => {
  const appointmentRef = ref(database, `users/${userId}/appointments/${appointmentId}`);
  await remove(appointmentRef);
};
