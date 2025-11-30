import WebSocket from "ws";
import { GameManager } from "./GameManager";
const PORT = 8080;
const wss = new WebSocket.Server({
  port: PORT,
});
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
        type: objectData.type,
        gameState: objectData.gameState,
        symbol: objectData.symbol,
        player: objectData.player
      };
      gameManager.addUser(userObject);
      ws.send(
        JSON.stringify(
          { ...objectData, twoPlayer: objectData.player ? 1 : 0 }
        )
      );
    }
    else if (objectData.type === 'message') {
      const message = objectData.message;
      const allUser: any = gameManager.getUserByRoom({ roomId: objectData.roomId });
      if (allUser === -1) {
        ws.send(JSON.stringify("we cannot find this room"));
        return;
      }
      allUser.forEach((user: any) => {
        if (user.ws !== ws && user.ws.readyState === WebSocket.OPEN) {
          console.log("inside the user handler");
          const object = {
            type: "message",
            message,
            roomId: objectData.roomId
          }
          user.ws.send(JSON.stringify(object));
        }
      })
    }
    else if (objectData.type === "joinRoom") {
      const userObject = {
        ws,
        name: objectData.name,
        roomId: objectData.roomId,
        admin: objectData.admin,
        userId: objectData.userId,
        type: objectData.type,
        gameState: objectData.symbol,
        player: objectData.player,
      };
      gameManager.addUser(userObject);
      const getAllUser: any = gameManager.getUserByRoom({
        roomId: userObject.roomId,
      });
      let twoPlayer = 0;
      getAllUser.forEach((user: any) => {
        if (user.player) {
          twoPlayer++;
        }
      })
      console.log("this is getAllUser", getAllUser);
      if (getAllUser === -1) {
        ws.send(JSON.stringify("room does not have any member"));
      } else {
        getAllUser.forEach((user: any) => {
          console.log(user);
          if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify({ ...objectData, twoPlayer }));
            console.log(JSON.stringify({ ...objectData, twoPlayer }))
          }
        });
      }
    } else if (objectData.type === "updateGameState") {
      console.log("inside the update game state");
      const roomId = objectData.roomId;
      if (!roomId) {
        return ws.send(JSON.stringify("we cannot find the roomId"));
      }
      const allUser: any = gameManager.getUserByRoom({ roomId });
      allUser.forEach((user: any) => {
        if (user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify(objectData));
        }
      });
    }
    if (objectData.type === "restartGame") {
      console.log("Admin restarting game");
      const roomId = objectData.roomId;
      if (!roomId) {
        ws.send(JSON.stringify("we cannot find the roomId"));
      }
      const allUser: any = gameManager.getUserByRoom({ roomId });
      allUser.forEach((user: any) => {
        if (user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify(objectData));
        }
      });
    }
    if (objectData.gameOver === true) {
      console.log("backend game over", objectData.gameOver);
      const roomId = objectData.roomId;
      const allUser: any = gameManager.getUserByRoom({ roomId });
      allUser.forEach((user: any) => {
        if (user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify("game is over"));
        }
      });
    }
    if (objectData.type === 'closeRoom') {
      const roomId = objectData.roomId;
      const allUser: any = gameManager.getUserByRoom({ roomId });
      allUser.forEach((user: any) => {
        if (user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify(objectData));
        }
      });

      const removeRoom = gameManager.removeRooms({ roomId });
      if (removeRoom === -1) {
        ws.send(JSON.stringify("room does not exist"));
      }
    }
    console.log(`Received: ${message}`);
    // ws.send(JSON.stringify(objectData));
  });
  ws.on("close", () => {

    console.log("Client disconnected");
  });
  ws.on("error", (err: unknown) => {
    console.error("WebSocket error:", err);
  });
  ws.send(JSON.stringify("Welcome to WebSocket server!"));
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
