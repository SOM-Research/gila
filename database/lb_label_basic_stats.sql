create view label_basic_stats as
select 
    label_id,
    count(distinct issue_id) as num_issues,
    count(issue_id) as num_comments,
    count(distinct user_id) as num_distinct_contributors
from
    label_issue_comments
group by label_id
order by label_id;

select * from label_basic_stats;