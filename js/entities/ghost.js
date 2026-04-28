export class Ghost {
    constructor(engine, type, cssClass) {
        this.engine = engine;
        this.type = type; 
        this.cssClass = cssClass; 
        this.x = 0;
        this.y = 0;
        this.ghostDiv = null;

        // Mozgás időzítése
        this.moveTimer = 0;
        this.moveInterval = 400; // 400ms-enként lép
    }

    init() {
        this.ghostDiv = document.createElement("div");
        this.ghostDiv.className = `ghost ${this.cssClass}`;
        
        let spawnPos = this.getSpawnPositionInHouse();
        if (spawnPos) {
            this.x = spawnPos.x;
            this.y = spawnPos.y;
            this.updateDOMPosition();
        } else {
            console.error("Nem találtam szellemházat a pálya generálása után!");
        }
    }

    getSpawnPositionInHouse() {
        let mapData = this.engine.labyrinth.mapData;
        let validPositions = [];
        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                if (mapData[y][x] === 3) validPositions.push({ x: x, y: y });
            }
        }
        return validPositions.length > 0 ? validPositions[0] : null;
    }

    update(deltaTime) {
        this.moveTimer += deltaTime;

        if (this.moveTimer >= this.moveInterval) {
            this.moveTimer = 0; 
            this.moveTowardsPlayer();
        }
    }

    moveTowardsPlayer() {
        let start = { x: this.x, y: this.y };
        let end = { x: this.engine.player.x, y: this.engine.player.y };

        // Itt hívjuk meg a Labirintusba áthelyezett saját BFS logikádat!
        let nextStep = this.engine.labyrinth.getGhostNextStepBFS(start, end);
        
        if (nextStep) {
            this.x = nextStep.x;
            this.y = nextStep.y;
            this.updateDOMPosition();
        }
    }

    updateDOMPosition() {
        if (!this.ghostDiv) return;
        
        let targetCell = document.getElementById(`cell-${this.x}-${this.y}`);
        if (targetCell && this.ghostDiv.parentElement !== targetCell) {
            targetCell.appendChild(this.ghostDiv);
        }
    }
}