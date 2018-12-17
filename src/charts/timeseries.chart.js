import { bb } from 'billboard.js';
// import { generateColumns } from '../generators/timeseries.generator';

// BASE
const PADDING = 30;

const DEFAULT_OPTIONS = {
    padding: {
        top: PADDING / 2,
        right: PADDING,
        bottom: PADDING / 2,
        left: PADDING
    }
};

// TIMESERIES
const TIMESERIES_TICK_FORMAT = '%Y-%m-%d %H:%M:%S';
const TICK_COUNT = 5;
const TIMESERIES_X_LABEL = 'x';
const TIMESERIES_X_FORMATS = {
    intradaily: '%Y-%m-%d %H:%M:%S',
    daily: '%Y-%m-%d'
};

const DEFAULT_TIMESERIES_OPTIONS = {
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                outer: false,
                count: 50,
                format: TIMESERIES_TICK_FORMAT,
                culling: {
                    max: TICK_COUNT
                }
            }
        }
    },
    grid: {
        x: {
            show: true
        },
        y: {
            show: true,
            ticks: TICK_COUNT * 3
        }
    },
    point: {
        show: false
    }
};

const INTRADAY_INTERVALS = {
    ONE_MIN: '1min',
    FIVE_MIN: '5min',
    FIFTEEN_MIN: '15min',
    THIRTY_MIN: '30min',
    ONE_HOUR: '60min'
};

const getStockTimeseriesQuery = (
    symbol = 'MSFT',
    interval,
    type = interval ? 'TIME_SERIES_INTRADAILY' : 'TIME_SERIES_DAILY'
) => {
    const BASE_URL = `https://www.alphavantage.co/query?function=${type}&symbol=${symbol}&outputsize=full&apikey=apidemo`;
    return interval ? `${BASE_URL}&interval=${interval}` : BASE_URL;
};

export const generateTimeseries = (chartElement, config) => {
    const URL = getStockTimeseriesQuery();
    return fetch(URL)
        .then(res => res.json())
        .then(data => {
            const columns = convertToColumns(data);
            const chart = bb.generate({
                bindto: chartElement,
                data: {
                    x: TIMESERIES_X_LABEL,
                    xFormat: TIMESERIES_X_FORMATS.daily,
                    columns
                },
                ...DEFAULT_OPTIONS,
                ...DEFAULT_TIMESERIES_OPTIONS,
                ...config
            });

            return chart;
        })
        .catch(e => {});
};

function convertToColumns(data) {
    const NUM_POINTS_TO_SHOW = 288;
    const [ metadata, timeseries ] = Object.values(data);
    const datetimes = Object.keys(timeseries);
    const timeseriesValues = Object.values(timeseries).splice(
        datetimes.length - NUM_POINTS_TO_SHOW,
        datetimes.length
    );
    const timeseriesLabels = Object.keys(timeseriesValues[0]);

    const datetimeColumn = [
        'x',
        ...Object.keys(timeseries).splice(
            datetimes.length - NUM_POINTS_TO_SHOW,
            datetimes.length
        )
    ];

    const dataColumns = [];

    timeseriesLabels.forEach((l, i) => {
        const label = l.split(' ')[1];
        const data = timeseriesValues.map(points => Object.values(points)[i]);
        dataColumns.push([ label, ...data ]);
    });

    const columns = [ datetimeColumn, ...dataColumns ];

    return columns;
}
