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
    jiggle() {
        const jiggleLeft = this.game.add.tween(this.sprite).to({angle: -45}, 250, Phaser.Easing.Linear.None, true)
        const jiggleRight = this.game.add.tween(this.sprite).to({angle: 45}, 250, Phaser.Easing.Linear.None, true)
        jiggleLeft.onComplete.add(() => { 
            jiggleRight.onComplete.add(() => { this.sprite.angle = 0}, this)
        })
    }
    teleport() {
        const x = this.getRandomInt(0, gridGenerator.getRows())
        const y = this.getRandomInt(0, gridGenerator.getColumns())
        const destination = gridGenerator.convertGridToPixels(x, y)

        const moveTween = this.game.add.tween(this.sprite).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(this.emitter0).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(this.emitter1).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(this.sprite.scale).to({ x: this.sprite.scale.x * 0.8, y: this.sprite.scale.y * 0.8 }, 125, Phaser.Easing.Linear.InOut, true).yoyo(true)
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; 
    }
}