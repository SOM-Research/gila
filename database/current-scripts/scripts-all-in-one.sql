-- create a table that contains only original projects that use labels
create table _orginal_projects_using_labels as
select p.*
FROM projects p left join repo_labels rl on p.id = rl.repo_id
where p.forked_from is null and rl.repo_id is null;

-- IMPORTANT
-- note that the previous implementation of the _issue_resolution table is commented below
-- it has been replaced with a new version that is more efficient
create table _issue_resolution (
repo_id int(11),
issue_id int(11),
merged int(1),
closed int(1),
solved_by int(20),
created_at timestamp null,
solved_at timestamp null,
index (issue_id),
index (repo_id)
);

insert into _issue_resolution
select x.*
from (select i.repo_id, ie.issue_id, 0 as merged, 0 as closed, 
ie.actor_id as solved_by, i.created_at, ie.created_at as solved_at
from issues i left join issue_events ie on ie.issue_id = i.issue_id inner join _orginal_projects_using_labels p on p.id = i.repo_id) as x
-- note that group by is more efficient than distinct
group by x.repo_id, x.issue_id;

update _issue_resolution 
inner join
	(
	select x.*
	from (
		select i.repo_id, ie.issue_id, ie.actor_id as solved_by,  ie.created_at as closed_at
		from issue_events ie join issues i on ie.issue_id = i.issue_id join _orginal_projects_using_labels p ON p.id = i.repo_id
		where ie.issue_id = i.issue_id and p.id = i.repo_id and ie.action = 'merged'
		) as x
	group by x.repo_id, x.issue_id) as t
ON _issue_resolution.repo_id = t.repo_id and _issue_resolution.issue_id = t.issue_id
SET _issue_resolution.merged = 1, _issue_resolution.solved_by = t.solved_by, _issue_resolution.solved_at = t.closed_at;

update _issue_resolution 
inner join
	(
	select x.*
	from (
		select i.repo_id, ie.issue_id, ie.actor_id as solved_by,  ie.created_at as closed_at
		from issue_events ie join issues i on ie.issue_id = i.issue_id join _orginal_projects_using_labels p ON p.id = i.repo_id
		where ie.created_at > ifnull((select max(ie1.created_at) from issue_events ie1 where ie1.issue_id = ie.issue_id and ie1.action = 'reopened'),'0000-00-00 00:00:00') 
			  and ie.action = 'closed'
		) as x
	group by x.repo_id, x.issue_id) as t
