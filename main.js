/*
command => node main.js 'cron-expression';
*/

const CronPresenter = require('./presenters/cron-presenter');
const ExpressionParser = require('./controllers/expression-parser');

class Main {
    static init(input) {
        try {
            const parsedExpression = input.split(' ').splice(0, 5);
            const command = input.split(' ').splice(5, 1);
            if (parsedExpression.length !== 5) {
                throw new Error('Invalid number of fields');
            } else {
                const expressionParser = new ExpressionParser(parsedExpression);
                const resultMap = expressionParser.parse();
                const result = CronPresenter.displayResponse(resultMap, command);
            }
        } catch (error) {
            throw error;
        }
    }
}

Main.init(process.argv[2]);