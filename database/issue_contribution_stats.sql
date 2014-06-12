-- creates a view with information on issue contribution and resolution
-- the columns of the view are as follows:
-- issue_id: the id of the issue in the dataset
-- issue_num: the id of the issue in GitHub repository
-- created_at: creation date of the issuer
-- created_by: contributor that reported the issue
-- hs_first_comment: time passed from the creation of the issue until the submission of the first comment (in hours)
-- user_id: the user that wrote the comment
-- hs_first_collab_response: time passed from the creation of the issue until the first comment from a project collaborator (in hours)
-- collab_id: the id of the collaborator that first responded to the issue
-- cant_contributors: number of (different) contributors that have made comments on the issue
-- cant_collaborators: number of contributors in the previous column that are in turn project collaborators
-- resolution: resolution of the issue, the possible values can be 'merged' (if the issue has associated a merged action), 'closed' (if the issue was closed without merging) 
--             or 'pending' (if the issue was not merged and either closed or was closed but subsequently reopened)
-- solved_by: id of the person that solved the issue (for the states merged and closed)
-- hs_to_solve: time passed from the creation of the issue until the last closed action attached to it (in hours)

create view issue_contribution_stats as
select i.id as issue_id, i.issue_id as issue_num, i.created_at, i.reporter_id as created_by,
	i_react.hs_first_comment, i_react.user_id, i_react.hs_collab_response as hs_first_collab_response, i_react.collab_id,
	i_contrib.cant_contributors, i_contrib.cant_collab,
	i_resol.resolution, i_resol.solved_by,
	i_restime.hs_to_solve
from issues i 
left outer join _issue_reaction_time i_react on i_react.issue_id = i.id
left outer join _issue_contribution i_contrib on i_contrib.issue_id = i.id
left outer join _issue_resolution i_resol on i_resol.issue_id = i.id
left outer join _issue_resolution_time i_restime on i_restime.issue_id = i.id
where i.repo_id = 1
;
