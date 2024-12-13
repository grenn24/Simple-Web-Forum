import useSound from "use-sound";

interface SpriteMap  {
    [key: string]: [number, number];
};

const playerGenerator = ( path: string, volume: number, sprite?: object, spriteId?: string) => {
	const player = useSound(path, {
		volume: volume,
		sprite: sprite as SpriteMap,
	})[0];
    return () => player({id: spriteId});
};

export default playerGenerator;
