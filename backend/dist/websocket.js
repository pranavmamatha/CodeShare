"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = wsServer;
const ws_1 = require("ws");
const state_1 = require("./state");
const prisma_1 = require("../generated/prisma");
const index_1 = require("./index");
const prisma = new prisma_1.PrismaClient();
const roomDataState = new Map();
function saveToDatabase(roomId, code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.room.update({
                where: {
                    id: roomId
                },
                data: {
                    code: code
                }
            });
            console.log(`Saved code for room ${roomId} to database`);
        }
        catch (error) {
            console.error(`Failed to save code for room ${roomId}:`, error);
        }
    });
}
function scheduleAutoSave(roomId, code) {
    const roomData = roomDataState.get(roomId);
    if (roomData === null || roomData === void 0 ? void 0 : roomData.timeoutId) {
        clearTimeout(roomData.timeoutId);
    }
    const timeoutId = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
        yield saveToDatabase(roomId, code);
        roomDataState.delete(roomId);
    }), 10000);
    roomDataState.set(roomId, {
        code,
        timeoutId
    });
}
function loadFromDatabase(roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const room = yield prisma.room.findUnique({
                where: { id: roomId }
            });
            return (room === null || room === void 0 ? void 0 : room.code) || null;
        }
        catch (error) {
            console.error(`Failed to load code for room ${roomId}:`, error);
            return null;
        }
    });
}
function wsServer(server) {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (socket) => {
        socket.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
            const parsedMessage = JSON.parse(message);
            const roomId = parsedMessage.payload.roomId;
            const reqType = parsedMessage.type;
            if (!state_1.rooms.get(roomId)) {
                yield (0, index_1.createRoom)(roomId);
            }
            if (reqType === "join") {
                const connections = state_1.rooms.get(roomId);
                connections === null || connections === void 0 ? void 0 : connections.add(socket);
                const roomData = roomDataState.get(roomId);
                if (roomData) {
                    socket.send(roomData.code);
                }
                else {
                    const code = yield loadFromDatabase(roomId);
                    if (code) {
                        socket.send(code);
                    }
                }
            }
            if (reqType === "code") {
                if (state_1.rooms.has(roomId)) {
                    const code = parsedMessage.payload.code;
                    const connections = state_1.rooms.get(roomId);
                    scheduleAutoSave(roomId, code);
                    if (connections) {
                        connections.forEach((s) => {
                            if (s !== socket) {
                                s.send(code);
                            }
                        });
                    }
                }
            }
        }));
        socket.on("close", () => {
            for (const sockets of state_1.rooms.values()) {
                if (sockets.has(socket)) {
                    sockets.delete(socket);
                }
            }
        });
    });
}
