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
        // Megvárjuk, amíg a labirintus 100%-ban elkészül (és bekerülnek a ghost-house cellák)
        await this.labyrinth.generate();

        // Játékos lerakása
        this.player.init();

        // Szellemek tömbjének ürítése újrakezdésnél
        this.ghosts = [];

        // Szellemek inicializálása
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
        if (!this.isRunning) return;

        // 1. DeltaTime (dt) kiszámítása (Milliszekundumban)
        let deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // 2. UPDATE: A világ logikájának frissítése
        this.update(deltaTime);

        // 3. ÚJRA! Szólunk a böngészőnek, hogy a következő frissítésnél hívja meg megint a loop-ot
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
        this.isRunning = false; // Megállítjuk a logikát a váltás alatt

        // Random győzelmi hang sorsolása és lejátszása (1-10)
        if (this.audioManager) {
            let randomVictory = Math.floor(Math.random() * 10) + 1;
            this.audioManager.playSound(`victory${randomVictory}`);
        }

        // Rövid szünet, hogy végigmenjen a hang
        await new Promise(r => setTimeout(r, 1000));

        this.level++;

        // Pálya méretének növelése (pl. +2 egység oldalanként)
        this.labyrinth.size.width += 2;
        this.labyrinth.size.height += 2;

        console.log(`Gratulálok! ${this.level}. szint következik. Méret: ${this.labyrinth.size.width}x${this.labyrinth.size.height}`);

        // Új pálya felállítása
        await this.setupPlayMode();

        this.isRunning = true; // Mehet tovább a játék
    }

    async setupPlayMode() {
        // Töröljük a régi szellemeket
        this.ghosts = [];

        // Generálás (már az új méretekkel)
        await this.labyrinth.generate();

        this.player.init();

        // Újra lerakjuk a szellemet (vagy többet)
        let carrotGhost = new Ghost(this, 'carrot', 'carrot-ghost');
        carrotGhost.init();
        this.ghosts.push(carrotGhost);
    }
}