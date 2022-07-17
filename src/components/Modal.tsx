import { useNavigation } from "../navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const { closeModal } = useNavigation();

  return (
    <div className="modal-box">
      <div className="modal-content">{children}</div>
    </div>
  );
}
