import './styles/main.scss';
import './styles/chart.scss';

import { generateTimeseries } from './charts/timeseries.chart';

const APP_PREFIX = 'cy';
const TRENDS_CLASS = `${APP_PREFIX}-trends`;
const CHART_CLASS = `${TRENDS_CLASS}__chart`;
const LEGEND_CLASS = `${APP_PREFIX}-legend`;

// LEGEND
const LEGEND_TEMPLATE =
    "<li class='cy-legend__item' style='color:{=COLOR}'>{=TITLE}</li>";

const trendsContainer = document.getElementsByClassName(TRENDS_CLASS)[0];
const legendContainer = trendsContainer.getElementsByClassName(LEGEND_CLASS)[0];
const chartContainers = trendsContainer.getElementsByClassName(CHART_CLASS);

const trendConfig = {
    legend: {
        contents: {
            bindto: legendContainer,
            template: LEGEND_TEMPLATE
        }
    }
};

const charts = [];

window.onload = () => {
    for (const chartContainer of chartContainers) {
        loadChart(chartContainer);
    }

    document
        .getElementsByClassName('cy-trends__legend-toggle')[0]
        .addEventListener('click', () => {
            legendContainer.classList.contains('collapsed')
                ? legendContainer.classList.remove('collapsed')
                : legendContainer.classList.add('collapsed');

            for (const chart of charts) {
                chart.resize({ width: chartContainers[0].offsetWidth });
            }
        });
};

function loadChart(chartContainer) {
    generateTimeseries(chartContainer, trendConfig).then(chart => {
        charts.push(chart);

        window.addEventListener('resize', () => {
            chart.resize({
                height: chartContainer.offsetHeight,
                width: chartContainer.offsetWidth
            });
        });
    });
}
