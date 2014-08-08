-- selects the average first comment time and average first collaborator response
-- for a given label (in hours)
-- the cases where the avg first comment time is greater than the may be
-- due to issues that have long avg first comment response time and have
-- no collaborator response

 create view label_avg_response_time as
select 
    li.label_id,
    round(avg(ic.hs_first_comment),2) as avg_hs_first_comment,
    round(avg(ic.hs_first_collab_response),2) as avg_hs_first_collab_response
from
    label_issues li
        inner join
    issue_contribution_stats ic ON ic.issue_id = li.issue_id
group by li.label_id
;