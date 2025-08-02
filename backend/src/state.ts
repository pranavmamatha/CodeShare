import WebSocket from "ws";
let rooms = new Map<string, Set<WebSocket>>();
export {rooms};