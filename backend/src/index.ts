import express from "express";
import http from "http";
import cors from "cors";
import wsServer from "./websocket";
import {rooms} from "./state";
import { PrismaClient } from "../generated/prisma";

const app = express();
const server = http.createServer(app);
wsServer(server);

const prisma = new PrismaClient();

app.use(cors());

setInterval(()=>{

}, 600000)

function roomIdGenerator(): string {
  function generate() {
    return Math.random()
      .toString(36)
      .substring(2, 2 + 5);
  }
  function check(): [boolean, string] {
    const id = generate();
    if (rooms.has(id)) {
      return [true, id];
    } else {
      return [false, id];
    }
  }
  while (true) {
    const data = check();
    if (data[0]) {
      continue;
    } else {
      return data[1];
    }
  }
}

export async function createRoom(newRoomId: string){
  try {
    const newRoom = await prisma.room.create({
      data: {
        id: newRoomId,  
        code: "",
      },
    });
    rooms.set(newRoom.id, new Set());
    return true;
  } catch (error) {
    console.error('Failed to create room:', error);
    return false;
  }
}


app.get("/", async (req, res) => {
  const newRoomId = roomIdGenerator();
  const newRoom = await createRoom(newRoomId);
  if(newRoom){
    res.json({
      roomId: newRoomId,
    });
  } else{
    res.json({
      message: "error creating room"
    })
  }
});

server.listen(3000);
