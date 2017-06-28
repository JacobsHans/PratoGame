class Magnet {
    constructor() {
        this.isActive = false
    }
    activate() {
        this.isActive = true
        return 'Magnet activated!'
    }
}
class Attachable extends Entity {
    constructor(element, name) {
        super()
        this.isAttachable = true
        this.magnet = new Magnet()
        this.element = element
        this.text
        this.name = name
    }
    init(game) {
        this.game = game
        const position = gridGenerator.getPositionOfElementInPixels(this.element)
        this.sprite = game.addTweenedSprite(this.element, position.x, position.y, 1000, 0.3)

        var style = { font: "16px Arial Black", fill: "#062A5A", boundsAlignH: "center", boundsAlignV: "middle" };

        this.text = game.add.text(position.x, position.y, this.name, style);
        this.text.stroke = "#FFFFFF";
        this.text.strokeThickness = 4;
        this.text.setShadow(2, 2, "#333333", 2, true, false);
        this.text.alpha = 0
        this.text.anchor.set(0.5);
    }
}
const leftArm = new Attachable('l', 'leftArm')
const rightArm = new Attachable('r', 'rightArm')
const antenna = new Attachable('a', 'antenna')