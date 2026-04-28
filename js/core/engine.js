import { Renderer } from './renderer.js';
import { UiManager } from '../managers/uiManager.js';
import { LangManager } from '../managers/langManager.js';
import { AudioManager } from '../managers/audioManager.js';
import { SaveManager } from '../managers/saveManager.js';
import { InputManager } from '../managers/inputManager.js';
import { Labyrinth } from './labyrinth.js';
import { Player } from '../entities/player.js';
import { CollisionManager } from '../managers/collisionManager.js';
import { Ghost } from '../entities/ghost.js';

export class Engine {
    constructor() {
        this.renderer = new Renderer(this);
        this.langManager = new LangManager();
        this.audioManager = new AudioManager();
        this.saveManager = new SaveManager(this);
        this.uiManager = new UiManager(this);
        this.inputManager = new InputManager(this);
        this.labyrinth = new Labyrinth(this);
        this.player = new Player(this);
        this.collisionManager = new CollisionManager(this);
        this.score = 0;
        this.level = 1;
        this.ghosts = [];
        this.isRunning = false;
    }

    init() {
        this.saveManager.init();
        this.renderer.loadScreen(this.uiManager.currentTemplateName);
        this.uiManager.init();
        this.audioManager.init();
        this.labyrinth.init();
        this.inputManager.init();
        this.collisionManager.init();
        this.start();
    }

    async setupPlayMode() {
        await this.labyrinth.generate(); 
        this.player.init();
        
        this.ghosts = [];
        let carrotGhost = new Ghost(this, 'carrot', 'carrot-ghost');
        carrotGhost.init();
        this.ghosts.push(carrotGhost);
    }

    start() {
        console.log('Engine started');
        document.addEventListener("click", () => { this.audioManager.playMusic("bg-music1") }, { once: true });

        if (this.isRunning) return;
        this.isRunning = true;

        requestAnimationFrame((timestamp) => {
            this.lastTime = timestamp;
            this.loop(timestamp);
        });
    }

    loop(timestamp) {
        if (!this.isRunning) return; // Ha false, a loop végleg megszakad!
        let deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        requestAnimationFrame((timestamp) => this.loop(timestamp));
        this.collisionManager.checkCollisions();
    }

    update(dt) {
        this.player.update(dt);
        this.renderer.update();
        this.inputManager.update();

        for (let ghost of this.ghosts) {
            ghost.update(dt);
        }
    }

    stop() {
        this.isRunning = false;
    }

    async nextLevel() {
        this.stop(); // Korrekten leállítjuk a loopot
        
        // Random győzelmi hang kiválasztása (1-10)
        if (this.audioManager) {
            let randomVictoryNum = Math.floor(Math.random() * 10) + 1;
            this.audioManager.playSound(`victory${randomVictoryNum}`);
        }

        // Rövid várakozás a hang miatt
        await new Promise(r => setTimeout(r, 1000));

        this.level++;
        
        // Pálya növelése
        this.labyrinth.size.width += 2;
        this.labyrinth.size.height += 2;

        console.log(`Szintlépés: ${this.level}. szint. Új méret: ${this.labyrinth.size.width}x${this.labyrinth.size.height}`);

        // Új játékmenet felállítása
        await this.setupPlayMode();
        
        this.start(); // ÚJRAINDÍTJUK a loopot! Ez hiányzott!
    }
}