import { entries, setMany } from "idb-keyval";

const prefix = "blob:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855:"

const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      resolve(reader.result as string);
    };
  });
};

const base64toBlob = (data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(data.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

export async function exportToJSON() {
  const all = await entries();

  const serialized = await Promise.all(all.map(([key, value]) => {
    if (value instanceof Blob) {
      return blobToBase64(value).then((message) => [key, `${prefix}${message}`]);
    } else {
      return Promise.resolve([key, value])
    }
  }))

  const doc = JSON.stringify({
    version: 1,
    entries: serialized,
  });

  return doc;
}

export async function importFromJSON(json: string) {
  let doc: {
    version: number;
    entries: Array<[key: string, value: unknown]>;
  };

  try {
    doc = JSON.parse(json);
  } catch (error) {
    throw new Error("Incorrect JSON");
  }

  if (!("version" in doc && "entries" in doc)) {
    throw new Error("Incorrect format");
  }

  if (doc.version !== 1) {
    throw new Error("Incorrect version");
  }

  const deserialized = doc.entries.map<[IDBValidKey, unknown]>(([key, value]) => {
    if (typeof value === "string" && value.startsWith(prefix)) {
      return [key, base64toBlob(value.substring(prefix.length))]
    } else {
      return [key, value]
    }
  });

  await setMany(deserialized);
}
