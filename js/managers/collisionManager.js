export class CollisionManager {
    constructor(engine) {
        this.engine = engine;
        this.player = engine.player;
        this.lastEatSoundTime = 0; // Időzítő a hangnak
    }

    init() { }

    checkCollisions() {
        const playerX = this.player.x;
        const playerY = this.player.y;
        const currentCell = document.getElementById(`cell-${playerX}-${playerY}`);

        if (currentCell) {
            const collectible = currentCell.querySelector('.hamburger');
            if (collectible) {
                this.handleCollision(collectible);
            }
        }
    }

    handleCollision(itemElement) {
        itemElement.remove(); // Törlés a DOM-ból
        
        this.engine.score = (this.engine.score || 0) + 10;

        // HANG RITKÍTÁSA: Csak akkor játssza le, ha eltelt legalább 150ms az előző óta
        const now = Date.now();
        if (now - this.lastEatSoundTime > 150) {
            if (this.engine.audioManager) {
                this.engine.audioManager.playSound('eat'); 
            }
            this.lastEatSoundTime = now;
        }

        // SZINTLÉPÉS ELLENŐRZÉSE: Maradt-e még hamburger?
        const remainingHambis = document.querySelectorAll('.hamburger').length;
        if (remainingHambis === 0) {
            console.log("Pálya kisöpörve! Szintlépés...");
            this.engine.nextLevel();
        }
    }
}