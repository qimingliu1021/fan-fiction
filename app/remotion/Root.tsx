import { Composition } from "remotion";
import { Slideshow } from "./Slideshow";

export const RemotionRoot = () => (
  <>
    <Composition
      id="Slideshow"
      component={Slideshow}
      durationInFrames={1800}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
