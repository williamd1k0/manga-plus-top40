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
