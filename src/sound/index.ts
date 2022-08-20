import arrogantSrc from "./static/arrogant-324.mp3?url";
import beyondDoubtSrc from "./static/beyond-doubt-2-581.mp3?url";
import decaySrc from "./static/decay-475.mp3?url";
import sunnySrc from "./static/sunny-329.mp3?url";

const play = (src: string) => {
  const audio = new Audio(src);
  audio.play();
}

export const sound = {
  correct() {
    play(sunnySrc);
  },
  incorrect() {
    play(arrogantSrc);
  },
  timeIsTicking() {
    play(decaySrc);
  },
  lead() {
    play(beyondDoubtSrc);
  }
}