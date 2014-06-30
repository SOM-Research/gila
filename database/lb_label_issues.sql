
-- Creates view label_issues making a join between labels an issues and 
-- replaces all unlabeled issues (issues with null label columns) with the label 'unlabeled'

create view label_issues as

select count(*) from
    select 
        case
            when (l.label_id is null) then 59
            else l.label_id
        end as label_id,
        case
            when (rl.name is null) then 'unlabeled'
            else rl.name
        end as label_name,
        i.id as issue_id,
        i.issue_id as issue_num,
		i.reporter_id as created_by
    from
        issues i
            left outer join
        issue_labels l ON i.id = l.issue_id
            left outer join
        repo_labels rl ON rl.id = l.label_id
    where
        i.repo_id = 1
    order by label_id , issue_id
;

