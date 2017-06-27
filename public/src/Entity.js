class Entity {
    constructor(){
        this.game
        this.sprite
        this.emitter0
        this.emitter1
    }
    grow() {
        this.fatten()
        this.sprite.scale.y *= 1.1
    }
    shrink() {
        this.diet()
        this.sprite.scale.y /= 1.1
    }
    fatten() {
        this.sprite.scale.x *= 1.1 
    }
    diet() {
        this.sprite.scale.x /= 1.1
    }
    lieDown() {
        this.sprite.angle = -90
    }
    standUp() {
        this.sprite.angle = 0
    }
    doABarrelRoll() {
        const barrelRoll = this.game.add.tween(this.sprite).to({ angle: 359 }, 250, Phaser.Easing.Linear.None, true)
        barrelRoll.onComplete.add(() => { this.sprite.angle = 0 }, this)
    }
}