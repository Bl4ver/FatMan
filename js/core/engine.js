import { Renderer } from './renderer.js';
import { UiManager } from '../managers/uiManager.js';

export class Engine {
    constructor() {
        this.renderer = new Renderer();
        this.uiManager = new UiManager(this);
    }

    init() {
        this.uiManager.init();
        this.renderer.loadScreen(this.uiManager.currentTemplateName);
    }
}