import { useState, useLayoutEffect } from "react";
import { get } from "idb-keyval";

function useObjectStore({ id }: { id: string }) {
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

export function ObjectStoreImage({
  imageId,
  ...rest
}: { imageId: string } & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  const url = useObjectStore({ id: imageId });
  if (!url) return null;
  return <img {...rest} src={url} />;
}

export function ObjectStoreAudio({
  audioId,
  ...rest
}: { audioId: string } & React.DetailedHTMLProps<
  React.AudioHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
>) {
  const url = useObjectStore({ id: audioId });
  if (!url) return null;
  return <audio {...rest} src={url} />;
}
