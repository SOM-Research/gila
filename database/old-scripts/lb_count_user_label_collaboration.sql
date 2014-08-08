-- Counts the number of times a user contributed to a given label
-- The contribution may consist of commenting the issue, or (in case of collaborators)
-- by also performing a 'merge', 'close' or 'reopen' action over the issue
-- (only one user contribution per issue is considered)

create view count_user_label_collaboration as

(select 
    label_id,
    user_id,
    count(distinct issue_id) as num_issue_collaborations
from
    _lab_user_label_collaboration

group by label_id, user_id
order by label_id, num_issue_collaborations desc)
;

select * from count_user_label_collaboration;