import WebSocket from "ws";
type Turn = "X" | "O";
interface GameState {
  currentState: ["", "", "", "", "", "", "", "", ""];
}
interface User {
  ws: WebSocket;
  name: string;
  admin: boolean;
  userId: string;
  player: boolean
}

export class GameManager {
  private rooms!: Map<string, User[]>;
  private gameState!: Map<string, GameState>;
  constructor() {
    this.rooms = new Map();
    this.gameState = new Map();
  }
  addUser = ({
    ws,
    name,
    roomId,
    admin,
    userId,
    type,
    gameState,
    player
  }: {
    ws: WebSocket;
    name: string;
    roomId: string;
    admin: boolean;
    userId: string;
    type: string;
    gameState: GameState;
    player: boolean
  }) => {
    if (type === "joinRoom" && !this.rooms.get(roomId)) {
      console.log("room does not exist");
      return -1;
    }
    const existingUsers = this.rooms.get(roomId) ?? [];
    this.rooms.set(roomId, [
      ...existingUsers,
      { ws, name, admin, userId, player },
    ]);
    this.gameState.set(roomId, gameState);
    console.log("hello this is from the room", this.rooms);
  };
  removeUser = ({ roomId, userId }: { roomId: string; userId: string }) => {
    const getAllUser = this.rooms.get(roomId);
    const removeUser = getAllUser?.filter((user) => {
      return user.userId !== userId;
    });
    if (getAllUser?.length === removeUser?.length) {
      console.log(
        "this user not in this room, so you cannot remove this person"
      );
      return -1;
    } else {
      this.rooms.set(roomId, removeUser!);
    }
  };
  getUserByRoom = ({ roomId }: { roomId: string }) => {
    console.log(roomId);
    const getAllUser = this.rooms.get(roomId);
    if (!getAllUser) {
      console.log("cannot find the room");
      return -1;
    }
    return getAllUser;
  };
  removeRooms = ({ roomId }: { roomId: string }) => {

    const room = this.rooms.get(roomId);
    if (!room) {
      console.log("room does not exist");
      return -1;
    }
    this.rooms.delete(roomId);
  };
}
