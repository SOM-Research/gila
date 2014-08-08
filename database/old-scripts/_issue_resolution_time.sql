
create table _issue_resolution_time(
issue_id int(11),
issue_num int(11),
created_at timestamp,
closed_at timestamp,
hs_to_solve float(7,2)
) ENGINE=InnoDB
;

insert into _issue_resolution_time

-- for all closed issues shows the time when the issue was created, the time when it was closed 
-- and a column calculating the time taken to solve it
-- the close date considered is the date of the latest close action attached to the issue

select i.id as issue_id, i.issue_id as issue_num, i.created_at, ie.created_at as closed_at, 
round((timestampdiff(minute,i.created_at,ie.created_at))/60,2) as hs_to_solve
from issues i
inner join issue_events ie on i.id = ie.issue_id
where ie.action = 'closed' and ie.created_at = (select max(ie1.created_at) from issue_events ie1 
										where ie1.issue_id = ie.issue_id and ie1.action = 'closed')
;