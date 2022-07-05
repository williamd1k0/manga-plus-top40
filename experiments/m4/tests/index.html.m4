include(`base.m4')
define(`_page_title_', `M4 Test')dnl
dnl
content(``dnl
dnl
		<h1>Ranking Data</h1>
foreach(`_entry_', _data_,`dnl
includedata(_entry_)`'dnl
		<h2>_entry_</h2>
		<p>title: _title_</p>
		<p>ranking: _ranking_</p>
')dnl
'')dnl
dnl
layout(`default')
