import { NavEnum, useNavigation } from "../navigation";

export function Header() {
  const { go, page } = useNavigation();

  return (
    <div>
      <div className="header-box">
        <button
          type="button"
          onClick={() => go({ type: NavEnum.Jeos })}
          className="header-button"
        >
          JEOPARTY
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "12px",
          }}
        >
          {page.type === NavEnum.JeoForm && !page.jeoId && "New Jeo"}
          {page.type === NavEnum.JeoForm && page.jeoId && "Edit Jeo"}
          {page.type === NavEnum.Jeos && "My Jeos"}
        </div>
      </div>
    </div>
  );
}
