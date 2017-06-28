class SpeedRun {
    constructor() {
        this.game
        this.text
        this.active
        this.timeLeft
    }
    init(game) {
        this.game = game
        this.text = this.game.add.text(this.game.world.centerX, 25, "60", { font: "40px Arial", fill: "#FFFFFF", align: "center" })
        this.text.visible = false
    }
    toggle() {
        this.active = !this.active
        this.text.visible = this.active   
        if(this.active){
            this.timeLeft = 16
            this.text.fill = "#FFFFFF"
            this.changeText()    
        }
         
    }
    changeText(){
        if(!this.active || this.timeLeft === 0) return;
        this.timeLeft = this.timeLeft - 1
        this.text.text = this.timeLeft
        
        this.game.time.events.add(1000, () => { this.changeText() }, this)
        
        if(this.timeLeft === 0){
            this.text.fill = "#FF0000"
            this.game.time.events.add(1000, () => { 
                const spawnPosition = gridGenerator.convertGridToPixels(0, 0)
                robby.sprite.x = spawnPosition.x
                robby.sprite.y = spawnPosition.y
                robby.emitter0.x = spawnPosition.x
                robby.emitter0.y = spawnPosition.y
                robby.emitter1.x = spawnPosition.x
                robby.emitter1.y = spawnPosition.y
                this.game.add.audio('explosion').play()
                this.active = false
                this.text.visible = false
            }, this)
        }
    }
}


var speedRun = new SpeedRun()