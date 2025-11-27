import WebSocket from "ws";
import { GameManager } from "./GameManager";

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
const gameManager = new GameManager();
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
      gameManager.addUser(userObject);
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
      gameManager.addUser(userObject);
      const getAllUser: any = gameManager.getUserByRoom({
        roomId: userObject.roomId,
      });
      console.log("this is getAllUser", getAllUser);
      if (getAllUser === -1) {
        ws.send("room does not have any member");
      } else {
        getAllUser.forEach((user: any) => {
          console.log(user);
          if (user.ws !== ws && user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(`${objectData.name} joined the room`);
          }
        });
      }
    } else if (objectData.type === "updateGameState") {
      if(!objectData.player) {
        ws.send("you cannot update the game because you are a spectator.")
      }
      const roomId = objectData.roomId;
      const currentState = objectData.gameState;

      const gameCurrentState = gameManager.updateState({
        roomId,
        currentState,
      });
      const allUser: any = gameManager.getUserByRoom({ roomId });
      allUser.forEach((user: any) => {
        if (user.ws !== ws && user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify(gameCurrentState));
        }
      });
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