ON _issue_resolution.repo_id = t.repo_id and _issue_resolution.issue_id = t.issue_id
SET _issue_resolution.closed = 1, _issue_resolution.solved_by = t.solved_by, _issue_resolution.solved_at = t.closed_at;
/*
create table _merged_issues_per_project as
-- selects as merged all those issues that have associated a merged event
select distinct i.repo_id, ie.issue_id, 'merged' as resolution, ie.actor_id as solved_by, i.created_at, ie.created_at as merged_at, null as closed_at
from issue_events ie, issues i, projects p
where ie.issue_id = i.issue_id and p.id = i.repo_id and ie.action = 'merged' and p.forked_from is null;

ALTER TABLE _merged_issues_per_project ADD INDEX (issue_id);
ALTER TABLE _merged_issues_per_project ADD INDEX (repo_id);


create table _rejected_issues_per_project as
-- selects as closed all those issues that have associated a closed action, and don't have a posterior reopen action
-- and the issue does not have a merged event attached
select distinct i.repo_id, ie.issue_id, 'closed' as resolution, ie.actor_id as solved_by, i.created_at, null as merged_at,  ie.created_at as closed_at
from issue_events ie join issues i on ie.issue_id = i.issue_id join projects p ON p.id = i.repo_id
where p.forked_from is null and ie.created_at > ifnull((select max(ie1.created_at) from issue_events ie1 where ie1.issue_id = ie.issue_id and ie1.action = 'reopened'),'0000-00-00 00:00:00') 
	  and ie.action = 'closed'
	  and ie.created_at > ifnull((select max(ie1.created_at) from issue_events ie1 where ie1.issue_id = ie.issue_id and ie1.action = 'reopened'),'0000-00-00 00:00:00') 
	  and not exists (select mipp.issue_id 
						from _merged_issues_per_project mipp
						where mipp.issue_id = ie.issue_id);

ALTER TABLE _rejected_issues_per_project ADD INDEX (issue_id);
ALTER TABLE _rejected_issues_per_project ADD INDEX (repo_id);

create table _pending_issues_per_project as
-- selects aslabel_issues_0 pending all those issues that have not been merged or closed
-- or that have a reopened action posterior to all closed actions
select distinct i.repo_id, ie.issue_id, 'pending' as resolution, null as solved_by, i.created_at, null as merged_at, null as closed_at
from issue_events ie join issues i on ie.issue_id = i.issue_id join projects p on p.id = i.repo_id
where p.forked_from is null and 
      not exists (select x.issue_id from (select * from _merged_issues_per_project union all select * from _rejected_issues_per_project) as x where ie.issue_id = x.issue_id)
	  -- or exists (select ie2.issue_id from issue_events ie2 where ie2.issue_id = ie.issue_id and ie2.action = 'reopened' and ie2.created_at > 
	  -- ifnull((select max(ie3.created_at) from issue_events ie3 where ie3.issue_id = ie.issue_id and ie3.action = 'closed'),'0000-00-00 00:00:00'))
;

ALTER TABLE _pending_issues_per_project MODIFY solved_by int(11);
ALTER TABLE _pending_issues_per_project MODIFY merged_at timestamp;
ALTER TABLE _pending_issues_per_project MODIFY closed_at timestamp;

ALTER TABLE _pending_issues_per_project ADD INDEX (issue_id);
ALTER TABLE _pending_issues_per_project ADD INDEX (repo_id);

create table _issue_resolution (
repo_id int(11),
issue_id int(11),
resolution varchar(15),
solved_by int(20),
created_at timestamp null,
merged_at timestamp null,
closed_at timestamp null,
index (issue_id),
index (repo_id)
)
;

insert into _issue_resolution

-- obtains the resolution of an issue
-- possible resolution values are: 'merged', 'closed' and 'pending'
select * from _merged_issues_per_project
union
select * from _rejected_issues_per_project
union
select * from _pending_issues_per_project;
*/
--
create table _label_issues as

 select 
		i.repo_id,
        case
            when (l.label_id is null) then 0
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
			left outer join
		_orginal_projects_using_labels p ON i.repo_id = p.id
    order by label_id , issue_id;

ALTER TABLE _label_issues ADD INDEX (issue_id);
ALTER TABLE _label_issues ADD INDEX (repo_id);
ALTER TABLE _label_issues ADD INDEX (label_id);
--
create table _issue_labels_name as
    select 
        rl.repo_id, il.label_id, rl.name as label_name, issue_id
    from
        issue_labels il
            inner join
        repo_labels rl ON il.label_id = rl.id
			inner join
		_orginal_projects_using_labels p ON p.id = rl.repo_id
;

ALTER TABLE _issue_labels_name ADD INDEX (issue_id);
ALTER TABLE _issue_labels_name ADD INDEX (label_id);

