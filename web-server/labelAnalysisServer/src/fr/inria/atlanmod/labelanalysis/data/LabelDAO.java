package fr.inria.atlanmod.labelanalysis.data;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class LabelDAO {
	
	private Connection con;
	
	public LabelDAO(Connection con) {
		this.con = con;
	}
	
	public ResultSet getAllProjectLabels(String projectid) throws SQLException {

		Statement stmt = null;
		try {
			String query = "select id, name"
							+ " from repo_labels"
							+ " where repo_id = " + projectid
							+ " group by name";
	
	        stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
        	return rs;
	        
		} catch (SQLException e) {
			throw e;			
		} 
	}
	
	public ResultSet getLabels(String projectid) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select id, name, num_issues"
							+ " from _repo_label_num_issues"
							+ " where repo_id = " + projectid
							+ " order by name";
	
	        stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
	        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	public ResultSet getLabelResolutionNonZeroLabels(String projectid) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select label_id, label_name"
						+ " from _label_resolution_stats"
						+ " where repo_id = " + projectid
						+ " and (prctg_merged <> 0 or prctg_closed <> 0 or prctg_pending <> 0);";
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
	        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	public ResultSet getLabelRelation(String projectid) throws SQLException {

		Statement stmt = null;
		try {
			String query = "select label1_id, label2_id, count(issue_id) as value"
							+ " from _label_relation"
							+ " where repo_id = " + projectid
							+ " group by label1_id, label2_id";
	
	
	        stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
	      
		} catch (SQLException e) {
			throw e;			
		} 
	}
	
	/**
	 * Selects the max value from table label_relation
	 * This is the pair of labels that most times appear together on an issue
	 * @param projectid the id of the project to which the query is applied
	 * @return max label relation value
	 * @throws SQLException
	 */
	public ResultSet getMaxLabelRelationCount(String projectid) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select max(value) as max_relation_count"
						+ " from "
						+ "(select label1_id, label2_id, count(issue_id) as value"
							+ " from _label_relation"
							+ " where repo_id = " + projectid
							+ " group by label1_id , label2_id) as count_labels_together";
			
	        stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
		
		} catch (SQLException e) {
			throw e;			
		} 
	}
	
	public ResultSet getMaxLabelIssueCount(String projectid) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select max(num_issues) as max_issue_count"
						 + " from _repo_label_num_issues"
						 + " where repo_id = " + projectid;
			
	        stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	public ResultSet getLabelById(String labelId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select id, name, 'label' as type"
						+ " from repo_labels where id = " + labelId;
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;			
		} 
	}
	
	/**
	 * Selects from the database the list of users that contribute to a given label
	 * @param labelId The target label
	 * @return A list with one item per user that contributed to the given label. 
	 * Each item has the structure (id, name, role, num_created_issues, num_solved_issues, type)
	 * @throws SQLException
	 */
	public ResultSet getLabelContributors(String projectId, String labelId) throws SQLException {
		
		Statement stmt = null;
		try {

			String query = "select label_users.user_id,"
						  + "label_users.login,"
						  + "if(cpp.user_id is null, 'user', 'administrator') as role,"
						  + "ifnull(ncli.num_issues, 0) as num_created_issues,"
						  + "ifnull(lnis.num_solved, 0) as num_solved_issues,"
						  + "ifnull(lnuc.num_comments, 0) as num_comments,"
						  + "'user' as type"
						  + " from"
						  + " (select user_id, login, repo_id, label_id"
							  + " from"
							  + " ((select user_id, repo_id, label_id"
							  	+ " from _label_issue_comments"
							  	+ " where repo_id = " + projectId + " and label_id = " + labelId + " and user_id is not null"
							  	+ " group by user_id) as label_user_ids"
							  	+ " inner join users u"
							  	+ " on label_user_ids.user_id = u.id"
							  	+ ")) as label_users"
						  + " left join _collaborators_per_project cpp on cpp.user_id = label_users.user_id and cpp.project_id = label_users.repo_id"
						  + " left join _label_num_issues_solved lnis on lnis.solved_by = label_users.user_id and lnis.repo_id = label_users.repo_id and lnis.label_id = label_users.label_id"
						  + " left join _num_created_label_issues_user ncli on ncli.created_by = label_users.user_id and ncli.repo_id = label_users.repo_id and ncli.label_id = label_users.label_id"
						  + " left join _label_num_user_comments lnuc on lnuc.label_id = label_users.label_id and lnuc.user_id = label_users.user_id"
					;

			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;			
		} 
	}
	
	
	/**
	 * Selects the list of users that have commented on a label
	 * @param labelId The id of the label we want to query
	 * @return A list containing the id of the user and the number of comments
	 * he has made to issues containing the given label (only one comment per issue is considered) 
	 * @throws SQLException
	 */
	public ResultSet getLabelUserComments(String labelId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select 	user_id, count(distinct issue_id) as value"
						+ " from _label_issue_comments"
						+ " where label_id = " + labelId + " and user_id is not null"
						+ " group by label_id, label_name, user_id";
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
	        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	/**
	 * Selects the maximum number of issues a user has created for a given label
	 * @param labelId The id of the label for which we want to get the max value
	 * @return A ResultSet containing an integer element that holds the max created issues value
	 * @throws SQLException
	 */
	public ResultSet getMaxCreatedIssues(String labelId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select max(num_issues) as max_created"
						+ " from _num_created_label_issues_user"
						+ " where label_id = " + labelId;
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;			
		} 
	}
	
	/**
	 * Selects the maximum number of issues per label a user has created for a given project
	 * @param projectId The id of the requested project
	 * @return A ResultSet with an integer element holding the max created issues value
	 * @throws SQLException
	 */
	public ResultSet selectMaxCreatedIssuesProject(String projectId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select max(num_issues) as max_created"
					+ " from _num_created_label_issues_user"
					+ " where label_id <> 0 and repo_id = " + projectId;
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;			
		} 
	}
	
	/**
	 * Selects the maximum number of issues a user has solved for a given label
	 * @param labelId The id of the label for which we want to get the max value
	 * @return A ResultSet with an integer representing the max solved issues value
	 * @throws SQLException
	 */
	public ResultSet getMaxSolvedIssues(String labelId) throws SQLException {
		
		Statement stmt = null;
		try {
			
			String query = "select max(num_solved) as max_solved"
						+ " from _label_num_issues_solved"
						+ " where label_id = " + labelId;
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	/**
	 * Selects the maximum number of issues per label a user has solved for a given project
	 * @param projectId the analyzed project 
	 * @return A ResultSet with an integer containing the max solved issues value
	 * @throws SQLException
	 */
	public ResultSet selectMaxSolvedIssuesProject(String projectId) throws SQLException {
		
		Statement stmt = null;
		try {
			
			String query = "select max(num_solved) as max_solved"
					+ " from _label_num_issues_solved"
					+ " where label_id <> 0 and repo_id = " + projectId;
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	
	/**
	 * Selects the maximum number of comments a user has made to issues of a given label
	 * @param labelId The id of the label we want to query
	 * @return A ResultSet with an integer containing the max number of comments for the label
	 * @throws SQLException
	 */
	public ResultSet getMaxComments(String labelId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select max(num_comments) as max_comments"
						+ " from ("
							+ " select user_id, count(distinct issue_id) as num_comments"
							+ " from _label_issue_comments"
							+ " group by label_id, user_id) as count_label_comments";
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	/**
	 * Selects the maximum number of comments that a user has made to a label in a given project
	 * @param projectId The queried project
	 * @return A ResulteSet containing a single column which holds the requested max value (integer)
	 * @throws SQLException
	 */
	public ResultSet selectMaxLabelCommentsNumProject(String projectId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select max(num_comments) as max_comments"
					+ " from ("
					+ " select  label_id, user_id, count(distinct issue_id) as num_comments"
					+ " from _label_issue_comments"
					+ " where repo_id = " + projectId + " and user_id is not null and label_id <> 0"
					+ " group by label_id, user_id"
					+ " ) as count_label_comments";

			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
        
		} catch (SQLException e) {
			throw e;
		}
	}
	
	/**
	 * Queries the database to obtain information about label resolution
	 * Retrieves the following data (label_id, label_name, avg_hs_first_comment,
	 * avg_hs_first_collab_response, avg_hs_to_merge, avg_hs_to_close,
	 * prctg_merged, prctg_closed, prctg_pending)
	 * @param labelId The id of the label for which the data is requested
	 * @return A ResultSet containing the result of the query for the provided label
	 * @throws SQLException
	 */
	public ResultSet getLabelResolutionData(String labelId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select label_id, label_name, "
								+ "avg_hs_first_comment, avg_hs_first_collab_response,"
								+ " avg_hs_to_merge, avg_hs_to_close, avg_pending_issue_age,"
								+ " prctg_merged, prctg_closed, prctg_pending"
						+  " from _label_resolution_stats"
						+  " where label_id = " + labelId;
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
	        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	/**
	 * Queries the database to obtain information about label resolution
	 * The values are calculated considering the median instead
	 * of the mean (average) value, which is a better indicator when the distribution
	 * contains extreme outlier values
	 * @param labelId labelId The id of the label for which the data is requested
	 * @return A ResultSet containing the following information:
	 * 	hs_first_comment,
	 *  hs_collab_response,
	 *  hs_to_merge,
	 *  hs_to_close,
	 *  pending_issue_age,
	 *  prctg_merged,
	 *  prctg_closed,
	 *  prctg_pending
	 * @throws SQLException
	 */
	public ResultSet getLabelResolutionDataRemovingOutliers(String labelId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select  label_id, label_name,"
					+ " case"
					+ " when (hs_first_comment_perc50th = 0 or hs_first_comment_perc50th is null)"
					+ " then ifnull(hs_first_comment_perc75th, 0)"
					+ " else hs_first_comment_perc50th"
					+ " end as hs_first_comment,"
					
					+ " case"
					+ " when (hs_collab_response_perc50th = 0 or hs_collab_response_perc50th is null)"
					+ " then ifnull(hs_collab_response_perc75th, 0)"
					+ " else hs_collab_response_perc50th"
					+ " end as hs_collab_response,"
					
					+ " case"
					+ " when (issue_merge_time_hs_to_solve_perc50th = 0 or issue_merge_time_hs_to_solve_perc50th is null)"
					+ " then ifnull(issue_merge_time_hs_to_solve_perc75th, 0)"
					+ " else issue_merge_time_hs_to_solve_perc50th"
					+ " end as hs_to_merge,"
					
					+ " case"
					+ " when (issue_close_time_hs_to_solve_perc50th = 0 or issue_close_time_hs_to_solve_perc50th is null)"
					+ " then ifnull(issue_close_time_hs_to_solve_perc75th, 0)"
					+ " else issue_close_time_hs_to_solve_perc50th"
					+ " end as hs_to_close,"
					
					+ " case"
					+ " when (pending_issue_age_perc50th = 0 or pending_issue_age_perc50th is null)"
					+ " then ifnull(pending_issue_age_perc75th, 0)"
					+ " else pending_issue_age_perc50th"
					+ " end as pending_issue_age,"
				
					+ " round(num_merged / (num_merged + num_closed + num_pending) * 100, 2) as prctg_merged,"
					+ " round(num_closed / (num_merged + num_closed + num_pending) * 100, 2) as prctg_closed,"
					+ " round(num_pending / (num_merged + num_closed + num_pending) * 100, 2) as prctg_pending"
					+ " from _label_statistics"
					+ " where label_id = "+ labelId;
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
	        
		} catch (SQLException e) {
			throw e;
		} 
	}
	
	public ResultSet selectProjectCommentedLabels(String projectid) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select pl.repo_id, pl.id as label_id, pl.name as label_name "
						+ " from " 
							+ "	(select id, name, repo_id from repo_labels where repo_id = " + projectid + ") as pl"
						+ " inner join"
							+ " _label_num_user_comments luc "
						+ " on pl.id = luc.label_id"
						+ " where label_id <> 0 and num_comments > 0"
						+ " group by label_id, label_name";

			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
	
		} catch (SQLException e) {
			throw e;
		}
	}

	/**
	 * Selects the avg_number of labels per issue, percentage of labeled issues and num of defined labels
	 * for a given project
	 * @param projectId The id of the project to query
	 * @return a ResultSet with one row and three columns, namely: num_labels, perc_labeled, avg_num_labels
	 * @throws SQLException
	 */
	public ResultSet getProjectLabelinfo(String projectId) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select"
						//selects the number of distinct labels defined in a project
						+ "(select count(id) from repo_labels where repo_id = " + projectId + ") as num_labels,"
						//counts the number of (distinct) labeled issues and the total number of issues in a project
						//then obtains the percentage of labeled issues as #labeled / #total * 100
						+ "(select"
						+ " round(((select count(distinct li1.issue_id)"
								+ " from _label_issues li1"
								+ " where li1.repo_id = " + projectId + " and li1.label_id <> 0) / count(distinct li2.issue_id)) * 100,2)"
						+ " from _label_issues li2"
						+ " where li2.repo_id = " + projectId + ") as perc_labeled,"
						//calculates the number of labels assigned to each labeled issue, then applies
						//the average to this count column
						+ "(select round(avg(num_labels),2) from"
							+ " (select repo_id, issue_id, count(label_id) as num_labels "
							+ " from _label_issues"
							+ " where label_id <> 0 and repo_id = " + projectId
							+ " group by issue_id) as count_labels_issue"
						+ " ) as avg_num_labels";
			
			stmt = con.createStatement();
	        ResultSet rs = stmt.executeQuery(query);
	        return rs;
	
		} catch (SQLException e) {
			throw e;
		}

	}
}