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

const config = {
	type: 'line',
	data: {
		labels: getLabels(data),
		datasets: data,
	},
	options: {
		responsive: true,
		plugins: {
			title: {
				display: true,
				text: 'Manga Plus Top 40'
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
});