-- **IMPORTANT**
-- currently we need only project members and collaborators, therefore is not needed to calculate win, fail and external users.
-- the project_user_role table is replace by the _collaborators_per_project
--
/*
create table _project_user_role (
project_id int(11),
user_id int(11),
user_login varchar(255),
user_name varchar(255),
user_mail varchar(255),
location varchar(255),
role varchar(25),
index (user_id),
index (project_id)
) ENGINE=InnoDB CHARACTER SET=utf8
;

-- selects the collaborators of the project (people with write access to the repository)
insert into _project_user_role(project_id, user_id, user_login, user_name, user_mail, location, role)

select c.project_id, cast(c.user_id as unsigned), c.user_login, c.user_name, c.user_mail,
	   (select location from users where id = c.user_id), 'collaborator' as role
from pm_and_contributors_per_project c

union

-- selects the winner external contributors of the project
-- (project contributors that have at least one pull request accepted)
select ec.project_id, cast(ec.user_id as unsigned), ec.user_login, ec.user_name, ec.user_mail,
	   (select location from users where id = ec.user_id) as location,
	   'win_external_contributor' as role
from external_contributors_per_project ec

union

-- selects the failed external contributors of the projects
-- (project contributors that made at least one pull request but have none accepted)
select efc.project_id, cast(efc.user_id as unsigned), efc.user_login, efc.user_name, efc.user_mail,
	   (select location from users where id = efc.user_id) as location,
	   'fail_external_contributor' as role
from external_failed_contributors_per_project efc

union

-- selects the external users of the project
-- (people that have somehow contributed to the project, e.g. commenting on issues
-- but are not included in any of the previous groups)
select fua.project_id, cast(fua.user_id as unsigned), u.login, u.name, u.email, u.location, 'external_user' as role
from first_user_activity_per_project fua inner join users u on fua.user_id = u.id
and fua.user_id not in
(select user_id from pm_and_contributors_per_project where project_id = fua.project_id union
 select user_id from external_contributors_per_project where project_id = fua.project_id union
 select user_id from external_failed_contributors_per_project where project_id = fua.project_id)
;
*/
create table _collaborators_per_project as
select x.*
from(
	select collaborators.*, u.name as user_name, u.login as user_login, u.email as user_mail, u.location as location
	from
	users u
	join 
	(select p.id as project_id, p.name as project_name, ie.actor_id as user_id
	from issues i join issue_events ie on i.id = ie.issue_id join _orginal_projects_using_labels p on i.repo_id = p.id
	where ie.action IN ('closed', 'reopened', 'merged')
	union all
	select p.id as project_id, p.name as project_name, prh.actor_id as user_id
	from pull_requests pr join pull_request_history prh on pr.id = prh.pull_request_id join _orginal_projects_using_labels p on pr.head_repo_id = p.id
	where action in ('closed', 'merged')
	union all
	select p.id as project_id, p.name as project_name, pm.user_id
	from project_members pm join _orginal_projects_using_labels p on pm.repo_id = p.id
	union all
	select p.id as project_id, p.name as project_name, p.owner_id as user_id
	from _orginal_projects_using_labels p) as collaborators
	on u.id = collaborators.user_id) as x
-- note that the group by is more efficient than the distinct
group by x.project_id, x.user_id;
ALTER TABLE _collaborators_per_project ADD INDEX (project_id);
ALTER TABLE _collaborators_per_project ADD INDEX (user_id);
--
-- selects the users that contribute to each issue together with the label assigned to the issue
-- includes contributions to issues that are not labeled
 create table _label_issue_comments as
    select 
		li.repo_id,
        li.label_id,
		li.label_name,
		li.issue_id,
		li.issue_num,
		c.created_at as comment_date,
        c.user_id
    from
        _label_issues li
            left outer join
        issue_comments c ON li.issue_id = c.issue_id
    order by li.label_id, li.issue_num, comment_date
;

ALTER TABLE _label_issue_comments ADD INDEX (user_id);
ALTER TABLE _label_issue_comments ADD INDEX (repo_id);
ALTER TABLE _label_issue_comments ADD INDEX (issue_id);
--
-- selects for each user the number of issues solved (merged or closed) with that label

create table _label_num_issues_solved as
    select 
		li.repo_id,
        li.label_id,
        li.label_name,
        ir.solved_by,
        count(ir.solved_by) as num_solved
    from
        _label_issues li
            left outer join
        _issue_resolution ir ON li.issue_id = ir.issue_id
    where
        solved_by is not null
    group by li.label_id , li.label_name , ir.solved_by
    order by label_id , num_solved desc
;

ALTER TABLE _label_num_issues_solved ADD INDEX (repo_id);
ALTER TABLE _label_num_issues_solved ADD INDEX (label_id);
--
-- selects the number of issues a user has created for each label
 
create table _num_created_label_issues_user as
select repo_id, label_id, created_by, count(created_by) as num_issues 
from _label_issues
where created_by is not null
group by label_id, created_by
order by label_id, num_issues desc
;
ALTER TABLE _num_created_label_issues_user ADD INDEX (repo_id);
ALTER TABLE _num_created_label_issues_user ADD INDEX (label_id);

