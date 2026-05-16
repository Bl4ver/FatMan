export class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.volumes = {
            master: 0.5,
            music: 0.5,
            sfx: 0.5
        }
    }

    init() {
        this.loadSound('button-click');
        this.loadSound('choose');
        this.loadSound('eat');
        
        // Betöltjük mind a 10 győzelmi hangot
        for (let i = 1; i <= 5; i++) {
            this.loadSound(`victory${i}`);
        }
    }

    loadSound(name, type = "sfx") {
        const audio = new Audio(`../../src/audio/${name}.mp3`);
        this.sounds[name] = audio;
        this.sounds[name].type = type; 
    }

    playSound(name) {
        if (this.sounds[name]) {
            const soundClone = this.sounds[name].cloneNode();
            soundClone.volume = this.volumes[this.sounds[name].type] * this.volumes.master;
            soundClone.play();
            soundClone.onended = () => {
                soundClone.remove();
            };
        }
    }

    playMusic(name) {
        if (this.music) {
            this.music.pause();
        }
        this.music = new Audio(`../../src/audio/${name}.mp3`);
        this.music.loop = true;
        this.music.volume = this.volumes.music * this.volumes.master;
        this.music.play();
    }

    setVolume(value, type) {
        this.volumes[type] = value; 
        if (type === "music" && this.music) {
            this.music.volume = this.volumes.music * this.volumes.master;
        }
        if (type === "master" && this.music) {
            this.music.volume = this.volumes.music * this.volumes.master;
        }
    }
}