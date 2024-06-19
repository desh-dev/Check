import gameService from "./gameService";

// assetLoader.ts
const deck = gameService.generateFullDeck();
const preloadAssets = async () => {
  // Load all the required assets here (images, sounds, etc.)
  const imagePromises: Promise<unknown>[] = [];

    for (let i = 0; i < deck.length; i++) {
      const image = new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.src = `../../src/assets/${deck[i].suit}_${deck[i].rank}.svg`;
    })
    imagePromises.push(image);
    }
   
    // Add more image loading promises for other assets

  // Wait for all image promises to resolve
  await Promise.all(imagePromises);
};
export default preloadAssets;