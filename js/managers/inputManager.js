export class InputManager{
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

            if (e.key == " "){
                if (this.engine.uimanager.currentTemplateName == "mainMenuTemp")
                    this.engine.uimanager.ChangeTemplate("playTemp");
                return;
            }

            switch (e.key == "Escape", this.engine.uimanager.currentTemplateName) {
                case (true, "playTemp"):
                    this.engine.uimanager.ChangeTemplate("settingsTemp");
                    break;
                case (true, "mainMenuTemp"):
                    break;
                default:
                    this.engine.uimanager.ChangeTemplate(this.engine.uimanager.lastTemplateName);
                    break;
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
}