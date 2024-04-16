const fieldTypes = {
    minute: 'minute',
    hour: 'hour',
    dayOfMonth: 'day of month',
    month: 'month',
    dayOfWeek: 'day of week',
};

const indexOfType = {
    minute: 0,
    hour: 1,
    dayOfMonth: 2,
    month: 3,
    dayOfWeek: 4,
};

const regExTypeMapper = {
    '\/': 'step',
    '-': 'range',
    '\\*': 'any',
    '[0-9]+': 'fixed',
};

const daysOfWeek = {
    'sun': 1,
    'mon': 2,
    'tue': 3,
    'wed': 4,
    'thu': 5,
    'fri': 6,
    'sat': 7,
};

const fieldTypeValidValues = {
    minute: {
        start: 0,
        end: 59,
    },
    hour: {
        start: 0,
        end: 23,
    },
    dayOfMonth: {
        start: 1,
        end: 31,
    },
    month: {
        start: 1,
        end: 12,
    },
    dayOfWeek: {
        start: 1,
        end: 7,
    },
};

module.exports = {
    fieldTypes,
    indexOfType,
    regExTypeMapper,
    fieldTypeValidValues,
    daysOfWeek,
}