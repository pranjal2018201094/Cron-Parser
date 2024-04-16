const { regExTypeMapper, fieldTypeValidValues, weekDayMapper } = require('../constants/constants');

class CronParserHelper {
    static getParsertype(expression) {
        let parserType = null;
        Object.keys(regExTypeMapper).some(regEx => {
            const _regEx = new RegExp(regEx);
            if (_regEx.test(expression)) {
                parserType = regExTypeMapper[regEx];
                return true;
            }
        });
        return parserType;
    }

    static getValidValues(type) {
        const numbers = [];
        for (let i = fieldTypeValidValues[type].start; i <= fieldTypeValidValues[type].end; i++) {
            numbers.push(i);
        }
        return numbers;
    }

    static weekDayMapping(key) {
        return weekDayMapper[key];
    }
}
module.exports = CronParserHelper;