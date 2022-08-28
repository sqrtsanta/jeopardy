import { useState, useLayoutEffect } from "react";
import { set, del, delMany, get } from "idb-keyval";
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
    if (id == null) {
      return Promise.resolve();
    }
    return del(`objects/${id}`);
  };

  const clearFiles = (ids: Array<string | undefined>) => {
    return delMany(ids.filter(id => id != null).map((id) => `objects/${id}`));
  }

  return {
    selectFile,
    clearFile,
    clearFiles,
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