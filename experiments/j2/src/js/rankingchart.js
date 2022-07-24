function getLabels(datasets) {
	const labels = [];
	for (let entry of datasets) {
		for (let point of entry.data) {
			if (!labels.includes(point.x)) {
				labels.push(point.x);
			}
		}
	}
	labels.sort();
	return labels;
}

function getLastDate(datasets) {
	const labels = getLabels(datasets);
	return labels[labels.length-1];
}

function filterData(datasets, filters) {
	if (filters.titles) {
		datasets = datasets.filter((e) => filters.titles.includes(e.titleId));
	}
	if (filters.missingLimit) {
		const limit = parseInt(filters.missingLimit);
		if (limit >= 0) {
			const lastDate = new Date(getLastDate(datasets));
			let limitDate = new Date(lastDate.valueOf());
			limitDate.setDate(lastDate.getDate()-limit);
			datasets = datasets.filter((e) => {
				const lastEntry = new Date(e.data[e.data.length-1].x);
				return lastEntry.getTime() >= limitDate.getTime()
			});
		}
	}
	if (filters.startDate) {
		const startDate = filters.startDate;
		for (let entry of datasets) {
			entry.data = entry.data.filter((d) => d.x.localeCompare(startDate) >= 0);
		}
	}
	if (filters.endDate) {
		const endDate = filters.endDate;
		for (let entry of datasets) {
			entry.data = entry.data.filter((d) => d.x.localeCompare(endDate) <= 0);
		}
	}
	return datasets.filter((e) => e.data.length > 0);
}

function handleHover(evt, item, legend) {
	for (let entry of legend.chart.data.datasets) {
		entry.backgroundColor = entry.label === item.text ? entry.darkColor : entry.hiddenColor;
		entry.borderColor = entry.label === item.text ? '#000000cc' : entry.hiddenColor;
	}
	legend.chart.update();
}
function handleLeave(evt, item, legend) {
	for (let entry of legend.chart.data.datasets) {
		entry.backgroundColor = entry.darkColor;
		entry.borderColor = entry.lightColor;
	}
	legend.chart.update();
}

const dataFilters = {
	startDate: location.search.match(/from=(\d{4}-\d{2}-\d{2})/i)?.at(1),
	endDate: location.search.match(/to=(\d{4}-\d{2}-\d{2})/i)?.at(1),
	missingLimit: location.search.match(/missinglimit=(\d+)/i)?.at(1),
	titles: location.search.match(/titles=([\w\d_\-,]+)/i)?.at(1).replace('-', '_').split(','),
};
const data = filterData(getAllData(), dataFilters);
const labels = getLabels(data);

const config = {
	type: 'line',
	data: {
		labels: labels,
		datasets: data,
	},
	options: {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'MANGA Plus Top 40'
			},
			legend: {
				position: 'bottom',
				onHover: handleHover,
				onLeave: handleLeave
			},
		},
		interaction: {
			intersect: true,
		},
		scales: {
			x: {
				display: true,
				beginAtZero: false,
				title: {
					display: true
				}
			},
			y: {
				display: true,
				position: 'right',
				title: {
					display: true,
					text: 'Ranking'
				},
				min: 1,
				max: 40,
				reverse: true,
				grid: {
					drawBorder: false,
					color: function(context) {
						if (context.tick.value <= 15) {
							return 'green';
						} else if (context.tick.value <= 30) {
							return 'yellow';
						}
						return 'red';
					},
				},
			}
		}
	},
};

document.addEventListener('DOMContentLoaded', () => {
	const ctx = document.getElementById('chart-all');
	const chartAll = new Chart(ctx, config);
	const allLabels = getLabels(getAllData());
	const startDataInput = document.querySelector('input[name=from]');
	startDataInput.value = dataFilters.startDate || allLabels[0];
	const endDateInput = document.querySelector('input[name=to]');
	endDateInput.value = dataFilters.endDate || allLabels[allLabels.length-1];
	for (let dateInput of [startDataInput, endDateInput]) {
		dateInput.min = allLabels[0];
		dateInput.max = allLabels[allLabels.length-1];
	}
	document.querySelector('#toggle-selection-btn').addEventListener('click', () => {
		for (let i=0; i < chartAll.data.datasets.length; i++) {
			const hidden = chartAll.getDatasetMeta(i).hidden;
			chartAll.getDatasetMeta(i).hidden = !hidden;
		}
		chartAll.update();
	});
});
