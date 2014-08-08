
-- selects the user(s) that have the maximum number of first comments per issue

-- original query

select 
    nfc.label_id, 
	nfc.user_id

from
    lab_num_first_comments_user nfc
where
    nfc.num_first_comments = (select 
            max(num_first_comments)
        from
            lab_num_first_comments_user nfc1
        where
            nfc.label_id = nfc1.label_id)
;


create view lab_max_first_comment_user as

-- query using group_concat to put the users with most comments in a string list separated by ;

select 
    nfc.label_id, 
	group_concat(nfc.user_id
      SEPARATOR ';') as max_first_comment_user

from
    lab_num_first_comments_user nfc
where
    nfc.num_first_comments = (select 
            max(num_first_comments)
        from
            lab_num_first_comments_user nfc1
        where
            nfc.label_id = nfc1.label_id)
group by label_id
;