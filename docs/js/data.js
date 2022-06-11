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

function filterData(datasets) {
	return datasets;
}
