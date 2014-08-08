-- selects related label_id, issue_id and actor_id
-- An issue is related to a label if the issue is tagged with that label
-- An actor (user) is related to an issue if the actor somehow contributed to that issue
-- A user is considered to contribute to an issue if he made a comment on the issue or if he
-- performed a merge, close or reopen action on that issue.
-- only one user contribution per issue is considered

create table _user_label_collaboration (
label_id int(11),
issue_id int(11),
user_id int(11)
) ENGINE=InnoDB
;

insert into _user_label_collaboration

-- obtains issue event contributions
select distinct
li.label_id, li.issue_id, e.actor_id
from
label_issues li
            inner join
        issue_events e ON li.issue_id = e.issue_id
where e.action = 'merged' or e.action = 'closed' or e.action = 'reopened'

union

-- obtains issue comment contributions
select distinct
        li.label_id,
		li.issue_id,
        c.user_id
    from
        label_issues li
            inner join
        issue_comments c ON li.issue_id = c.issue_id

order by label_id
;