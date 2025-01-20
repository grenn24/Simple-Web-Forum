
const baseURL = "https://nus-gossips-6a2501962208.herokuapp.com/api";

// Create a websocket and specify optional callback functions for open, close, websocket error events (can specify afterwards also)
export function createWebsocket(
	url: string,
	onOpen: (event: Event) => void = () => {},
	onClose: (event: Event) => void = () => {},
	onError: (event: Event) => void = () => {}
) {
	const websocket = new WebSocket(baseURL + url);
	websocket.onopen = onOpen;
	websocket.onclose = onClose;
	websocket.onerror = onError;
    return websocket;
}

export function closeWebsocket(websocket: WebSocket) {
	websocket.readyState === websocket.OPEN &&
		websocket.close(1000, "Connection ended");
}
