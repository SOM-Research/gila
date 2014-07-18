-- selects for each label, the number of issues merged, the number of issues closed
-- and the number of issues pending

create table _label_count_resolution (
label_id int(11),
label_name varchar(24),
num_merged int(11),
num_closed int(11),
num_pending int(11)
) ENGINE=InnoDB CHARACTER SET=utf8
;

insert into _label_count_resolution

select 
    l.id,
    l.name,
    ifnull(merged_label.num_merged,0) as num_merged,
    ifnull(closed_label.num_closed,0) as num_closed,
	ifnull(pending_label.num_pending,0) as num_pending
from
    repo_labels l
        left outer join
    (select 
        label_id, count(issue_id) as num_merged
    from
        _label_issue_resolution
    where
        resolution = 'merged'
    group by label_id) as merged_label ON l.id = merged_label.label_id
        left outer join
    (select 
        label_id, count(issue_id) as num_closed
    from
        _label_issue_resolution
    where
        resolution = 'closed'
    group by label_id) as closed_label ON l.id = closed_label.label_id
left outer join
(select 
        label_id, count(issue_id) as num_pending
    from
        _label_issue_resolution
    where
        resolution = 'pending'
    group by label_id) as pending_label ON l.id = pending_label.label_id
where
    l.repo_id = 1
;

select * from _label_count_resolution;
