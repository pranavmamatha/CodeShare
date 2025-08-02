import { WebSocketServer } from "ws";
import {rooms} from "./state";
import http from "http";
import { PrismaClient } from "../generated/prisma";
import { createRoom } from "./index";

const prisma = new PrismaClient();

interface RoomData {
  code: string;
  timeoutId?: NodeJS.Timeout;
}

const roomDataState = new Map<string, RoomData>();

async function saveToDatabase(roomId: string, code: string) {
  try {
    await prisma.room.update({
      where: {
        id: roomId
      },
      data: {
        code: code
      }
    })
    console.log(`Saved code for room ${roomId} to database`);
  } catch (error) {
    console.error(`Failed to save code for room ${roomId}:`, error);
  }
}

function scheduleAutoSave(roomId: string, code: string){
  const roomData = roomDataState.get(roomId);
  if(roomData?.timeoutId){
    clearTimeout(roomData.timeoutId)
  }

  const timeoutId = setTimeout(async ()=>{
    await saveToDatabase(roomId, code);
    roomDataState.delete(roomId);
  }, 10000)

  roomDataState.set(roomId, {
    code,
    timeoutId
  })
}


async function loadFromDatabase(roomId: string): Promise<String | null> {
  try{
    const room = await prisma.room.findUnique({
      where:{id: roomId}
    })
    return room?.code||null;
  } catch(error){
    console.error(`Failed to load code for room ${roomId}:`, error);
    return null;
  }
}

export default function wsServer(server: http.Server) {
  const wss = new WebSocketServer({ server });
  wss.on("connection", (socket) => {
    socket.on("message", async (message: string) => {
      const parsedMessage = JSON.parse(message);
      const roomId = parsedMessage.payload.roomId;
      const reqType = parsedMessage.type;
      if(!rooms.get(roomId)){
        await createRoom(roomId);
      }
      if (reqType === "join") {
        const connections = rooms.get(roomId);
        connections?.add(socket);
        const roomData = roomDataState.get(roomId);
        if (roomData){
          socket.send(roomData.code);
        } else{
          const code = await loadFromDatabase(roomId)
          if(code){
            socket.send(code);
          }
        }
      }
      if (reqType === "code") {
        if (rooms.has(roomId)) {
          const code = parsedMessage.payload.code
          const connections = rooms.get(roomId);
          scheduleAutoSave(roomId, code);
          if (connections) {
            connections.forEach((s) => {
            if (s!==socket) {
                s.send(code);
            }
            });
          }
        }
      }
    });
    socket.on("close", () => {
      for (const sockets of rooms.values()) {
        if (sockets.has(socket)) {
          sockets.delete(socket);
        }
      }
    });
  });
}
