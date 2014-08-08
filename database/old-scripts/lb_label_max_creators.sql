
-- select all those users that have created the maximum number of issues for a given label



-- original query, without using group_concat()

select 
    n.label_id, n.created_by as max_creator_label
from
    num_created_label_issues_user n
where
    num_issues = (select 
            max(n1.num_issues)
        from
            num_created_label_issues_user n1
        where
            n1.label_id = n.label_id)
;


-- query using group concat (to concat the list of max creators for a label using ; as separator)

create view label_max_creators as
select 
    n.label_id, 
	group_concat(n.created_by
        SEPARATOR ';') as max_creator
from
    num_created_label_issues_user n
where
    num_issues = (select 
            max(n1.num_issues)
        from
            num_created_label_issues_user n1
        where
            n1.label_id = n.label_id)
group by label_id
;