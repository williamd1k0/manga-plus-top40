const data = filterData(getAllData());
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
				text: 'Manga+ Top 40 (WIP)'
			},
			legend: {
				position: 'bottom',
			},
		},
		interaction: {
			intersect: false,
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
				title: {
					display: true,
					text: 'Ranking'
				},
				min: 1,
				max: 40,
				reverse: true,
			}
		}
	},
};

document.addEventListener('DOMContentLoaded', () => {
	const ctx = document.getElementById('chart-all');
	const chartAll = new Chart(ctx, config);
});
