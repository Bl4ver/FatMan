import { Renderer } from './renderer.js';
import { UiManager } from '../managers/uiManager.js';
import { LangManager } from '../managers/langManager.js';
import { AudioManager } from '../managers/audioManager.js';
import { SaveManager } from '../managers/saveManager.js';
import { InputManager } from '../managers/inputManager.js';
import { Labyrinth } from './labyrinth.js';
import { Player } from '../entities/player.js';

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
    }

    init() {
        this.saveManager.init();
        this.renderer.loadScreen(this.uiManager.currentTemplateName);
        this.uiManager.init();
        this.audioManager.init();
        this.labyrinth.init();
        this.inputManager.init()

        this.start();
    }

    start() {
        console.log('Engine started');
        document.addEventListener("click", () => { this.audioManager.playMusic("bg-music1") }, { once: true });

        if (this.isRunning) return;
        this.isRunning = true;
        
        this.player.spawn();

        requestAnimationFrame((timestamp) => {
            this.lastTime = timestamp;
            this.loop(timestamp);
        });
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        // 1. DeltaTime (dt) kiszámítása (Milliszekundumban)
        // Megmondja, mennyi idő telt el az előző képkocka óta (általában ~16.6ms)
        let deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // 2. UPDATE: A világ logikájának frissítése
        this.update(deltaTime);

        // 3. ÚJRA! Szólunk a böngészőnek, hogy a következő frissítésnél hívja meg megint a loop-ot
        requestAnimationFrame((timestamp) => this.loop(timestamp));
    }

    update(dt) {
        // Pl: this.fatMan.update(dt, this.inputManager.currentKey);
        // Pl: for (let ghost of this.ghosts) { ghost.update(dt); }
        this.player.update(dt);
        this.renderer.update();
        this.inputManager.update();
    }

    stop() {
        this.isRunning = false
    }
}