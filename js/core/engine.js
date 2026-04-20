import { Renderer } from './renderer.js';
import { UiManager } from '../managers/uiManager.js';
import { LangManager } from '../managers/langManager.js';
import { AudioManager } from '../managers/audioManager.js';

export class Engine {
    constructor() {
        this.renderer = new Renderer();
        this.uiManager = new UiManager(this);
        this.langManager = new LangManager();
        this.audioManager = new AudioManager();
    }

    init() {
        this.uiManager.init();
        this.renderer.loadScreen(this.uiManager.currentTemplateName);
        this.audioManager.init();

        this.start();
    }

    start() {
        console.log('Engine started');
        document.addEventListener("click", () => { this.audioManager.playMusic("bg-music1") }, { once: true });
    }
}