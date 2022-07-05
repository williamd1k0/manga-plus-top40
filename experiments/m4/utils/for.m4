define(`for',`ifelse($#,0,``$0'',`ifelse(eval($2>=$3),1,
`pushdef(`$1',$2)$4`'popdef(`$1')$0(`$1',decr($2),$3,`$4')')')')