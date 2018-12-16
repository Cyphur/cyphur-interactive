import moment from 'moment';

const X_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const generateColumns = (numSeries, numPoints) => {
    const keys = generateKeys(numSeries);
    const data = generateData(keys, numPoints);
    const columns = [];
    Object.keys(data).forEach(k => columns.push([ k, ...data[k] ]));
    return columns;
};

function generateKeys(numSeries) {
    const keys = [ 'x' ];
    for (let x = 0; x < numSeries; x++) {
        keys.push('data_' + x);
    }
    return keys;
}

function generateData(keys, numPoints) {
    const data = {};

    keys.forEach(k => {
        data[k] =
            k === 'x'
                ? generateTimeData(numPoints)
                : generatePointData(numPoints);
    });

    return data;
}

function generateTimeData(numPoints) {
    const temp = moment();
    const NOW = temp.clone();
    const data = [];
    for (let x = 0; x < numPoints; x++) {
        const xVal = NOW.clone()
            .subtract(x, 'minutes')
            .format(X_FORMAT);
        data.push(xVal);
    }
    return data.reverse();
}

function generatePointData(numPoints) {
    const data = [];
    for (let x = 0; x < numPoints; x++) {
        data.push(getRandomInt(50, 100));
    }
    return data;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
