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
        if (this.engine.player.playerDiv) {
            if (this.isKeyDown("KeyW")) {
            this.engine.player.direction = "up";
            this.engine.player.playerDiv.style.transform = "rotate(-90deg) scaleX(1)"; 
        } else if (this.isKeyDown("KeyS")) {
            this.engine.player.direction = "down";
            this.engine.player.playerDiv.style.transform = "rotate(90deg) scaleX(1)";
        } else if (this.isKeyDown("KeyA")) {
            this.engine.player.direction = "left";
            this.engine.player.playerDiv.style.transform = "rotate(0deg) scaleX(-1)";
        } else if (this.isKeyDown("KeyD")) {
            this.engine.player.direction = "right";
            this.engine.player.playerDiv.style.transform = "rotate(0deg) scaleX(1)";
        }
        }
        console.log(this.engine.player.x, this.engine.player.y)
    }
}