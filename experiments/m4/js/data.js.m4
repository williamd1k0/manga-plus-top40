include(`base.m4')
dnl
define(`_data_size_', 0)dnl
foreach(`__', _data_,`dnl
define(`_data_size_', incr(_data_size_))dnl
')dnl
dnl
changequote(<!,!>)dnl
define(<!_chart_data_!>, <!dnl
		{
			label: _title_,
			data: _ranking_,
			borderColor: randomColors[_loop_index_]+'bb',
			backgroundColor: randomColors[_loop_index_],
			darkColor: randomColors[_loop_index_],
			lightColor: randomColors[_loop_index_]+'cc',
			hiddenColor: randomColors[_loop_index_]+'1d',
			fill: false,
			hidden: false,
			tension: 0.3,
			animations: {
				y: {
					easing: 'easeOutBounce',
					duration: 300,
					delay: 300+_loop_index_*10
				}
			}
		},dnl
!>)dnl
changequote`'dnl
dnl
function getAllData() {
	const randomColors = randomColor(_data_size_);
	return [
define(`_loop_index_', 0)dnl
foreach(`_entry_', _data_,`dnl
includedata(_entry_)`'dnl
_chart_data_
define(`_loop_index_', incr(_loop_index_))dnl
')dnl
	];
}