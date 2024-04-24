// gameComponents.ts

import { CardProps } from "@/components/Card";
import { v4 as uuidv4 } from 'uuid';

class GameService {

    public generateFullDeck(): CardProps[] {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
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
}

export default new GameService;