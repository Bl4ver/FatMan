export class AudioManager{
    constructor() {
        this.sounds = {};
        this.music = null;
        this.volume = 0.5;
    }

    init() {
        this.loadSound('button-click');
        this.loadSound('choose');
    }


    loadSound(name) {
        const audio = new Audio(`../../src/audio/${name}.mp3`);
        this.sounds[name] = audio;
    }

    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].currentTime = 0;
            this.sounds[name].volume = this.volume;
            this.sounds[name].play();
        }
    }

    playMusic(name) {
        if (this.music) {
            this.music.pause();
        }
        this.music = new Audio(`../../src/audio/${name}.mp3`);
        this.music.loop = true;
        this.music.volume = this.volume;
        this.music.play();
    }

    setVolume(value) {
        this.volume = value;
        if (this.music) {
            this.music.volume = this.volume;
        }
    }
}