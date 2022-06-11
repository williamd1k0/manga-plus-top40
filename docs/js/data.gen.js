---
layout: null
permalink: /js/data.js
---

function getAllData() {
	const randomColors = randomColor({count: {{ site.data.rankings | size }} });
	return [
		{% assign rankings_sorted = site.data.rankings | sort %}
		{% for entry_data in rankings_sorted %}
		{% assign entry = entry_data[1] %}
		{
			label:{{ entry.title | jsonify }},
			data: {{ entry.ranking | jsonify }},
			borderColor: randomColors[{{ forloop.index }}-1]+'bb',
			backgroundColor: randomColors[{{ forloop.index }}-1],
			darkColor: randomColors[{{ forloop.index }}-1],
			lightColor: randomColors[{{ forloop.index }}-1]+'cc',
			hiddenColor: randomColors[{{ forloop.index }}-1]+'1d',
			fill: false,
			hidden: false,
			tension: 0.3,
			animations: {
				y: {
					easing: 'easeOutBounce',
					duration: 300,
					delay: 300+{{ forloop.index }}*10
				}
			}
		},
		{% endfor %}
	];
}

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

function filterData(datasets, filters) {
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
