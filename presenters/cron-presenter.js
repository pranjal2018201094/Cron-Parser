
const { fieldTypes } = require('../constants/constants');

class CronPresenter {
    static displayResponse(resultMap, command) {
        const result = [];
        resultMap['command'] = command;
        Object.keys(resultMap).forEach(type => {
            const _type = fieldTypes[type] ? fieldTypes[type] : type;
            let resultLine = _type;
            for (let i = _type.length; i < 15; i++) {
                resultLine += ' ';
            }
            resultMap[type].forEach(value => {
                resultLine += value + ' ';
            });
            result.push(resultLine);
            console.log(resultLine);
        });
        return result;
    }
}
module.exports = CronPresenter;
