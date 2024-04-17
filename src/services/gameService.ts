// gameComponents.ts

interface ICard {
    number: number;
    suit: string;
}

class Card implements ICard {
    constructor(public number: number, public suit: string) {}
}

interface IPlayer {
    name: string;
    hand: ICard[];
    numberOfCards: number;
}

class Player implements IPlayer {
    constructor(public name: string, public numberOfCards: number) {
        this.hand = [];
    }

    playCard(boardCard: ICard) {
        // Logic to play a card based on the board card
    }

    drawCard(deck: ICard[]) {
        // Logic to draw a card from the deck
    }
}

interface IGame {
    players: IPlayer[];
    deck: ICard[];
    boardCard: ICard | null;
    currentPlayerIndex: number;
    numberOfPlayers: number;
    numberOfCardsPerPlayer: number;
}

class Game implements IGame {
    constructor(public numberOfPlayers: number, public numberOfCardsPerPlayer: number) {
        this.players = [];
        this.deck = [];
        this.boardCard = null;
        this.currentPlayerIndex = 0;
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

export { Card, Player, Game };