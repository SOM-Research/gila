create table _issue_resolution(
issue_id int(11),
resolution varchar(15),
solved_by int(11)
) ENGINE=InnoDB
;

insert into _issue_resolution

-- obtains the resolution of an issue
-- possible resolution values are: 'merged', 'closed' and 'pending'

-- selects as merged all those issues that have associated a merged event
select distinct ie.issue_id, 'merged' as resolution, ie.actor_id as solved_by
from issue_events ie
where ie.action = 'merged'

union

-- selects as closed all those issues that have associated a closed action, and don't have a posterior reopen action
-- and the issue does not have a merged event attached
select distinct ie.issue_id, 'closed' as resolution, ie.actor_id as solved_by
from issue_events ie
where ie.created_at > ifnull((select max(ie1.created_at) from issue_events ie1 where ie1.issue_id = ie.issue_id and ie1.action = 'reopened'),'0000-00-00 00:00:00') 
	  and ie.action = 'closed'
	  and not exists (select ie2.issue_id from issue_events ie2 where ie2.action = 'merged' and ie2.issue_id = ie.issue_id)

union
-- selects as pending all those issues that have not been merged or closed
-- or that have a reopened action posterior to all closed actions
select distinct ie.issue_id, 'pending' as resolution, null as solved_by
from issue_events ie
where not exists (select ie1.issue_id from issue_events ie1 where ie1.issue_id = ie.issue_id and (ie1.action = 'merged' or ie1.action = 'closed'))
	  or exists (select ie2.issue_id from issue_events ie2 where ie2.issue_id = ie.issue_id and ie2.action = 'reopened' and ie2.created_at > 
	  ifnull((select max(ie3.created_at) from issue_events ie3 where ie3.issue_id = ie.issue_id and ie3.action = 'closed'),'0000-00-00 00:00:00'))
;
