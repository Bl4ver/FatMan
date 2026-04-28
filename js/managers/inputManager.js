export class InputManager {
    constructor(engine) {
        this.engine = engine
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            pressed: false
        };
    }

    init() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            /*if (e.key == " "){
                if (this.engine.uiManager.currentTemplateName == "mainMenuTemp")
                    this.engine.uiManager.ChangeTemplate("playTemp");
                return;
            }*/

            if (e.key === "Escape") {
                switch (this.engine.uiManager.currentTemplateName) {
                    case "playTemp":
                        this.engine.uiManager.ChangeTemplate("settingsTemp");
                        break;
                    case "mainMenuTemp":
                        break;
                    default:
                        this.engine.uiManager.ChangeTemplate(this.engine.uiManager.lastTemplateName);
                        break;
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            this.mouse.pressed = true;
        });

        window.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
    }

    isKeyDown(keyCode) {
        return !!this.keys[keyCode];
    }

    isMouseDown() {
        return this.mouse.pressed;
    }

    update() {
        let player = document.getElementById("player");
        if (this.engine.player.playerDiv) {
            if (this.isKeyDown("KeyW")) {
            this.engine.player.direction = "up";
            player.style.backgroundImage = "url('../src/image/fatman-back.png')";
        } else if (this.isKeyDown("KeyS")) {
            this.engine.player.direction = "down";
            player.style.backgroundImage = "url('../src/image/fatman-front.png')";
        } else if (this.isKeyDown("KeyA")) {
            this.engine.player.direction = "left";
            player.style.transform = "scaleX(-1)";
            player.style.backgroundImage = "url('../src/image/fatman-side.png')"
        } else if (this.isKeyDown("KeyD")) {
            this.engine.player.direction = "right";
        player.style.transform = "scaleX(1)";
            player.style.backgroundImage = "url('../src/image/fatman-side.png')"
        }
        }
    }
}