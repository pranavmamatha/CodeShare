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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoom = createRoom;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const websocket_1 = __importDefault(require("./websocket"));
const state_1 = require("./state");
const prisma_1 = require("../generated/prisma");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, websocket_1.default)(server);
const prisma = new prisma_1.PrismaClient();
app.use((0, cors_1.default)());
setInterval(() => {
}, 600000);
function roomIdGenerator() {
    function generate() {
        return Math.random()
            .toString(36)
            .substring(2, 2 + 5);
    }
    function check() {
        const id = generate();
        if (state_1.rooms.has(id)) {
            return [true, id];
        }
        else {
            return [false, id];
        }
    }
    while (true) {
        const data = check();
        if (data[0]) {
            continue;
        }
        else {
            return data[1];
        }
    }
}
function createRoom(newRoomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newRoom = yield prisma.room.create({
                data: {
                    id: newRoomId,
                    code: "",
                },
            });
            state_1.rooms.set(newRoom.id, new Set());
            return true;
        }
        catch (error) {
            console.error('Failed to create room:', error);
            return false;
        }
    });
}
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newRoomId = roomIdGenerator();
    const newRoom = yield createRoom(newRoomId);
    if (newRoom) {
        res.json({
            roomId: newRoomId,
        });
    }
    else {
        res.json({
            message: "error creating room"
        });
    }
}));
server.listen(3000);
