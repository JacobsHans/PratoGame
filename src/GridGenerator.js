function GridGenerator() {
    this.getLevelString = () => {
        var level = "R-o   o-o-o-o-e\n\
  |   | | | |  \n\
o-o o-o o-o o  \n\
|   |   | | |  \n\
o-o-o   E-o o  \n\
  |     a   |  \n\
  o-ol     ro  ";
        return level;
    };
    this.createGrid = () => {
        var level = this.getLevelString();
        var oneLineLevel = level.replace(/(\r\n|\n|\r)/gm, "");
        const offset = 70;
        const columns = Math.max(...level.split('\n').map((line) => line.length));
        const rows = level.split('\n').length;

        var grid = [];

        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (!grid[j]) grid[j] = [];
                grid[j][i] = oneLineLevel[i * columns + j];
            }
        }
        return grid;
    };
    this.levelGrid = this.createGrid();
    this.gridRadius;
    this.game;
}

var gridGenerator = new GridGenerator();

GridGenerator.prototype.setupGrid = function (game) {
    this.game = game;
    const rows = this.levelGrid[0].length;
    const columns = this.levelGrid.length;
    this.gridRadius = this.calculateGridRadius(game, rows, columns)
    const offset = 70;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var spriteName = this.getGridSpriteForCharacter(this.levelGrid[j][i]);
            game.addTweenedSprite(spriteName, offset + j * this.gridRadius, offset + i * this.gridRadius, 10 * i * columns + j, 1);
        }
    }
};

GridGenerator.prototype.calculateGridRadius = function (game, rows, columns) {
    const columnWidth = (game.world.width) / columns;
    const rowHeight = (game.world.height - 360) / rows;
    return Math.min(columnWidth, rowHeight);
};
GridGenerator.prototype.getGridSpriteForCharacter = (character) => {
    switch (character) {
        case 'o':
        case 'R':
        case 'E':
            return 'circle';
        case '-':
            return 'horLine';
        case '|':
            return 'vertLine';
        case 'e':
            return 'exit';
    }
};
GridGenerator.prototype.convertGridToPixels = function (gridX, gridY) {
    const rows = gridGenerator.levelGrid[0].length;
    const columns = gridGenerator.levelGrid.length;
    const offset = 70;

    return {
        x: offset + gridX * this.gridRadius,
        y: offset + gridY * this.gridRadius
    };
};
GridGenerator.prototype.convertPixelsToGrid = function (pixelX, pixelY) {
    const rows = gridGenerator.levelGrid[0].length;
    const columns = gridGenerator.levelGrid.length;
    const offset = 70;

    return {
        x: Math.round((pixelX - offset) / this.gridRadius),
        y: Math.round((pixelY - offset) / this.gridRadius)
    };
};
GridGenerator.prototype.getPositionOfElementInPixels = function (element) {
    var gridPosition = this.getPositionOfElementInGrid(element);
    var pixelPosition = gridGenerator.convertGridToPixels(gridPosition.x, gridPosition.y);

    return pixelPosition;
};
GridGenerator.prototype.getPositionOfElementInGrid = function (element) {
    const rows = gridGenerator.levelGrid.length;
    const columns = gridGenerator.levelGrid[0].length;
    const xPos = gridGenerator.levelGrid.findIndex(innerArray => innerArray.includes(element));
    const yPos = gridGenerator.levelGrid[xPos].findIndex(el => el === element);
    return {x: xPos, y: yPos};
};

