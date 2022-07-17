import { useJeos } from "./useJeos";
import { type IJeo } from "../types";
import { NavEnum, useNavigation } from "../navigation";
import { clsx } from "../utils/clsx";

export function JeosPage() {
  const { jeos } = useJeos();

  return (
    <div className="jeo-item-list">
      <JeoItemNew />
      {jeos.map((jeo) => (
        <JeoItem key={jeo.id} jeo={jeo} />
      ))}
    </div>
  );
}

function JeoItemNew() {
  const { go } = useNavigation();

  return (
    <div className={clsx("jeo-item", "jeo-item-as-button")}>
      <button
        type="button"
        className="overlay-button"
        onClick={() => go({ type: NavEnum.JeoForm })}
      >
        + New
      </button>
    </div>
  );
}

function JeoItem({ jeo }: { jeo: IJeo }) {
  const { go } = useNavigation();

  return (
    <div className="jeo-item">
      <button
        type="button"
        className="overlay-button"
        onClick={() => go({ type: NavEnum.JeoForm, jeoId: jeo.id })}
      >
        <div>{jeo.title}</div>
        <div className="jeo-item__ts">
          {new Date(jeo.createdAt).toLocaleString()}
        </div>
      </button>
    </div>
  );
}
