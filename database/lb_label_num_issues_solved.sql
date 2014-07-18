-- selects for each user the number of issues solved (merged or closed) with that label

create view label_num_issues_solved as
    select 
        li.label_id,
        li.label_name,
        ir.solved_by,
        count(ir.solved_by) as num_solved
    from
        label_issues li
            left outer join
        _issue_resolution ir ON li.issue_id = ir.issue_id
    where
        solved_by is not null
    group by li.label_id , li.label_name , ir.solved_by
    order by label_id , num_solved desc
;

select * from label_num_issues_solved;