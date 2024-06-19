// gameComponents.ts

import { CardProps } from "@/components/Card";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

class GameService {

    public generateFullDeck(): CardProps[] {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = [
            '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'
        ];
        
        const deck: CardProps[] = [];
        
        suits.forEach(suit => {
            ranks.forEach(rank => {
                const id = uuidv4();
                deck.push({ suit, rank, id });
            });
        });
        deck.push({ suit: 'joker', rank: 'red', id: uuidv4() });
        deck.push({suit: 'joker', rank: 'black' , id: uuidv4() });
        
        return deck;
    }
    

   public  distributeCards(deck: CardProps[], numPlayers: number, numCardsPerPlayer: number): { playerHands: CardProps[][], remainingDeck: CardProps[] | undefined,  boardCard: CardProps | undefined} {
    const players: CardProps[][] = [];
    const remainingDeck: CardProps[] = [...deck];

    for (let i = 0; i < numPlayers; i++) {
        const playerCards: CardProps[] = [];
        for (let j = 0; j < numCardsPerPlayer; j++) {
            const randomIndex = Math.floor(Math.random() * remainingDeck.length);
            const card = remainingDeck.splice(randomIndex, 1)[0];
            playerCards.push(card);
        }
        players.push(playerCards);
    }
    const randomBoardIndex = Math.floor(Math.random() * remainingDeck.length);
    const boardCard = remainingDeck.splice(randomBoardIndex, 1)[0];

    return { playerHands: players, remainingDeck, boardCard};
}    
 public getRandomCard = (deck: CardProps[]): CardProps | undefined => {
    if (deck.length === 0) {
      return undefined; // Deck is empty
    }
  
    const randomIndex = Math.floor(Math.random() * deck.length);
    const randomCard = deck.splice(randomIndex, 1)[0];
  
    return randomCard;
  };

  public pickNCards = (n: number, newDeck: CardProps[]) : {drawnCards: CardProps[], remainingDeck:CardProps[]} => {
    
    const drawnCardArr: CardProps[] = [];
    const remainingDeck: CardProps[] = [...newDeck];

    for (let i = 0; i < n; i++) {
        if(newDeck.length === 0) {
            console.log("Deck is empty");
            break;
        }
      // Generate a random card from the remaining deck
      const randomIndex = Math.floor(Math.random() * remainingDeck.length);
    const drawnCard = remainingDeck.splice(randomIndex, 1)[0];

      drawnCardArr.push(drawnCard as CardProps);
    }
    return {drawnCards: drawnCardArr, remainingDeck};
}

public async createGameRoom(socket: Socket, roomId: string, opponent1: string, stake?: number | null): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("create_room", { roomId, opponent1, stake });
      socket.on("room_created", () => rs(true));
      socket.on("create_room_error", ({ error }) => rj(error));
    });
  }
public async joinGameRoom(socket: Socket, roomId: string, opponent2: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_room", { roomId, opponent2 });
      socket.on("room_joined", () => rs(true));
      socket.on("room_join_error", ({ error }) => rj(error));
    });
  }

public async updateGame(socket: Socket, gameState: any) {
    socket.emit("update_game_state", gameState );
  }
public async playAgain(socket: Socket, gameState: any) {
    socket.emit("play_again", gameState );
  }
public async leaveRoom (socket: Socket, roomName: string) {
  socket.emit("leave_room", { roomName });
}
public async insufficientBalance (socket: Socket, roomName: string) {
    socket.emit("insufficient_balance", {roomName});
  }
public async computeNewBalance (supabase: SupabaseClient<any, "public", any>, user: User | null | undefined, tempBalance: number | null | undefined, winnings: number) {
    if (user && tempBalance && winnings > 0) {
      const newBalance = tempBalance - winnings * 0.1;
      
      const { data, error } = await supabase
      .from('profiles')
      .update({ account_balance: newBalance })
      .eq('id', user.id)
      .select()
      if (error) {
        throw new Error (error.message);
      }
      console.log(data);
      return newBalance;
    } else if (user && tempBalance && winnings <= 0) {
      const { data, error } = await supabase
      .from('profiles')
      .update({ account_balance: tempBalance })
      .eq('id', user?.id)
      .select()
      if (error) {
        throw new Error (error.message);
      }
      console.log(data);
      return tempBalance;
    }
  }
}

export default new GameService;