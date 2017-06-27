class Robby {
    constructor() {
        this.windingKey = new WindingKey()
        this.navigation = new Navigation()
        this.lPosition = { x: 140, y: 58 }
        this.rPosition = { x: -140, y: 58 }
        this.aPosition = { x: 0, y: -195 }
        this.game
        this.sprite
        this.emitter0
        this.emitter1
        this.leftEye
        this.rightEye
    }
    init(game) {
        this.game = game
        const position = gridGenerator.getPositionOfElementInPixels('R')

        this.emitter0 = game.add.emitter(position.x, position.y, 100)
        this.emitter0.makeParticles('0')
        this.emitter0.setAlpha(.5, 0, 2500)
        this.emitter0.setScale(0, 0.15, 0, 0.15, 500, Phaser.Easing.Quintic.Out)
        this.emitter0.maxParticleSpeed = new Phaser.Point(50, 50)
        this.emitter0.minParticleSpeed = new Phaser.Point(-50, -50)
        game.time.events.add(1000, () => { this.emitter0.start(false, 1000, 25) }, this)

        this.emitter1 = game.add.emitter(position.x, position.y, 100)
        this.emitter1.makeParticles('1')
        this.emitter1.setAlpha(.5, 0, 2500)
        this.emitter1.setScale(0, 0.15, 0, 0.15, 500, Phaser.Easing.Quintic.Out)
        this.emitter1.maxParticleSpeed = new Phaser.Point(50, 50)
        this.emitter1.minParticleSpeed = new Phaser.Point(-50, -50)
        game.time.events.add(1000, () => { this.emitter1.start(false, 1000, 25) }, this)

        this.game.robbyGroup = this.game.add.group();
        this.sprite = game.addTweenedSprite('robby', position.x, position.y, 1000, 0.3)
        this.leftEye = game.addTweenedSprite('robbyeyeleft', -57, -95, 1000, 1)
        this.rightEye = game.addTweenedSprite('robbyeyeright', 52, -95, 1000, 1)
        this.leftEye.anchor.setTo(0.1, 0.5)
        this.rightEye.anchor.setTo(0.1, 0.5)
        this.sprite.addChild(this.leftEye)
        this.sprite.addChild(this.rightEye)
    }
    go(jump = false) {
        if (!this.windingKey.windCalled) return 'Robby cannot go without winding the windingKey!'
        if (!this.navigation.setNavigationCalled) return 'Robby cannot go without setting the navigation!'
        if (!this.canYouGoThere(this.navigation.x, this.navigation.y, jump)) return 'I cannot go there!'
        this.windingKey.windCalled = false
        this.navigation.setNavigationCalled = false
        const robbyPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y)
        const destination = gridGenerator.convertGridToPixels(robbyPosition.x + this.navigation.x * 2, robbyPosition.y + this.navigation.y * 2)

        const moveTween = this.game.add.tween(this.sprite).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(this.emitter0).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(this.emitter1).to({ x: destination.x, y: destination.y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(this.sprite.scale).to({ x: this.sprite.scale.x * 0.8, y: this.sprite.scale.y * 0.8 }, 125, Phaser.Easing.Linear.InOut, true).yoyo(true)
        enemy.notify()

        this.game.add.audio('whoosh').play()
        moveTween.onComplete.add(this.checkIfYoureThere, this)
    }
    goRight() {
        this.windingKey.wind()
        this.navigation.setNavigation(1, 0)
        const problem = this.go()
        if (problem) return problem
        return 'GOING!'
    }
    canYouGoThere(diffX, diffY, jump) {
        const position = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y)
        if (jump) {
            return gridGenerator.levelGrid[position.x + diffX]
            && gridGenerator.levelGrid[position.x + diffX][position.y + diffY]
        }
        return gridGenerator.levelGrid[position.x + diffX]
            && gridGenerator.levelGrid[position.x + diffX][position.y + diffY]
            && ['-', '|'].includes(gridGenerator.levelGrid[position.x + diffX][position.y + diffY])
    }
    doABarrelRoll() {
        const barrelRoll = this.game.add.tween(this.sprite).to({ angle: 359 }, 250, Phaser.Easing.Linear.None, true)
        barrelRoll.onComplete.add(() => { this.sprite.angle = 0 }, this)
    }
    attach(part) {
        if (!part.isAttachable) return 'Can only attach Attachables'
        const myPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y)
        const partPosition = gridGenerator.convertPixelsToGrid(part.sprite.x, part.sprite.y)
        const distance = Math.abs(myPosition.x - partPosition.x) + Math.abs(myPosition.y - partPosition.y)
        if (distance > 1) return 'Can only attach adjacent Attachables'
        part.sprite.scale.setTo(1, 1)
        part.sprite.x -= robby.sprite.x
        part.sprite.y -= robby.sprite.y
        this.sprite.addChild(part.sprite)
        this.game.add.tween(part.sprite).to({ x: this[part.element + 'Position'].x, y: this[part.element + 'Position'].y }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.tween(part.sprite).to({ angle: Math.random() >= 0.5 ? 720 : -720 }, 250, Phaser.Easing.Linear.In, true)
        this.game.add.audio('attach').play()
        if (part.element == 'a') {
            return 'You now have access to the internet!'  // Easter egg
        }
        else {
            return 'Attachment successful'
        }
    }
    checkIfYoureThere() {
        const exitPosition = gridGenerator.getPositionOfElementInGrid('e')
        const myPosition = gridGenerator.convertPixelsToGrid(this.sprite.x, this.sprite.y)
        if (exitPosition.x !== myPosition.x || exitPosition.y !== myPosition.y) return;
        if (this.checkIfComplete()) {
            this.game.goToPostState()
        } else {
            this.game.add.audio('error').play()
            this.game.setHistory('ERROR! Robby cannot leave the facility without attaching all remaining parts!')
        }
    }
    checkIfComplete() {
        const childrenSpriteKeys = this.sprite.children.map(ch => ch.key)
        if (!childrenSpriteKeys.includes('l')) return false
        if (!childrenSpriteKeys.includes('r')) return false
        if (!childrenSpriteKeys.includes('a')) return false
        return true
    }
    shutUp() {
        Prato.Pre.stopAudio()
        return "Ahh, peace and quiet..."
    }
    jumpRight(){
        this.windingKey.wind()
        this.navigation.setNavigation(1, 0)
        const problem = this.go(true)
        if (problem) return problem
        return 'GOING!'
    }
}

class WindingKey {
    constructor() {
        this.windCalled = false
    }
    wind() {
        this.windCalled = true
    }
}
class Navigation {
    constructor() {
        this.x = 0
        this.y = 0
        this.setNavigationCalled = false
    }
    setNavigation(x, y) {
        this.setNavigationCalled = true
        this.x = x
        this.y = y
    }
}

const robby = new Robby()

const help = () => {
    if (!robby.goDown) return 'Try implementing all the go functions on Robby!'
    if (!robby.checkIfComplete()) return 'Try to attach all parts to Robby!'
    return 'Try to reach the exit'
}

const hack = () => {
    Robby.prototype.goUp = function () {
        this.windingKey.wind()
        this.navigation.setNavigation(0, -1)
        const problem = this.go()
        if (problem) return problem
        return 'GOING!'
    }

    Robby.prototype.goLeft = function () {
        this.windingKey.wind()
        this.navigation.setNavigation(-1, 0)
        const problem = this.go()
        if (problem) return problem
        return 'GOING!'
    }

    Robby.prototype.goDown = function () {
        this.windingKey.wind()
        this.navigation.setNavigation(0, 1)
        const problem = this.go()
        if (problem) return problem
        return 'GOING!'
    }
    return 'Hack successful'
}
