create table _issue_reaction_time(
issue_id int(11),
created_at timestamp,
first_comment_date timestamp,
hs_first_comment float(7,2),
user_id int(11),
first_collab_comment_date timestamp,
hs_collab_response float(7,2),
collab_id int(11)
) ENGINE=InnoDB
;

-- selects for each issue, the date, time since creation and user_id of the first contribution (comment) to the issue
-- and date, elapsed time and collab_id of the first intervention of a project collaborator

insert into _issue_reaction_time

select issue_reaction.issue_id, issue_reaction.created_at, issue_reaction.first_comment_date, issue_reaction.hs_first_comment, 
issue_reaction.user_id, collab_reaction.first_collab_comment_date, collab_reaction.hs_collab_response, collab_reaction.collab_id

from 
-- selects information for the first issue contribution
(select i.id as issue_id, i.created_at, ic.created_at as first_comment_date, round((timestampdiff(minute,i.created_at,ic.created_at))/60,2) as hs_first_comment,
ic.user_id
from issues i left outer join issue_comments ic on i.id = ic.issue_id 
where i.repo_id = 1
and ic.created_at = (select min(created_at) from issue_comments ic1 where ic.issue_id = ic1.issue_id)
) as issue_reaction

left outer join
-- selects information for the first collab contribution
(select i.id as issue_id, ic.created_at as first_collab_comment_date, round((timestampdiff(minute,i.created_at,ic.created_at))/60,2) as hs_collab_response,
 ic.user_id as collab_id
from issues i left outer join issue_comments ic on i.id = ic.issue_id
where i.repo_id = 1 and ic.created_at = 
	(select min(ic1.created_at) from issue_comments ic1 
	 inner join project_user_role ur on ic1.user_id = ur.user_id
	 where ur.role = 'collaborator' and ic1.issue_id = ic.issue_id)
) as collab_reaction

on issue_reaction.issue_id = collab_reaction.issue_id
;