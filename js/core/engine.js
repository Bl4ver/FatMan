import { Renderer } from './renderer.js';
import { UiManager } from '../managers/uiManager.js';
import { LangManager } from '../managers/langManager.js';

export class Engine {
    constructor() {
        this.renderer = new Renderer();
        this.uiManager = new UiManager(this);
        this.langManager = new LangManager();
    }

    init() {
        this.uiManager.init();
        this.renderer.loadScreen(this.uiManager.currentTemplateName);
    }

    start(){
        console.log('Engine started');
    }
}