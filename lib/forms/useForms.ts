"use client";
import { useCallback, useEffect, useState } from "react";
import { loadForms, saveForms, type FormEntry } from "./store";

/** Shared by My Forms and the countdown; other tabs' edits arrive through the storage event. */
export function useForms() {
  const [forms, setForms] = useState<FormEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    setForms(loadForms());
    setReady(true);
    const onStorage = (e: StorageEvent) => { if (e.key === "fs:myForms") setForms(loadForms()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((next: FormEntry[]) => {
    setForms(next);
    setSaveFailed(!saveForms(next));
  }, []);

  return { forms, ready, saveFailed, update };
}
