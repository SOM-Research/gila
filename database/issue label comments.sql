-- selects the users that contribute to each issue together with the label assigned to the issue
-- includes contributions to issues that are not labeled

create view label_issue_comments as
select distinct 
case when (l.label_id is null) then 59 else l.label_id end as label_id, 
i.id as issue_id, i.issue_id as issue_num, c.user_id
from issues i
left outer join issue_labels l on i.id = l.issue_id
inner join issue_comments c on i.id = c.issue_id
order by label_id, issue_id
;