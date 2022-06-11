---
layout: null
---

function getAllData() {
	const randomColors = randomColor({count: {{ site.data.rankings | size }} });
	return [
		{% for entry_data in site.data.rankings %}
		{% assign entry = entry_data[1] %}
		{
			label:{{ entry.title | jsonify }},
			data: {{ entry.ranking | jsonify }},
			borderColor: randomColors[{{ forloop.index }}-1],
			backgroundColor: randomColors[{{ forloop.index }}-1],
			fill: false,
			tension: 0,
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

function filterData(datasets) {
	return datasets;
}