--
create table _issue_reaction_time (
repo_id int(11),
issue_id int(11),
created_at timestamp,
first_comment_date timestamp,
hs_first_comment float(7,2),
user_id int(11),
first_collab_comment_date timestamp,
hs_collab_response float(7,2),
collab_id int(11),
INDEX (repo_id),
INDEX (issue_id)
) ENGINE=InnoDB
;

CREATE TABLE _first_reaction_issue_per_project AS
-- selects information for the first issue contribution
select i.repo_id as repo_id, i.id as issue_id, i.created_at, ic.created_at as first_comment_date, round((timestampdiff(minute,i.created_at,ic.created_at))/60,2) as hs_first_comment,
ic.user_id
from issues i left outer join issue_comments ic on i.id = ic.issue_id left outer join _orginal_projects_using_labels p on i.repo_id = p.id
where ic.created_at = (select min(created_at) from issue_comments ic1 where ic.issue_id = ic1.issue_id);

ALTER TABLE _first_reaction_issue_per_project ADD INDEX (issue_id);
ALTER TABLE _first_reaction_issue_per_project ADD INDEX (repo_id);

CREATE TABLE _first_collaboration_reaction_issue_per_project AS
select i.repo_id as repo_id, i.id as issue_id, ic.created_at as first_collab_comment_date, round((timestampdiff(minute,i.created_at,ic.created_at))/60,2) as hs_collab_response,
 ic.user_id as collab_id
from issues i left outer join issue_comments ic on i.id = ic.issue_id left outer join _orginal_projects_using_labels p on i.repo_id = p.id
where ic.created_at = 
	(select min(ic1.created_at) from issue_comments ic1  
     inner join _collaborators_per_project ur on ic1.user_id = ur.user_id
	 where ic1.issue_id = ic.issue_id);
	 -- **IMPORTANT**
     -- the following lines are commented because they rely on the _project_user_role table, that for optimization purpose has been replaced by _collaborators_per_project
	 /*inner join _project_user_role ur on ic1.user_id = ur.user_id
	   where ur.role = 'collaborator' and ic1.issue_id = ic.issue_id);*/

ALTER TABLE _first_collaboration_reaction_issue_per_project ADD INDEX (issue_id);
ALTER TABLE _first_collaboration_reaction_issue_per_project ADD INDEX (repo_id);

-- selects for each issue, the date, time since creation and user_id of the first contribution (comment) to the issue
-- and date, elapsed time and collab_id of the first intervention of a project collaborator
insert into _issue_reaction_time

select issue_reaction.repo_id, issue_reaction.issue_id, issue_reaction.created_at, issue_reaction.first_comment_date, issue_reaction.hs_first_comment, 
issue_reaction.user_id, collab_reaction.first_collab_comment_date, collab_reaction.hs_collab_response, collab_reaction.collab_id

from 
_first_reaction_issue_per_project as issue_reaction
left outer join
-- selects information for the first collab contribution
_first_collaboration_reaction_issue_per_project as collab_reaction
on issue_reaction.issue_id = collab_reaction.issue_id
where issue_reaction.repo_id = collab_reaction.repo_id
;
--

create table _issue_resolution_time(
repo_id int(11),
issue_id int(11),
created_at timestamp,
solved_at timestamp,
hs_to_solve float(7,2),
resolution varchar(15) CHARACTER SET utf8,
INDEX (repo_id),
INDEX (issue_id)
) ENGINE=InnoDB
;

-- note that _issue_resolution_time has been replaced with the script below that follows the new version of _issue_resolution
insert into _issue_resolution_time

-- for all merged or closed issues shows the date when the issue was created, the date when it was merged / closed 
-- and a column calculating the time taken to solve it
-- the close date considered is the date of the latest close action attached to the issue

/* OLD VERSION
-- select merged issues
select i.repo_id, i.issue_id, i.created_at, i.merged_at, 
round((timestampdiff(minute,i.created_at,i.merged_at))/60,2) as hs_to_solve, 'merged' as resolution
from _merged_issues_per_project i
*/
-- select merged issues
select i.repo_id, i.issue_id, i.created_at, i.solved_at, 
round((timestampdiff(minute,i.created_at,i.solved_at))/60,2) as hs_to_solve, 'merged' as resolution
from _issue_resolution i
where i.merged = 1

