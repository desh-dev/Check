// gameComponents.ts

import { CardProps } from "@/components/Card";
import { v4 as uuidv4 } from 'uuid';
interface IGame {
    players: IPlayer[];
    //deck: ICard[];
   // boardCard: ICard | null;
    currentPlayerIndex: number;
    numberOfPlayers: number;
    numberOfCardsPerPlayer: number;
}

interface IPlayer {
    name: string;
   // hand: ICard[];
    numberOfCards: number;
}

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
    

   public  distributeCards(deck: CardProps[], numPlayers: number, numCardsPerPlayer: number): { playerHands: CardProps[][], remainingDeck: CardProps[] } {
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
    console.log(remainingDeck)

    return { playerHands: players, remainingDeck };
}    

playCard(boardCard: CardProps) {
        // Logic to play a card based on the board card
    }

    drawCard(deck: CardProps[]) {
        // Logic to draw a card from the deck
    }

    startGame() {
        // Logic to start the game, distribute cards, choose first card for the board
    }

    playTurn() {
        // Logic to handle a player's turn
    }

    determineWinner() {
        // Logic to determine the winner of the game
    }
}

export default new GameService;