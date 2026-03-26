import { database } from "@/firebase";
import { ref, push, set, onValue, serverTimestamp, get } from "firebase/database";

export interface RTDBChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: any;
}

export interface RTDBChatSession {
  id: string;
  title: string;
  createdAt: any;
  lastMessageAt: any;
  messages: RTDBChatMessage[];
  pdfUrl?: string;
}

export const saveMessageToRTDB = async (userId: string, sessionId: string, role: "user" | "assistant", content: string) => {
  const chatRef = ref(database, `users/${userId}/chats/${sessionId}/messages`);
  const newMessageRef = push(chatRef);
  await set(newMessageRef, {
    role,
    content,
    timestamp: serverTimestamp(),
  });

  // Update session metadata
  const sessionRef = ref(database, `users/${userId}/chats/${sessionId}`);
  await set(ref(database, `users/${userId}/chats/${sessionId}/lastMessageAt`), serverTimestamp());
  
  // If it's the first message, set the title
  const snapshot = await get(ref(database, `users/${userId}/chats/${sessionId}/title`));
  if (!snapshot.exists()) {
    await set(ref(database, `users/${userId}/chats/${sessionId}/title`), content.substring(0, 50));
    await set(ref(database, `users/${userId}/chats/${sessionId}/createdAt`), serverTimestamp());
  }
};

export const savePdfToRTDB = async (userId: string, sessionId: string, pdfUrl: string) => {
  await set(ref(database, `users/${userId}/chats/${sessionId}/pdfUrl`), pdfUrl);
};

export const deleteChatFromRTDB = async (userId: string, sessionId: string) => {
  await set(ref(database, `users/${userId}/chats/${sessionId}`), null);
};

export const getChatSession = async (userId: string, sessionId: string) => {
  const snapshot = await get(ref(database, `users/${userId}/chats/${sessionId}`));
  if (snapshot.exists()) {
    const data = snapshot.val();
    return {
      id: sessionId,
      ...data,
      messages: data.messages ? Object.values(data.messages) : [],
    };
  }
  return null;
};

export const subscribeToChats = (userId: string, callback: (chats: any[]) => void) => {
  const chatsRef = ref(database, `users/${userId}/chats`);
  return onValue(chatsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const chatsList = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        ...value,
        messages: value.messages ? Object.values(value.messages) : [],
      })).sort((a: any, b: any) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0));
      callback(chatsList);
    } else {
      callback([]);
    }
  });
};
