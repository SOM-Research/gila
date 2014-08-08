-- Selects the user(s) that have contributed in the maximum number of issues tagged with a label
-- The participation may be a comment, close, merge or reopen action



-- query without using group_concat()

    select 
        ulc.label_id, ulc.user_id
    from
        count_user_label_collaboration ulc
    where
        ulc.num_issue_collaborations = (select 
                max(max_us_lab.num_issue_collaborations)
            from
                count_user_label_collaboration as max_us_lab
            where
                max_us_lab.label_id = ulc.label_id)
;

-- query using group_concat to concat the max contributors for a label in a string using ; as separator

create view label_max_contributor as
select 
    label_id,
    group_concat(user_id
        SEPARATOR ';') as major_contributor
from
    count_user_label_collaboration ulc
where
    ulc.num_issue_collaborations = (select 
            max(max_us_lab.num_issue_collaborations)
        from
            count_user_label_collaboration as max_us_lab
        where
            max_us_lab.label_id = ulc.label_id)
group by label_id;