union

/* OLD VERSION
select i.repo_id, i.issue_id, i.created_at, i.closed_at,
round((timestampdiff(minute,i.created_at,i.closed_at))/60,2) as hs_to_solve, 'closed' as resolution
from _rejected_issues_per_project i
*/
select i.repo_id, i.issue_id, i.created_at, i.solved_at,
round((timestampdiff(minute,i.created_at,i.solved_at))/60,2) as hs_to_solve, 'closed' as resolution
from _issue_resolution i
where i.merged = 0 and i.closed = 1
;

--
-- for those issues tagged with more than one label, selects the issue_id, label1 and label2
-- for each pair of labels that appear together on an issue

create table _label_relation as
    select 
        il1.repo_id, il1.issue_id, il1.label_id as label1_id, il1.label_name as label1_name, il2.label_id as label2_id, il2.label_name as label2_name
    from
        _issue_labels_name il1
            inner join
        _issue_labels_name il2 ON il1.issue_id = il2.issue_id
    where
        il1.label_id < il2.label_id
    order by il1.issue_id
;
ALTER TABLE _label_relation ADD INDEX (repo_id);
ALTER TABLE _label_relation ADD INDEX (issue_id);
--
create table _repo_label_num_issues as
    select 
        rl.repo_id, rl.id, rl.name, count(il.issue_id) as num_issues
    from
        repo_labels rl
            left outer join
        _issue_labels_name il ON rl.id = il.label_id
			left outer join
		_orginal_projects_using_labels p ON p.id = rl.repo_id
    group by rl.repo_id , rl.id , rl.name
    order by rl.repo_id , num_issues desc;

ALTER TABLE _repo_label_num_issues ADD INDEX(repo_id);
ALTER TABLE _repo_label_num_issues ADD INDEX(id);
--
create table _issue_merge_time as
select repo_id, issue_id, hs_to_solve from _issue_resolution_time where resolution = 'merged';
ALTER TABLE _issue_merge_time ADD INDEX (repo_id);
ALTER TABLE _issue_merge_time ADD INDEX (issue_id);

create table _issue_close_time as
select repo_id, issue_id, hs_to_solve from _issue_resolution_time where resolution = 'closed';
ALTER TABLE _issue_close_time ADD INDEX (repo_id);
ALTER TABLE _issue_close_time ADD INDEX (issue_id);

--
create table _pending_issue_age as
select ir.repo_id, ir.issue_id, ir.created_at, round((timestampdiff(minute,ir.created_at, STR_TO_DATE('2013-10-07 00:37:05', '%Y-%m-%d %H:%i:%s')))/60,2) as issue_age
from _issue_resolution ir
where ir.closed = 0 and ir.merged = 0;
-- past implementation of _issue_resolution
/* where ir.resolution = 'pending';*/
ALTER TABLE _pending_issue_age ADD INDEX (repo_id);
ALTER TABLE _pending_issue_age ADD INDEX (issue_id);
--
-- creates a view adding the label_id and label_name to the issue resolution information

create table _label_issue_resolution as
    select
		li.repo_id,
        li.label_id,
        li.label_name,
        li.issue_id,
        if(ir.merged = 1, 'merged', if(ir.merged = 0 and ir.closed = 1, 'closed', 'pending')) as resolution,
        ir.solved_by
    from
        _label_issues li
            inner join
        _issue_resolution ir ON li.issue_id = ir.issue_id
;
ALTER TABLE _label_issue_resolution ADD INDEX (repo_id);
ALTER TABLE _label_issue_resolution ADD INDEX (label_id);
ALTER TABLE _label_issue_resolution ADD INDEX (issue_id);
--
-- selects the average first comment time and average first collaborator response
-- for a given label (in hours)
-- the cases where the avg first comment time is greater than the average collaborator response the may be
-- due to existing issues having long avg first comment response time and have
-- no collaborator response

create table _label_avg_response_time as
select 
	li.repo_id,
    li.label_id,
    round(avg(irt.hs_first_comment),2) as avg_hs_first_comment,
    round(avg(irt.hs_collab_response),2) as avg_hs_first_collab_response
