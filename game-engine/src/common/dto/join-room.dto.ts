export class JoinRoomDto {
  roomId: string;
  playerInfo: {
    userId: string;
    name: string;
    role?: string;
  };
}
