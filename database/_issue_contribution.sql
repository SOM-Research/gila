create table _issue_contribution(
issue_id int(11),
issue_num int(11),
cant_contributors int(11),
cant_collab int(11)
) ENGINE=InnoDB
;

insert into _issue_contribution
-- selects the issue id, the number of contributors involved in the issue and the number of contributors that are collaborators
-- the number of contributors is calculated counting the number of comments the issue has from distinct users
-- the number of collaborators is calculated obtaining all the (distinct) contributors that have assigned the role collaborator
-- also includes those issues that have not received any comment
select issue_contrib.issue_id, issue_contrib. issue_num, count(distinct issue_contrib.contributors) as cant_contrib, 
count(distinct issue_collab.collaborators) as cant_collab
from
-- selects contributors information
(select i.id as issue_id, i.issue_id as issue_num, c.user_id as contributors
from issues i
left outer join issue_comments c on i.id = c.issue_id
where i.repo_id = 1) as issue_contrib

left outer join
-- selects collaborators information
(select i.id as issue_id, c.user_id as collaborators
from issues i
left outer join issue_comments c on i.id = c.issue_id
inner join project_user_role ur on c.user_id = ur.user_id
where i.repo_id = 1 and ur.role = 'collaborator'
) as issue_collab

on issue_contrib.issue_id = issue_collab.issue_id

group by issue_contrib.issue_id
order by issue_contrib.issue_id
;