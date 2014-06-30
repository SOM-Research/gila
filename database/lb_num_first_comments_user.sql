
-- counts the number of first comments that a user has made on issues
-- tagged with a given label

create view lab_num_first_comments_user as

select 
    li.label_id,
    li.label_name,
    irt.user_id,
    count(user_id) as num_first_comments
from
    label_issues li
        inner join
    _issue_reaction_time irt ON irt.issue_id = li.issue_id
group by label_id , label_name , user_id
order by label_id , num_first_comments desc
;