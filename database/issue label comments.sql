-- selects the users that contribute to each issue together with the label assigned to the issue
-- includes contributions to issues that are not labeled
 create view label_issue_comments as
    select 
        li.label_id,
		li.label_name,
		li.issue_id,
		li.issue_num,
		c.created_at as comment_date,
        c.user_id
    from
        label_issues li
            left outer join
        issue_comments c ON li.issue_id = c.issue_id
    order by li.label_id, li.issue_num, comment_date
;

select * from label_issue_comments;