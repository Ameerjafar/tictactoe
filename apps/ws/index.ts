import WebSocket from "ws";
import { UserManager } from "./userManager";
import { getJSDocAugmentsTag, getNameOfDeclaration } from "typescript";

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
const userManger = new UserManager();
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");
  ws.on("message", (message: string) => {
    const objectData = JSON.parse(message);
    if (objectData.type === "createRoom") {
      const userObject = {
        ws,
        name: objectData.name,
        roomId: objectData.roomId,
        admin: objectData.admin,
        userId: objectData.userId,
        player: objectData.player,
        type: objectData.type,
        gameState: objectData.gameState,
      };
      userManger.addUser(userObject);
      ws.send(
        `room created successfully with ${userObject.roomId} and admin ${userObject.name}`
      );
    } else if (objectData.type === "joinRoom") {
      const userObject = {
        ws,
        name: objectData.name,
        roomId: objectData.roomId,
        admin: objectData.admin,
        userId: objectData.userId,
        player: objectData.player,
        type: objectData.type,
        gameState: objectData.gameState,
      };
      userManger.addUser(userObject);
      const getAllUser: any = userManger.getUserByRoom({
        roomId: userObject.roomId,
      });
      console.log("this is getAllUser", getAllUser)
      if (getAllUser === -1) {
        ws.send("room does not have any member");
      } else {
        getAllUser.forEach((user: any) => {
          console.log(user);
          if (
            user.ws !== ws && user.ws.readyState === WebSocket.OPEN
          ) {
            user.ws.send(`${objectData.name} joined the room`);
          }
        });
      }
    }
    console.log(`Received: ${message}`);
    ws.send(`Server received: ${message}`);
  });
  ws.on("close", () => {
    console.log("Client disconnected");
  });
  ws.on("error", (err: unknown) => {
    console.error("WebSocket error:", err);
  });
  ws.send("Welcome to WebSocket server!");
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
