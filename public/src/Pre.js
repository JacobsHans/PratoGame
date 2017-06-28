class Pre {
    create() {
        const music = this.add.audio('theme')
        music.play()
        music.onStop.add(this.startLoop, this)
        const callback = () => {
            this.input.keyboard.onDownCallback = null
            $("#titleImage").hide()
            this.state.start('Game')
        }
        this.input.keyboard.onDownCallback = callback
        $("#titleImage").click(callback)
    }
    startLoop() {
        this.add.audio('loop').loopFull()
    }
    stopAudio() {
        this.sound.stopAll()
    }
}

Prato.Pre = new Pre()