
-- selects the number of issues a user has created for each label
 
create view num_created_label_issues_user as
select label_id, created_by, count(created_by) as num_issues from label_issues
where created_by is not null
group by label_id, created_by
order by label_id, num_issues desc
;