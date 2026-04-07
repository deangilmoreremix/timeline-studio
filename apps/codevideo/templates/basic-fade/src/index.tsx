import { setRootComponent, Composition } from '@rendiv/core';
import { BasicFade } from './compositions/BasicFade';

setRootComponent(() => (
  <Composition
    id="BasicFade"
    component={BasicFade}
    durationInFrames={90}  // 3 seconds at 30fps
    fps={30}
    width={1920}
    height={1080}
  />
));