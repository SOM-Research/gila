/*
this script contains two different solution for calculating the community composition.
The second solution is more efficient than the first one.
Note that for the solution one the table that should contain the external users is not calculated.
*/

-- FIRST SOLUTION
create table pm_and_contributors_per_project as
select x.*
from(
	select pm_and_contributors_per_project.*, u.name as user_name, u.login as user_login, u.email as user_mail
	from
	users u
	join 
	(select p.id as project_id, p.name as project_name, ie.actor_id as user_id
	from issues i join issue_events ie on i.id = ie.issue_id join projects p on i.repo_id = p.id
	where ie.action IN ('closed', 'reopened', 'merged') and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, prh.actor_id as user_id
	from pull_requests pr join pull_request_history prh on pr.id = prh.pull_request_id join projects p on pr.head_repo_id = p.id
	where action in ('closed', 'merged') and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, pm.user_id
	from project_members pm join projects p on pm.repo_id = p.id
	where p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, p.owner_id as user_id
	from projects p
	where p.forked_from is null) as pm_and_contributors_per_project
	on u.id = pm_and_contributors_per_project.user_id) as x
group by x.project_id, x.user_id;
ALTER TABLE pm_and_contributors_per_project ADD INDEX (project_id);
ALTER TABLE pm_and_contributors_per_project ADD INDEX (user_id);

create table external_contributors_per_project as
select external_contributors_per_project.*, u.name as user_name, u.login as user_login, u.email as user_mail
from
users u
join 
(select p.id as project_id, p.name as project_name, pr.user_id as user_id
from pull_requests pr join projects p on pr.base_repo_id = p.id
where p.id = pr.base_repo_id and pr.merged = 1 and p.forked_from is null and pr.user_id not in (select pac.user_id from pm_and_contributors_per_project pac where pr.head_repo_id = pac.project_id)) as external_contributors_per_project;
ALTER TABLE external_contributors_per_project ADD INDEX (project_id);
ALTER TABLE external_contributors_per_project ADD INDEX (user_id);

create table external_failed_contributors_per_project as
select external_failed_contributors_per_project.*, u.name as user_name, u.login as user_login, u.email as user_mail
from
users u
join 
(select p.id as project_id, p.name as project_name, pr.user_id as user_id
from pull_requests pr join projects p on pr.base_repo_id = p.id
where p.id = pr.base_repo_id and pr.merged = 0 and p.forked_from is null and pr.user_id not in (select pac.user_id from pm_and_contributors_per_project pac where pr.head_repo_id = pac.project_id 
                                                                                  union all
                                                                                  select ecp.user_id from external_contributors_per_project ecp where pr.head_repo_id = ecp.project_id)) as external_failed_contributors_per_project;
ALTER TABLE external_failed_contributors_per_project ADD INDEX (project_id);
ALTER TABLE external_failed_contributors_per_project ADD INDEX (user_id);



-- SECOND SOLUTION
/* all_users_per_original_projects */
drop table if exists _all_users_per_project;
create table _all_users_per_project as
select y.project_id, y.project_name, u.id as user_id, u.login as user_login, u.name as user_name, u.email as user_email, u.location as user_location, y.coll, y.win_ext_contr, y.fail_ext_contr
from users u
join 
(select x.*
from (
	select p.id as project_id, p.name as project_name, ie.actor_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from issues i, issue_events ie, projects p
	where i.id = ie.issue_id and i.repo_id = p.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, p.owner_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from projects p
	where p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, ic.user_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from issue_comments ic, issues i, projects p
	where i.id = ic.issue_id and i.repo_id = p.id and ic.user_id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, cc.user_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from commit_comments cc, commits c, projects p
	where cc.commit_id = c.id and c.project_id = p.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, cc.user_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from commit_comments cc, project_commits pc, projects p
	where pc.project_id = p.id and cc.commit_id = pc.commit_id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, prc.user_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from pull_requests pr, pull_request_comments prc, projects p
	where pr.id = prc.pull_request_id and pr.base_repo_id = p.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, c.author_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from commits c, projects p
	where c.project_id = p.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, c.author_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from project_commits pc, commits c, projects p
	where pc.project_id = p.id and pc.commit_id = c.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, c.committer_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from commits c, projects p
	where c.project_id = p.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, c.committer_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from project_commits pc, commits c, projects p
	where pc.project_id = p.id and pc.commit_id = c.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, pr.user_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from pull_requests pr, pull_request_history prh, projects p
	where pr.id = prh.pull_request_id and pr.base_repo_id = p.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, i.reporter_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from issues i, projects p
	where i.repo_id = p.id and p.forked_from is null
	union all
	select p.id as project_id, p.name as project_name, i.assignee_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from issues i, projects p
	where i.repo_id = p.id and p.forked_from is null
	union all
	select p1.id as project_id, p1.name as project_name, p2.owner_id as actor, 0 as 'coll', 0 as 'win_ext_contr', 0 as 'fail_ext_contr'
	from projects p1
	left join projects p2
	on p1.id = p2.forked_from
	where p1.forked_from is null) as x
group by x.project_id, x.actor) as y
on u.id = y.actor;
ALTER TABLE _all_users_per_project ADD INDEX (project_id);
ALTER TABLE _all_users_per_project ADD INDEX (user_id);

UPDATE _all_users_per_project
INNER JOIN
	(select p.id as project_id, ie.actor_id as user_id
	from issues i join issue_events ie on i.id = ie.issue_id join projects p on i.repo_id = p.id
	where ie.action IN ('closed', 'reopened', 'merged') and p.forked_from is null
	union
	select p.id as project_id, prh.actor_id as user_id
	from pull_requests pr join pull_request_history prh on pr.id = prh.pull_request_id join projects p on pr.head_repo_id = p.id
	where action in ('closed', 'merged') and p.forked_from is null
	union
	select p.id as project_id, pm.user_id
	from project_members pm join projects p on pm.repo_id = p.id
	where p.forked_from is null
	union
	select p.id as project_id, p.owner_id as user_id
	from projects p
	where p.forked_from is null) as t 
ON _all_users_per_project.user_id = t.user_id and _all_users_per_project.project_id = t.project_id
SET _all_users_per_project.coll = 1;


UPDATE _all_users_per_project
INNER JOIN
	(select p.id as project_id, pr.user_id as user_id
	 from pull_requests pr join projects p on pr.base_repo_id = p.id
	 where p.id = pr.base_repo_id and pr.merged = 1 and p.forked_from is null) as t 
ON _all_users_per_project.user_id = t.user_id and _all_users_per_project.project_id = t.project_id
SET _all_users_per_project.win_ext_contr = 1;

UPDATE _all_users_per_project
INNER JOIN
	(select p.id as project_id, pr.user_id as user_id
	 from pull_requests pr join projects p on pr.base_repo_id = p.id
	 where p.id = pr.base_repo_id and pr.merged = 0 and p.forked_from is null) as t 
ON _all_users_per_project.user_id = t.user_id and _all_users_per_project.project_id = t.project_id
SET _all_users_per_project.fail_ext_contr = 1;