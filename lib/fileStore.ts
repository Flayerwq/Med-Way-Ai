import { openDB } from 'idb';

export const saveFile = async (fileId: string, file: File) => {
  const db = await openDB("fileDB", 1, {
    upgrade(db) {
      db.createObjectStore("files");
    },
  });

  const tx = db.transaction("files", "readwrite");
  const store = tx.objectStore("files");
  await store.put(file, fileId);
  await tx.done;
};

export const getFile = async (fileId: string): Promise<File | null> => {
  console.log(`Attempting to fetch file with fileId: ${fileId}`);
  const db = await openDB("fileDB", 1);
  console.log("Database opened successfully.");

  const tx = db.transaction("files", "readonly");
  const store = tx.objectStore("files");

  const file = await store.get(fileId);
  console.log(`Fetched file for ${fileId}:`, file);

  return file || null;
};


export const deleteFile = async (fileId: string) => {
  const db = await openDB("fileDB", 1);
  const tx = db.transaction("files", "readwrite");
  const store = tx.objectStore("files");
  await store.delete(fileId);
  await tx.done;
};