from
    _label_issues li
        inner join
    _issue_reaction_time irt ON irt.issue_id = li.issue_id
group by li.label_id
;

ALTER TABLE _label_avg_response_time ADD INDEX (repo_id);
ALTER TABLE _label_avg_response_time ADD INDEX (label_id);
--
-- selects for each label, the number of issues merged, the number of issues closed
-- and the number of issues pending

create table _label_count_resolution (
repo_id int(11),
label_id int(11),
label_name varchar(24),
num_merged int(11),
num_closed int(11),
num_pending int(11),
INDEX (repo_id),
INDEX (label_id)
) ENGINE=InnoDB CHARACTER SET=utf8
;

insert into _label_count_resolution

select
	l.repo_id,
    l.id,
    l.name,
    ifnull(merged_label.num_merged,0) as num_merged,
    ifnull(closed_label.num_closed,0) as num_closed,
	ifnull(pending_label.num_pending,0) as num_pending
from
    repo_labels l
        left outer join
    (select 
        repo_id, label_id, count(issue_id) as num_merged
    from
        _label_issue_resolution
    where
        resolution = 'merged'
    group by label_id) as merged_label ON l.id = merged_label.label_id and l.repo_id = merged_label.repo_id
        left outer join
    (select 
        repo_id, label_id, count(issue_id) as num_closed
    from
        _label_issue_resolution
    where
        resolution = 'closed'
    group by label_id) as closed_label ON l.id = closed_label.label_id and l.repo_id = closed_label.repo_id
left outer join
(select 
        repo_id, label_id, count(issue_id) as num_pending
    from
        _label_issue_resolution
    where
        resolution = 'pending'
    group by label_id) as pending_label ON l.id = pending_label.label_id and l.repo_id = pending_label.repo_id
left outer join
	_orginal_projects_using_labels p ON l.repo_id = p.id
;

--
create table _label_merge_close_time as
select 
	li.repo_id,
    li.label_id,
	ifnull(round(avg(imt.hs_to_solve),2),0) as avg_hs_to_merge,
	ifnull(round(avg(ict.hs_to_solve),2),0) as avg_hs_to_close,
	ifnull(round(avg(pia.issue_age),2),0) as pending_issue_age
from
    _label_issues li
        left outer join
		_issue_merge_time imt on imt.issue_id = li.issue_id
		left outer join
		_issue_close_time ict on ict.issue_id = li.issue_id
		left outer join
		_pending_issue_age pia on pia.issue_id = li.issue_id
group by li.label_id
;
ALTER TABLE _label_merge_close_time ADD INDEX (repo_id);
ALTER TABLE _label_merge_close_time ADD INDEX (label_id);
--
create table _label_resolution_stats as
select
	lcr.repo_id,
    lcr.label_id,
    lcr.label_name,
	ifnull(lrt.avg_hs_first_comment,0) as avg_hs_first_comment,
	ifnull(lrt.avg_hs_first_collab_response,0) as avg_hs_first_collab_response,
	ifnull(lmct.avg_hs_to_merge,0) as avg_hs_to_merge,
	ifnull(lmct.avg_hs_to_close,0) as avg_hs_to_close,
    ifnull(lmct.pending_issue_age,0) as avg_pending_issue_age,
    ifnull(round((lcr.num_merged / (lcr.num_merged + lcr.num_closed + lcr.num_pending) * 100),2),0) as prctg_merged,
    ifnull(round((lcr.num_closed / (lcr.num_merged + lcr.num_closed + lcr.num_pending) * 100),2),0) as prctg_closed,
    ifnull(round((lcr.num_pending / (lcr.num_merged + lcr.num_closed + lcr.num_pending) * 100),2),0) as prctg_pending
from
    _label_count_resolution lcr
        left outer join
    _label_avg_response_time lrt ON lrt.label_id = lcr.label_id and lrt.repo_id = lcr.repo_id
		left outer join
	_label_merge_close_time lmct on lmct.label_id = lcr.label_id and lmct.repo_id = lcr.repo_id
;

ALTER TABLE _label_resolution_stats ADD INDEX (repo_id);
ALTER TABLE _label_resolution_stats ADD INDEX (label_id);
