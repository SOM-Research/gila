-- shows the average resolution time per label (in days)
-- the average resolution time is calculated as the difference between
-- the date the issue was created and the date it was closed
select il.label_id, avg(timestampdiff(DAY, i.created_at, ie.created_at)) as avg_resolution_time
from vissoft14.issue_labels il 
inner join vissoft14.issues i on il.issue_id = i.id
inner join vissoft14.issue_events ie on i.id = ie.issue_id
where ie.action = 'closed'
group by il.label_id
;