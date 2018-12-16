import './styles/main.scss';
import { bb } from 'billboard.js';
import { generateColumns } from './generators/timeseries.generator';

import './styles/chart.scss';

const APP_PREFIX = 'cy';
const TRENDS_CLASS = `${APP_PREFIX}-trends`;
const CHART_CLASS = `${TRENDS_CLASS}__chart`;
const LEGEND_CLASS = `${APP_PREFIX}-legend`;

const trendsContainer = document.getElementsByClassName(TRENDS_CLASS)[0];
const chartContainer = trendsContainer.getElementsByClassName(CHART_CLASS)[0];
const legendContainer = trendsContainer.getElementsByClassName(LEGEND_CLASS)[0];

// BB :: CHART CONFIG CONSTANTS

// BASE
const TICK_COUNT = 5;
const PADDING = 30;

// TIMESERIES
const TIMESERIES_X_LABEL = 'x';
const TIMESERIES_FORMAT = '%Y-%m-%dT%H:%M:%S';
const TIMESERIES_TICK_FORMAT = '%Y-%m-%d %H:%M:%S';

// LEGEND
const LEGEND_TEMPLATE =
    "<li class='cy-legend__item' style='color:{=COLOR}'>{=TITLE}</li>";

const DEFAULT_TIMESERIES_OPTIONS = {
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                outer: false,
                format: TIMESERIES_TICK_FORMAT,
                culling: {
                    max: 8
                }
            }
        }
    },
    padding: {
        top: PADDING / 2,
        right: PADDING,
        bottom: PADDING / 2,
        left: PADDING
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
    },
    legend: {
        contents: {
            bindto: legendContainer,
            template: LEGEND_TEMPLATE
        }
    }
};

const config = {
    bindto: chartContainer,
    data: {
        x: TIMESERIES_X_LABEL,
        xFormat: TIMESERIES_FORMAT,
        columns: generateColumns(4, 288)
    },
    ...DEFAULT_TIMESERIES_OPTIONS
};

const chart = bb.generate(config);

document
    .getElementsByClassName('cy-trends__legend-toggle')[0]
    .addEventListener('click', () => {
        legendContainer.classList.contains('collapsed')
            ? legendContainer.classList.remove('collapsed')
            : legendContainer.classList.add('collapsed');

        window.setTimeout(() => {
            chart.flush(true);
        }, 100);
    });
