const op_data = [
	['2019-04-29', 1],
	['2019-08-19', 1],
	['2019-08-28', 1],
	['2020-05-20', 2],
	['2020-06-26', 2],
	['2020-09-08', 1],
	['2020-09-15', 1],
	['2020-10-01', 1],
	['2020-11-01', 2],
	['2020-12-15', 2],
	['2021-03-25', 2],
	['2022-06-07', 1],
	['2022-06-08', 1],
];

const naruto_data = [
	['2019-04-29', 8],
	['2019-08-19', 8],
	['2019-08-28', 8],
	['2020-05-20', 18],
	['2020-06-26', 18],
	['2020-09-08', 16],
	['2020-09-15', 17],
	['2020-10-01', 17],
	['2020-11-01', 17],
	['2020-12-15', 17],
	['2021-03-25', 19],
	['2022-06-07', 21],
	['2022-06-08', 20],
];

const heroacademia_data = [
	['2019-04-29', 7],
	['2019-08-19', 7],
	['2019-08-28', 7],
	['2020-05-20', 4],
	['2020-06-26', 4],
	['2020-09-08', 3],
	['2020-09-15', 3],
	['2020-10-01', 3],
	['2020-11-01', 3],
	['2020-12-15', 3],
	['2021-03-25', 3],
	['2022-06-07', 3],
	['2022-06-08', 3],
];

const data = {
	//labels: labels,
	datasets: [
		{
			label: 'One Piece',
			data: op_data,
			borderColor: 'red',
			backgroundColor: 'red',
			fill: false,
			tension: 0
		},
		{
			label: 'Naruto',
			data: naruto_data,
			borderColor: 'orange',
			backgroundColor: 'orange',
			fill: false,
			tension: 0
		},
		{
			label: 'My Hero Academia',
			data: heroacademia_data,
			borderColor: 'green',
			backgroundColor: 'green',
			fill: false,
			tension: 0
		},
	]
};

const config = {
	type: 'line',
	data: data,
	options: {
		responsive: false,
		plugins: {
			title: {
				display: true,
				text: 'Manga+ Top 40'
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
