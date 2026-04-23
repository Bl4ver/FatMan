export class InputManager{
    constructor(engine, uimanager) {
        this.engine = engine;
        this.uimanager = uimanager;
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

            if (e.key == " " && this.uimanager.currentTemplateName == "mainMenuTemp"){
                this.uimanager.ChangeTemplate("playTemp");
            }

            switch (e.key == "Escape", this.uimanager.currentTemplateName) {
                case (true, "playTemp"):
                    this.uimanager.ChangeTemplate("settingsTemp");
                    break;
                case (true, "mainMenuTemp"):
                    break;
                default:
                    this.uimanager.ChangeTemplate(this.uimanager.lastTemplateName);
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