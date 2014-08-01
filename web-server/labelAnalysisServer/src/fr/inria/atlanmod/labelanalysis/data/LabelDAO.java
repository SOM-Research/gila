package fr.inria.atlanmod.labelanalysis.data;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import fr.inria.atlanmod.labelanalysis.db.DBConnection;

public class LabelDAO {
	
	private Connection con;
	
	public LabelDAO(Connection con) {
		this.con = con;
	}
	
	public ResultSet getAllProjectLabels(String projectid) throws SQLException {

		Statement stmt = null;
		String query = "select id, name"
						+ " from repo_labels"
						+ " where repo_id = " + projectid;

        stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;

	}
	
	public ResultSet getLabels(String projectid) throws SQLException {
		
		Statement stmt = null;
		String query = "select id, name, num_issues"
						+ " from " + DBConnection.database + ".repo_label_num_issues "
						+ " where repo_id = " + projectid;

        stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
	}
	
	public ResultSet getLabelRelation(String projectid) throws SQLException {

		Statement stmt = null;
		String query = "select label1_id, label2_id, count(issue_id) as value"
						+ " from " + DBConnection.database + ".label_relation"
						+ " where repo_id = " + projectid
						+ " group by label1_id, label2_id";


        stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
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
		String query = "select max(value) as max_relation_count"
					+ " from "
					+ "(select label1_id, label2_id, count(issue_id) as value"
						+ " from label_relation"
						+ " where repo_id = " + projectid
						+ " group by label1_id , label2_id) as count_labels_together";
		
        stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
	}
	
	public ResultSet getMaxLabelIssueCount(String projectid) throws SQLException {
		
		Statement stmt = null;
		String query = "select max(num_issues) as max_issue_count"
					 + " from repo_label_num_issues"
					 + " where repo_id = " + projectid;
		
        stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
	}
	
	public ResultSet getLabelById(String labelId) throws SQLException {
		
		Statement stmt = null;
		String query = "select id, name, 'label' as type"
					+ " from repo_labels where id = " + labelId;
		
		stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
	}
	
	/**
	 * Selects from the database the list of users that contribute to a given label
	 * @param labelId The target label
	 * @return A list with one item per user that contributed to the given label. 
	 * Each item has the structure (id, name, role, num_created_issues, num_solved_issues, type)
	 * @throws SQLException
	 */
	public ResultSet getLabelContributors(String labelId) throws SQLException {
		
		Statement stmt = null;
		String query = "select user_id as id,"
						+ " user_login as name,"
						+ " case role"
							+ " when 'collaborator' then 'administrator'"
							+ " else 'user'"
							+ " end as role,"
							+ " ifnull(ci.num_issues,0)  as num_created_issues,"
							+ " ifnull(si.num_solved,0)  as num_solved_issues,"
							+ " 'user' as type"
						+ " from project_user_role pr"
						+ " left outer join"
							+ " (select * from num_created_label_issues_user"
							+ " where label_id = "+ labelId +") ci"
						+ " ON pr.user_id = ci.created_by"
						+ " left outer join"
							+ " (select * from label_num_issues_solved"
							+ " where label_id = "+ labelId +") si"
						+ " ON pr.user_id = si.solved_by"
					+ " where user_id in "
						+ "(select distinct(user_id)"
						+ " from label_issue_comments"
						+ " where label_id = "+ labelId +")";
		
		stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
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
		String query = "select 	user_id, count(distinct issue_id) as value"
					+ " from label_issue_comments"
					+ " where label_id = " + labelId + " and user_id is not null"
					+ " group by label_id, label_name, user_id";
		
		stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
	}
	
	/**
	 * Selects the maximum number of issues a user has created for a given label
	 * @param labelId The id of the label for which we want to get the max value
	 * @return A ResultSet containing an integer element that holds the max created issues value
	 * @throws SQLException
	 */
	public ResultSet getMaxCreatedIssues(String labelId) throws SQLException {
		
		Statement stmt = null;
		String query = "select max(num_issues) as max_created"
					+ " from num_created_label_issues_user"
					+ " where label_id = " + labelId;
		
		stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
	}
	
	/**
	 * Selects the maximum number of issues a user has solved for a given label
	 * @param labelId The id of the label for which we want to get the max value
	 * @return A ResultSet with an integer representing the max solved issues value
	 * @throws SQLException
	 */
	public ResultSet getMaxSolvedIssues(String labelId) throws SQLException {
		
		Statement stmt = null;
		String query = "select max(num_solved) as max_solved"
					+ " from label_num_issues_solved"
					+ " where label_id = " + labelId;
		
		stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
	}
	
	/**
	 * Selects the maximum number of comments a user has made to issues of a given label
	 * @param labelId The id of the label we want to query
	 * @return A ResultSet with an integer containing the max number of comments for the label
	 * @throws SQLException
	 */
	public ResultSet getMaxComments(String labelId) throws SQLException {
		
		Statement stmt = null;
		String query = "select max(num_comments) as max_comments"
					+ " from ("
						+ " select user_id, count(distinct issue_id) as num_comments"
						+ " from label_issue_comments"
						+ " where label_id = " + labelId
						+ " group by user_id) as count_label_comments";
		
		stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
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
		String query = "select * "
					+  " from label_resolution_stats"
					+  " where label_id = " + labelId;
		
		stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery(query);
        return rs;
	}

}