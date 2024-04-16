// const input = '*/15 0 1,15 * 1-5';

const CronParserHelper = require('../helpers/cron-helper');
const { fieldTypes, indexOfType, daysOfWeek } = require('../constants/constants');

class ExpressionParser {
    constructor(parsedExpression) {
        this.parsedExpression = parsedExpression;
    }

    /**
     * method to parse a cron expression
     * @returns result map of each field type
     */
    parse() {
        try {
            const resultMap = {};
            Object.keys(fieldTypes).forEach(fieldType => {
                let expressions = this.parsedExpression[indexOfType[fieldType]].toLowerCase().split(',');
                const validValues = CronParserHelper.getValidValues(fieldType);
                let output = [];
                expressions.forEach(expression => {
                    if (fieldType === 'dayOfWeek') {
                        expression = this.replaceDaysInWordsToNumb(expression);
                    }
                    const parserType = CronParserHelper.getParsertype(expression);
                    let tempOutput = [];
                    switch (parserType) {
                        case 'step': {
                            const [start, step] = expression.split('/');
                            tempOutput = this.getStepValues(start, step, validValues, fieldType);
                            break;    
                        }
                        case 'range': {
                            const [start, end] = expression.split('-');
                            tempOutput = this.getRangeOfValues(start, end, validValues, fieldType);
                            break;
                        }
                        case 'any': {
                            tempOutput = this.getAllValidValues(validValues, fieldType);
                            break;
                        }
                        case 'fixed': {
                            const value = expression;
                            tempOutput = this.getFixedValue(value, validValues, fieldType);
                            break;    
                        }
                        default: {
                            throw new Error('Invalid parserType');
                        }
                    }
                    output = [...new Set([...output, ...tempOutput])]
                });
                resultMap[fieldType] = output.sort((a, b) => a-b);
            });
            return resultMap;
        } catch (error) {
            throw error;
        }
    }

    /**
     * method to return valid values when input expression type is `*` 
     * @param {Array} validValuesList valid values
     * @param {String} fieldType field type
     * @returns all valid values
     */
    getAllValidValues(validValuesList, fieldType) {
        if (validValuesList.map(value => Number(value)).length) {
            return validValuesList;
        } else {
            throw new Error(`No valid values of field type - ${fieldType}`);
        }
    }

    /**
     * method to return valid values when input expression type is `-`
     * @param {String} start start of range
     * @param {String} end end of range
     * @param {Array} validValuesList valid values
     * @param {String} fieldType field type
     * @returns valid values from start till end
     */
    getRangeOfValues(start, end, validValuesList, fieldType) {
        start = Number(start);
        end = Number(end);
        if (start <= end && validValuesList.includes(start) && validValuesList.includes(end)) {
            return validValuesList.filter(value => value >= start && value <= end);
        } else {
            throw new Error(`No valid values of field type - ${fieldType}`);
        }
    }

    /**
     * method to return valid values when input expression type is `/`
     * @param {String} start start value
     * @param {String} step interval
     * @param {Array} validateSelected valid values
     * @param {String} fieldType field type
     * @returns valid values starting from 'start'value with interval of 'step' value
     */
    getStepValues(start, step, validateSelected, fieldType) {
        start = Number(start);
        step = Number(step);
        const selectedValues = [];
        for (let iterator = start ? start : 0;
            iterator < validateSelected[validateSelected.length-1];
            iterator += step) {
                selectedValues.push(iterator);
        }
        if (selectedValues.length) {
            return selectedValues;
        } else {
            throw new Error(`No valid values of field type - ${fieldType}`);
        }
    }

    /**
     * method to return valid values when input expression type is a fixed number
     * @param {String} value input value of constant
     * @param {Array} validateSelected valid values
     * @param {String} fieldType field type
     * @returns fixed number
     */
    getFixedValue(value, validateSelected, fieldType) {
        const exist = validateSelected.includes(Number(value));
        if (exist) {
            return [Number(value)];
        } else {
            throw new Error(`No valid values of field type - ${fieldType}`);
        }
    }

    replaceDaysInWordsToNumb(expression) {
        const regex = new RegExp(Object.keys(daysOfWeek).join('|'), 'gi');
        return expression.replace(regex, match => daysOfWeek[match]); // Week by name handling
    }
}
module.exports = ExpressionParser;