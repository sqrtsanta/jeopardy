import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import { type IJeo } from "./types";

export type IPage =
  | {
    type: NavEnum.Jeos;
  }
  | {
    type: NavEnum.JeoForm;
    jeoId?: string;
  };

export type IModal = {
  type: NavEnum.JeoPlay;
  jeo: IJeo;
};

export enum NavEnum {
  Jeos,
  JeoPlay,
  JeoForm,
}

const navigation = createContext<{
  modal?: IModal;
  page: IPage;
  go(page: IPage): void;
  openModal(modal: IModal): void;
  closeModal(): void;
}>({
  page: { type: NavEnum.Jeos },
  go: () => { },
  openModal: () => { },
  closeModal: () => { },
});

export const NavigationProvider = navigation.Provider;

export function useNavigationBuilder() {
  const [page, setPage] = useState<IPage>({ type: NavEnum.Jeos });
  const [modal, setModal] = useState<IModal>();

  const value = useMemo(
    () => ({
      modal,
      page,
      go: setPage,
      openModal: setModal,
      closeModal: () => setModal(undefined),
    }),
    [page, modal]
  );

  return value;
}

export function useNavigation() {
  return useContext(navigation);
}