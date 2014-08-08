-- Selects the number of contributors and collaborators that in average participate
-- in an issue tagged with that label

create view lb_label_avg_contributors as
select 
    li.label_id,
    li.label_name,
    round(avg(ics.cant_contributors),2) as avg_contributors,
    round(avg(ics.cant_collab),2) as avg_collaborators
from
    label_issues li
        inner join
    issue_contribution_stats ics ON li.issue_id = ics.issue_id
group by  li.label_id, li.label_name
order by li.label_id
;

select * from label_avg_contributors;