import { useObject } from "./useObjectStore";

export function ObjectStoreImage({
  imageId,
  ...rest
}: { imageId: string } & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>) {
  const url = useObject({ id: imageId });
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
  const url = useObject({ id: audioId });
  if (!url) return null;
  return <audio {...rest} src={url} />;
}
