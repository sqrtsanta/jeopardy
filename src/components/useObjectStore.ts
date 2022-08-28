import { useState, useLayoutEffect } from "react";
import { set, del, get } from "idb-keyval";
import { nanoid } from "nanoid";

export function useObjectForm() {
  const selectFile = (list: FileList | null) => {
    const file = list?.[0];
    if (!file) {
      throw new Error("No file selected")
    };
    const fileId = nanoid();
    return set(`objects/${fileId}`, file).then(() => fileId);
  };

  const clearFile = (id: string | undefined) => {
    return del(`objects/${id}`);
  };

  return {
    selectFile,
    clearFile,
  }
}

export function useObject({ id }: { id: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useLayoutEffect(() => {
    let url: string;
    let unmounted = false;

    get(`objects/${id}`).then((blob) => {
      if (!unmounted && blob != null) {
        url = URL.createObjectURL(blob);
        setUrl(url);
      }
    });

    return () => {
      unmounted = true;
      URL.revokeObjectURL(url);
    };
  }, [id]);

  return url;
}