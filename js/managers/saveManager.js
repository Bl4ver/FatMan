export class SaveManager {
    constructor(engine) {
        this.engine = engine;
    }

    init() {
        this.loadGame();
    }

    saveGame() {
        const gameState = {
            lang: this.engine.langManager.lang || 'en',
            volumes: this.engine.audioManager.volumes || { master: 0.5, music: 0.5, sfx: 0.5 }
        };

        localStorage.setItem('saveGame', JSON.stringify(gameState));
        console.log('Game saved!');
    }

    loadGame() {
        const savedGame = localStorage.getItem('saveGame');
        if (savedGame) {
            const gameState = JSON.parse(savedGame);
            
            if (gameState.lang) {
                this.engine.langManager.lang = gameState.lang;
                this.engine.langManager.changeLang(gameState.lang);
            }
            
            if (gameState.volumes) {
                this.engine.audioManager.volumes = gameState.volumes;
            }
            console.log('Game loaded!');
        } else {
            console.log('No saved game found.');
        }
    }
}