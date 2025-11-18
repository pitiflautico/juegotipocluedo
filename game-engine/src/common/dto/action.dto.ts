export class MoveActionDto {
  roomId: string;
  targetRoomCode: string;
}

export class InspectActionDto {
  roomId: string;
}

export class UseAbilityDto {
  roomId: string;
  abilityData?: any;
}

export class ShareClueDto {
  roomId: string;
  targetPlayerId: string;
  clue: any;
}

export class ChatMessageDto {
  roomId: string;
  message: string;
}
