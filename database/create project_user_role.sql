create table project_user_role (
project_id int(11),
user_id varchar(255),
user_name varchar(255),
location varchar(255),
role varchar(25)
) ENGINE=InnoDB CHARACTER SET=utf8
;

-- selects the collaborators of the project (people with write access to the repository)
insert into project_user_role(project_id, user_id, user_name, location, role)

select c.project_id, c.user_id, c.user_name, 
	   (select location from users where id = c.user_id), 'collaborator' as role
from pm_and_contributors_per_project c
where c.project_id =1

union

-- selects the winner external contributors of the project
-- (project contributors that have at least one pull request accepted)
select ec.project_id, ec.user_id, ec.user_name, 
	   (select location from users where id = ec.user_id) as location,
	   'win_external_contributor' as role
from external_contributors_per_project ec
where ec.project_id =1

union

-- selects the failed external contributors of the projects
-- (project contributors that made at least one pull request but have none accepted)
select efc.project_id, efc.user_id, efc.user_name, 
	   (select location from users where id = efc.user_id) as location,
	   'fail_external_contributor' as role
from external_failed_contributors_per_project efc
where efc.project_id =1

union

-- selects the external users of the project
-- (people that have somehow contributed to the project, e.g. commenting on issues
-- but are not included in any of the previous groups)
select fua.project_id, fua.user_id, u.name, u.location, 'external_user' as role
from first_user_activity_per_project fua inner join users u on fua.user_id = u.id
where fua.project_id = 1 
and fua.user_id not in
(select user_id from pm_and_contributors_per_project where project_id = 1 union
 select user_id from external_contributors_per_project where project_id = 1 union
 select user_id from external_failed_contributors_per_project where project_id = 1)
;