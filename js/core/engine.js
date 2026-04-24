import { Renderer } from './renderer.js';
import { UiManager } from '../managers/uiManager.js';
import { LangManager } from '../managers/langManager.js';
import { AudioManager } from '../managers/audioManager.js';
import { SaveManager } from '../managers/saveManager.js';
import { InputManager } from '../managers/inputManager.js';
import { Labyrinth } from './labyrinth.js';

export class Engine {
    constructor() {
        this.renderer = new Renderer(this);
        this.langManager = new LangManager();
        this.audioManager = new AudioManager();
        this.saveManager = new SaveManager(this);
        this.uiManager = new UiManager(this);
        this.inputManager = new InputManager(this);
        this.labyrinth = new Labyrinth(this);
    }

    init() {
        this.saveManager.init();
        this.renderer.loadScreen(this.uiManager.currentTemplateName);
        this.uiManager.init();
        this.audioManager.init();
        this.labyrinth.init();

        this.start();
    }

    start() {
        console.log('Engine started');
        document.addEventListener("click", () => { this.audioManager.playMusic("bg-music1") }, { once: true });
    }
}