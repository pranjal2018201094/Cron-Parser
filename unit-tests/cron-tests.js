const ExpressionParser = require('../controllers/expression-parser');
var assert = require('assert');
describe('CRON Parser Unit Tests', function () {
    describe('verify various expression types', function () {
        it('should return step wise response when input is having step crons', function () {
            const input = '*/15 10/2 1/15 11/1 */5';
            const expressionParser = new ExpressionParser(input.split(' '));
            const resultMap = expressionParser.parse(input);
            assert.deepEqual(resultMap,
            {
                minute: [ 0, 15, 30, 45 ],
                hour: [
                10, 12, 14, 16,
                18, 20, 22
                ],
                dayOfMonth: [ 1, 16 ],
                month: [ 11 ],
                dayOfWeek: [ 0, 5 ],
            },
            );
        });

        it('should return correct response when input is having list `,` crons', function () {
            const input = '0,15 1,2 1,15 11,1 1,5';
            const expressionParser = new ExpressionParser(input.split(' '));
            const resultMap = expressionParser.parse(input);
            assert.deepEqual(resultMap,
                {
                minute: [ 0, 15],
                hour: [ 1, 2],
                dayOfMonth: [ 1, 15 ],
                month: [ 1, 11 ],
                dayOfWeek: [ 1, 5 ],
                },
            );
        });

        it('should return correct response when input is having * crons', function () {
            const input = '* * 1,15 11,1 1,5';
            const expressionParser = new ExpressionParser(input.split(' '));
            const resultMap = expressionParser.parse(input);
            assert.deepEqual(resultMap,
                {
                minute: Array.from({ length: 60 }, (_, i) => i),
                hour: Array.from({ length: 24 }, (_, i) => i),
                dayOfMonth: [ 1, 15 ],
                month: [ 1, 11 ],
                dayOfWeek: [ 1, 5 ],
                },
            );
        });

        it('should return correct response when input is having range `-` crons', function () {
            const input = '0-15 1-2 1-1 2-5 2-6';
            const expressionParser = new ExpressionParser(input.split(' '));
            const resultMap = expressionParser.parse(input);

            assert.deepEqual(resultMap,
                {
                minute: Array.from({ length: 16 }, (_, i) => i),
                hour: Array.from({ length: 2 }, (_, i) => i+1),
                dayOfMonth: [ 1 ],
                month: [ 2, 3, 4, 5 ],
                dayOfWeek: [ 2, 3, 4, 5, 6],
                },
            );
        });

        it('should return correct response when input is having fixed values crons', function () {
            const input = '15 2 15 1 5';
            const expressionParser = new ExpressionParser(input.split(' '));
            const resultMap = expressionParser.parse(input);
            assert.deepEqual(resultMap,
                {
                minute: [ 15 ],
                hour: [ 2 ],
                dayOfMonth: [ 15 ],
                month: [ 1 ],
                dayOfWeek: [ 5 ],
                },
            );
        });

        it('should return correct response when input days is having words instead of numbs', function () {
            const input = '15 2 15 1 Mon-Sat';
            const expressionParser = new ExpressionParser(input.split(' '));
            const resultMap = expressionParser.parse(input);
            assert.deepEqual(resultMap,
                {
                minute: [ 15 ],
                hour: [ 2 ],
                dayOfMonth: [ 15 ],
                month: [ 1 ],
                dayOfWeek: [ 2, 3, 4, 5, 6, 7 ],
                },
            );
        });

        it('should return correct response when input hours is having multiple parserTypes', function () {
            const input = '15 10-15,12/5 15 1 Mon-Sat';
            const expressionParser = new ExpressionParser(input.split(' '));
            const resultMap = expressionParser.parse(input);
            assert.deepEqual(resultMap,
                {
                minute: [ 15 ],
                hour: [ 10, 11, 12, 13, 14, 15, 17, 22],
                dayOfMonth: [ 15 ],
                month: [ 1 ],
                dayOfWeek: [ 2, 3, 4, 5, 6, 7 ],
                },
            );
        });
    });

    describe('verify error cases', function () {
        it('should throw error when input has unexpected characters', function () {
            const input = '15 1@3 15 1(1 5';
            const expressionParser = new ExpressionParser(input.split(' '));
            try {
                const resultMap = expressionParser.parse(input);
            } catch (error) {
                assert.deepEqual(error, new Error('No valid values of field type - hour'));
            }
        });

        it('should throw error when input has unexpected characters with fixed `*` expression', function () {
            const input = '*/a 23 15 11 5';
            const expressionParser = new ExpressionParser(input.split(' '));
            try {
                const resultMap = expressionParser.parse(input);
            } catch (error) {
                assert.deepEqual(error, new Error('No valid values of field type - hour'));
            }
        });

        it('should throw error when input has unexpected characters with list `,` expression', function () {
            const input = '*/15 2,3 15,10` 11 5';
            const expressionParser = new ExpressionParser(input.split(' '));
            try {
                const resultMap = expressionParser.parse(input);
            } catch (error) {
                assert.deepEqual(error, new Error('No valid values of field type - dayOfMonth'));
            }
        });

        it('should throw error when input has unexpected characters with range `-` expression', function () {
            const input = '*/15 2,3 1-!5 11 5';
            const expressionParser = new ExpressionParser(input.split(' '));
            try {
                const resultMap = expressionParser.parse(input);
            } catch (error) {
                assert.deepEqual(error, new Error('No valid values of field type - dayOfMonth'));
            }
            
        });

        it('should throw error when input has unexpected characters with step `/` expression', function () {
            const input = '*/15 2,3 1-5 1/@1 5';
            const expressionParser = new ExpressionParser(input.split(' '));
            try {
                const resultMap = expressionParser.parse(input);
            } catch (error) {
                assert.deepEqual(error, new Error('No valid values of field type - dayOfMonth'));
            }
        });

        it('should throw error when input has unexpected characters with fixed value expression', function () {
            const input = '*/15 2,3 1-5 1/1 $';
            const expressionParser = new ExpressionParser(input.split(' '));
            try {
                const resultMap = expressionParser.parse(input);
            } catch (error) {
                assert.deepEqual(error, new Error('Invalid parserType'));
            }
        });
    });
});