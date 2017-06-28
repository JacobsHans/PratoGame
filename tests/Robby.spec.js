let {Robby} = require('../public/src/Robby.js');

describe('robby', () => {
    let robby;
    beforeEach(() => {
        robby = new Robby();
        spyOn(robby, 'go');
    });

    describe('goRight', () => {
        let result;
        beforeEach(() => {
            result = robby.goRight();
        });
        it('navigation x should be set to 1, y to 0', () => {
            expect(robby.navigation.x).toBe(1);
            expect(robby.navigation.y).toBe(0);
        });
        it('winding key should be wound', () => {
            expect(robby.windingKey.windCalled).toBeTruthy();
        });
        it('returns GOING!', () => {
            expect(result).toBe('GOING!');
        });
        it('physically goes', () => {
            expect(robby.go).toHaveBeenCalled();            
        });
        it('when goRight was done twice navigation x should remain 1 and y 0', () => {
            robby.goRight();
            expect(robby.navigation.x).toBe(1);
            expect(robby.navigation.y).toBe(0);
        });
    });
});