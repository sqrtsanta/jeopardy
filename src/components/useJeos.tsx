import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { get, set } from "idb-keyval";

import { type IJeo } from "../types";
import { useObjectForm } from "./useObjectStore";

const store = createContext<{
  jeos: IJeo[];
  create: (jeo: IJeo) => void;
  update: (jeo: IJeo) => void;
  destroy: (jeo: IJeo) => void;
}>({
  jeos: [],
  create: () => {},
  update: () => {},
  destroy: () => {},
});

export function JeosProvider({ children }: { children: ReactNode }) {
  const [jeos, setJeos] = useState<IJeo[]>(() => {
    const json = localStorage.getItem("jeos");
    if (!json) return [];
    try {
      const value = JSON.parse(json);
      return value;
    } catch (error) {
      console.log(error);
      return [];
    }
  });

  const { clearFiles } = useObjectForm();

  useLayoutEffect(() => {
    get("jeos").then((jeos) => {
      if (jeos != null && jeos.length > 0) {
        setJeos(jeos);
      }
    });
  }, []);

  useEffect(() => {
    set("jeos", jeos);
  }, [jeos]);

  const value = useMemo(() => {
    const create = (jeo: IJeo) => {
      setJeos((jeos) => jeos.concat(jeo));
    };
    const update = (jeo: IJeo) => {
      setJeos((jeos) => jeos.map((item) => (item.id === jeo.id ? jeo : item)));
    };
    const destroy = (jeo: IJeo) => {
      clearFiles(
        jeo.questions.flatMap((question) => [
          question.audioId,
          question.imageId,
        ])
      );

      setJeos((jeos) => jeos.filter((item) => item.id !== jeo.id));
    };

    return {
      create,
      update,
      destroy,
      jeos,
    };
  }, [jeos]);

  return <store.Provider value={value}>{children}</store.Provider>;
}

export function useJeos() {
  return useContext(store);
}
