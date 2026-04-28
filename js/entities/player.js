export class Player {
    constructor(engine) {
        this.engine = engine;
        this.direction = "";
        this.currentDirection = "";
        this.spawnPosition = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
        this.moveInterval = 100;
        this.moveTimer = 0;
    }

    init() {
        // Visszaállítjuk az irányokat és az időzítőt alaphelyzetbe (szintlépés miatt nagyon fontos!)
        this.direction = "";
        this.currentDirection = "";
        this.moveTimer = 0;

        // Lekérjük a spawn pozíciót
        this.spawnPosition = this.engine.labyrinth.getSpawnPosition();
        this.x = this.spawnPosition.x;
        this.y = this.spawnPosition.y;

        // Ha esetleg már létezik a DOM-ban egy játékos, töröljük a biztonság kedvéért
        let existingPlayer = document.getElementById("player");
        if (existingPlayer) existingPlayer.remove();

        // Létrehozzuk frissen az új pályára
        this.playerDiv = document.createElement("div");               
        this.playerDiv.id = "player";
        this.playerDiv.style.backgroundImage = "url('../src/image/fatman-front.png')"; // Alapértelmezett nézésirány
        
        let startCell = document.getElementById(`cell-${this.x}-${this.y}`);
        if (startCell) {
            startCell.appendChild(this.playerDiv);
        }
    }

    update(deltaTime) {
        this.moveTimer += deltaTime;

        // Csak akkor lépünk, ha letelt az időzítő
        if (this.moveTimer >= this.moveInterval) {
            
            let mapData = this.engine.labyrinth.mapData;

            // Bekanyarodás 
            let wantedX = this.x;
            let wantedY = this.y;

            if (this.direction === "up") wantedY--;
            else if (this.direction === "down") wantedY++;
            else if (this.direction === "left") wantedX--;
            else if (this.direction === "right") wantedX++;

            if ((this.direction !== "") && mapData[wantedY] && mapData[wantedY][wantedX] === 0) {
                // Nyitott a kanyar ==> fordulás
                this.currentDirection = this.direction;
                this.x = wantedX;
                this.y = wantedY;
            } 
            else {
                // Ha a kanyar zárva van (fal) ==> irány
                let currentX = this.x;
                let currentY = this.y;

                if (this.currentDirection === "up") currentY--;
                else if (this.currentDirection === "down") currentY++;
                else if (this.currentDirection === "left") currentX--;
                else if (this.currentDirection === "right") currentX++;

                let canMoveCurrent = (this.currentDirection !== "") && mapData[currentY] && mapData[currentY][currentX] === 0;

                if (canMoveCurrent) {
                    // Megyünk tovább az eredeti úton
                    this.x = currentX;
                    this.y = currentY;
                }
            }

            this.moveTimer = 0; // Nullázzuk a stoppert
        }
    }

    spawn() {
        console.log("Player spawned: ", this.x, this.y)
    }
}