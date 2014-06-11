create table _issue_resolution(
issue_id int(11),
resolution varchar(15)
) ENGINE=InnoDB
;

insert into _issue_resolution

-- obtains the resolution of an issue
-- possible resolution values are: 'merged', 'closed' and 'pending'

-- selects as merged all those issues that have associated a merged event
select distinct ie.issue_id, 'merged' as resolution
from issue_events ie
where ie.action = 'merged'

union

-- selects as closed all those issues that have associated a closed action, and this action is the latest action for the issue
-- and the issue does not have a merged event attached
select distinct ie.issue_id, 'closed' as resolution
from issue_events ie
where ie.created_at >= all (select ie1.created_at from issue_events ie1 where ie1.issue_id = ie.issue_id) 
	  and ie.action = 'closed'
	  and not exists (select ie2.issue_id from issue_events ie2 where ie2.action = 'merged' and ie2.issue_id = ie.issue_id)

union

-- selects as pending all those issues that have not been merged and don't have a closed action as its latest action
select distinct ie.issue_id, 'pending' as resolution
from issue_events ie
where ie.created_at >= all (select ie1.created_at from issue_events ie1 where ie1.issue_id = ie.issue_id) 
	  and ie.action <> 'closed'
	  and not exists (select ie2.issue_id from issue_events ie2 where ie2.action = 'merged' and ie2.issue_id = ie.issue_id)
;
