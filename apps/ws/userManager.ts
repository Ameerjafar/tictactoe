import WebSocket from "ws";
type CurrentSymbol = "X" | "O";
interface GameState {
  currentSymbol: CurrentSymbol;
  currentState: string;
}
interface User {
  ws: WebSocket;
  name: string;
  admin: boolean;
  userId: string;
  player: boolean;
}

export class UserManager {
  private rooms!: Map<string, User[]>;
  private gameState!: Map<string, GameState>
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
    player,
    type,
    gameState
  }: {
    ws: WebSocket;
    name: string;
    roomId: string;
    admin: boolean;
    userId: string;
    player: boolean;
    type: string;
    gameState: GameState
  }) => {
    if (type === "joinRoom" && !this.rooms.get(roomId)) {
      console.log("room does not exist");
      return -1;
    }
    const existingUsers = this.rooms.get(roomId) ?? [];
    // console.log("existingUsers", this.rooms.get(roomId));
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
  updateState = ({ roomId, turn }: { roomId: string; turn: string }) => {
    const getUser = this.rooms.get(roomId);
    if (!getUser) {
      console.log("room does not exist");
      return -1;
    }
    return getUser;
  };
  getUserByRoom = ({ roomId }: { roomId: string }) => {
    console.log(roomId)
    const getAllUser = this.rooms.get(roomId);
    if (!getAllUser) {
      console.log("cannot find the room");
      return -1;
    }
    return getAllUser;
  };

}
