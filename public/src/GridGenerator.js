
class GridGenerator {
    constructor() {
        this.levelGrid
        this.gridRadius
        this.game
        this.levelString
    }
    getRows() {
        return this.levelGrid[0].length
    }
    getColumns() {
        return this.levelGrid.length
    }
    createGrid() {
        this.levelString = !this.game.isNotFirstRun ? this.getLevelString() : new RandomGridGenerator().generate()
        const oneLineLevel = this.levelString.replace(/(\r\n|\n|\r)/gm, '')
        const columns = Math.max(...this.levelString.split('\n').map((line) => line.length))
        const rows = this.levelString.split('\n').length

        const grid = []

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (!grid[j]) grid[j] = []
                grid[j][i] = oneLineLevel[i * columns + j]
            }
        }
        return grid
    }
    setupGrid(game) {
        this.game = game
        this.levelGrid = this.createGrid()
        const rows = this.getRows()
        const columns = this.getColumns()
        this.gridRadius = this.calculateGridRadius(game, rows, columns)
        const offset = 90

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if ([' ', 'r', 'l', 'a'].includes(this.levelGrid[j][i])) continue
                const spriteName = this.getGridSpriteForCharacter(this.levelGrid[j][i])
                if (['horLine', 'vertLine'].includes(spriteName)) {
                    game.addTweenedGridLine(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius)
                } else {
                    game.addTweenedSprite(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius, 750, 1)
                }
            }
        }
    }
    calculateGridRadius(game, rows, columns) {
        const columnWidth = (game.world.width - 200) / columns
        const rowHeight = (game.world.height - 425) / rows
        return Math.min(columnWidth, rowHeight)
    }
    getGridSpriteForCharacter(character) {
        switch (character) {
            case 'o':
            case 'R':
            case 'E':
                return 'circle'
            case '-':
                return 'horLine'
            case '|':
                return 'vertLine'
            case 'e':
                return 'exit'
        }
    }
    convertGridToPixels(gridX, gridY) {
        const offset = 90

        return {
            x: offset + gridX * this.gridRadius,
            y: offset + gridY * this.gridRadius
        }
    }
    convertPixelsToGrid(pixelX, pixelY) {
        const offset = 90

        return {
            x: Math.round((pixelX - offset) / this.gridRadius),
            y: Math.round((pixelY - offset) / this.gridRadius)
        }
    }
    getPositionOfElementInPixels(element) {
        const gridPosition = this.getPositionOfElementInGrid(element)
        const pixelPosition = gridGenerator.convertGridToPixels(gridPosition.x, gridPosition.y)

        return pixelPosition
    }
    getPositionOfElementInGrid(element) {
        const xPos = gridGenerator.levelGrid.findIndex(innerArray => innerArray.includes(element))
        const yPos = gridGenerator.levelGrid[xPos].findIndex(el => el === element)
        return { x: xPos, y: yPos }
    }
    getLevelString() {
        const level = 'R-o   o-o-o-o-e\n\
  |   | | | |  \n\
o-o o-o o-o o  \n\
|   |   | | |  \n\
o-o-o   E-o o  \n\
  |     a   |  \n\
  o-or     lo  '
        return level
    }
}

var gridGenerator = new GridGenerator()

