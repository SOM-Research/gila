
-- selects the collaborator(s) that have the maximum number of first responses per label

-- original query, without using group_concat() function

select 
    nfc.label_id, nfc.collab_id
from
    lab_num_first_comments_collab nfc
where
    nfc.num_first_comments = (select 
            max(num_first_comments)
        from
            lab_num_first_comments_collab nfc1
        where
            nfc.label_id = nfc1.label_id)
;


create view lab_max_first_response_collab as

-- query using group_concat to group the max first response collab
-- in a string list using ; as separator

select 
    nfc.label_id,
    group_concat(nfc.collab_id
        SEPARATOR ';') as max_first_comment_user
from
    lab_num_first_comments_collab nfc
where
    nfc.num_first_comments = (select 
            max(num_first_comments)
        from
            lab_num_first_comments_collab nfc1
        where
            nfc.label_id = nfc1.label_id)
group by label_id
;
