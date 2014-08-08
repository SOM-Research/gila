-- counts the number of times a collaborator was the first collaborator responding to an issue
-- tagged with a given label

create view lab_num_first_comments_collab as

select 
    li.label_id,
    li.label_name,
    irt.collab_id,
    count(collab_id) as num_first_comments
from
    label_issues li
        inner join
    _issue_reaction_time irt ON irt.issue_id = li.issue_id
where collab_id is not null
group by label_id , label_name , collab_id
order by label_id , num_first_comments desc
;