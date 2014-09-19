package fr.inria.atlanmod.labelanalysis.model;

import java.io.StringWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonWriter;

import fr.inria.atlanmod.labelanalysis.data.LabelDAO;
import fr.inria.atlanmod.labelanalysis.data.ProjectDAO;

public class LabelAnalyzer {
	
	private Connection con;
	private JsonObjectBuilder jsonBuilder;
	private StringWriter writer;
	private JsonObject jsonObject;
	private JsonWriter jw;
	
	public LabelAnalyzer(Connection con) {
		this.con = con;
	}
	
	public String getProjectLabels(String projectid) throws SQLException {
		
		LabelDAO labelDAO = new LabelDAO(con);
        writer = new StringWriter();
        ResultSet result = null;
		try {
	        result = labelDAO.getLabels(projectid);
	        while(result.next()) {
		        jsonBuilder = Json.createObjectBuilder();
		        jsonBuilder.add("id", result.getString("id"));
		        jsonBuilder.add("name", result.getString("name"));
		        jsonBuilder.add("num_issues", result.getString("num_issues"));
		        
		        jsonObject = jsonBuilder.build();
		
		        jw = Json.createWriter(writer);
		        jw.writeObject(jsonObject);
		        if(!result.isLast())
		        	writer.write(",");
		        jw.close();
		      }
		        
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close(); }
		}
      
		return writer.toString();
	}
	
	public String getLabelRelations(String projectid) throws SQLException {
		
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
        ResultSet result = null;
		try {
		        result = labelDAO.getLabelRelation(projectid);
		        while(result.next()) {
			        jsonBuilder = Json.createObjectBuilder();
			        jsonBuilder.add("label1_id", result.getString("label1_id"));
			        jsonBuilder.add("label2_id", result.getString("label2_id"));
			        jsonBuilder.add("value", result.getString("value"));
			        
			        jsonObject = jsonBuilder.build();
			
			        jw = Json.createWriter(writer);
			        jw.writeObject(jsonObject);
			        if(!result.isLast())
			        	writer.write(",");
			        jw.close();
			      }
		
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close(); }    
		}
        
        return writer.toString();
	} 
	
	public String getMaxLabelRelationCount(String projectid) throws SQLException {

		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
		        result = labelDAO.getMaxLabelRelationCount(projectid);
		        while(result.next()) {
		        	jsonBuilder = Json.createObjectBuilder();
		        	String maxlinkvalue = result.getString("max_relation_count") != null ? result.getString("max_relation_count") : "0"; 
				    jsonBuilder.add("maxlinkvalue", maxlinkvalue);
				    jsonObject = jsonBuilder.build();
					
			        jw = Json.createWriter(writer);
			        jw.writeObject(jsonObject);
			        jw.close();
			    }
	
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close(); }    
		}
	    
	    return writer.toString();
	}
	
	public String getMaxLabelIssueCount(String projectid) throws SQLException {
	
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
		        result = labelDAO.getMaxLabelIssueCount(projectid);
		        while(result.next()) {
		        	jsonBuilder = Json.createObjectBuilder();
		        	String maxcount = result.getString("max_issue_count") != null ? result.getString("max_issue_count") : "0";  
				    jsonBuilder.add("maxnodevalue", maxcount);
				    jsonObject = jsonBuilder.build();
			        jw = Json.createWriter(writer);
			        jw.writeObject(jsonObject);
			        jw.close();
			    }
	
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close(); }    
		}
		
		return writer.toString();
	}
	
	public String getInitialProjects() throws SQLException {
		
		ProjectDAO projectDAO = new ProjectDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
			
	        result = projectDAO.getMostRelevantProjects();
	        while(result.next()) {
	        	jsonBuilder = Json.createObjectBuilder();
			    jsonBuilder.add("projectId", result.getString("id"));
			    String projectName = result.getString("name") + "[" + result.getString("login") + "]";
			    jsonBuilder.add("projectName", projectName);
			    jsonBuilder.add("login", result.getString("login"));
			    jsonBuilder.add("name", result.getString("name"));
			    
			    jsonObject = jsonBuilder.build();
				
			    jw = Json.createWriter(writer);
		        jw.writeObject(jsonObject);
		        writer.write(",");
		        jw.close();
		    }

		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close();}    
		}
		//remove last , from json object stream, 
		//less costly than invoking isLast() in resultSet object
        String jsonstream = writer.toString();
        if (jsonstream.length() > 0) {
        	jsonstream = jsonstream.substring(0,jsonstream.length()-1);
        }

		return jsonstream;
	}
	
	public String getProjectsMatchingSearchPattern(String searchpattern) throws SQLException {
		
		ProjectDAO projectDAO = new ProjectDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
	        result = projectDAO.getProjectByNameLikeSearchString(searchpattern);
	        
	        while(result.next()) {
	            jsonBuilder = Json.createObjectBuilder();
			    jsonBuilder.add("projectId", result.getString("id"));
			    String projectName = result.getString("name") + "[" + result.getString("login") + "]";
			    jsonBuilder.add("projectName", projectName);
			    jsonBuilder.add("login", result.getString("login"));
			    jsonBuilder.add("name", result.getString("name"));
			    
			    jsonObject = jsonBuilder.build();
				
		        jw = Json.createWriter(writer);
		        jw.writeObject(jsonObject);
		        if(!result.isLast())
		        	writer.write(",");
		        jw.close();
		    }
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			if (result != null) { result.getStatement().close();}    
		}
		
		return writer.toString();

	}
	
	public String getAllLabels(String projectId) throws SQLException {
	
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
	        result = labelDAO.getAllProjectLabels(projectId);
	        while(result.next()) {
	        	jsonBuilder = Json.createObjectBuilder();
			    jsonBuilder.add("labelId", result.getString("id"));
			    jsonBuilder.add("labelName", result.getString("name"));
			    
			    jsonObject = jsonBuilder.build();
				
		        jw = Json.createWriter(writer);
		        jw.writeObject(jsonObject);
		        if(!result.isLast())
		        	writer.write(",");
		        jw.close();
		    }

	} catch (SQLException sqle) {
		sqle.printStackTrace();
	
	} finally {
		/*
		 * We close the statement because according to the JavaDocs,
		 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
		 */
		if (result != null) { result.getStatement().close(); }    
	}
		
	return writer.toString();
	}
	
	public String getRQ2Labels(String projectId) throws SQLException {
		
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
	        result = labelDAO.selectProjectCommentedLabels(projectId);
	        while(result.next()) {
	        	jsonBuilder = Json.createObjectBuilder();
			    jsonBuilder.add("labelId", result.getString("label_id"));
			    jsonBuilder.add("labelName", result.getString("label_name"));
			    
			    jsonObject = jsonBuilder.build();
				
		        jw = Json.createWriter(writer);
		        jw.writeObject(jsonObject);
		        if(!result.isLast())
		        	writer.write(",");
		        jw.close();
		    }

	} catch (SQLException sqle) {
		sqle.printStackTrace();
	
	} finally {
		/*
		 * We close the statement because according to the JavaDocs,
		 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
		 */
		if (result != null) { result.getStatement().close(); } 
		}
		
		return writer.toString();
	}
	
	public String getRQ3Labels(String projectId) throws SQLException {
	
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
	        result = labelDAO.getLabelResolutionNonZeroLabels(projectId);
	        while(result.next()) {
	        	jsonBuilder = Json.createObjectBuilder();
			    jsonBuilder.add("labelId", result.getString("label_id"));
			    jsonBuilder.add("labelName", result.getString("label_name"));
			    
			    jsonObject = jsonBuilder.build();
				
		        jw = Json.createWriter(writer);
		        jw.writeObject(jsonObject);
		        if(!result.isLast())
		        	writer.write(",");
		        jw.close();
		    }
	
	} catch (SQLException sqle) {
		sqle.printStackTrace();
	
	} finally {
		/*
		 * We close the statement because according to the JavaDocs,
		 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
		 */
		if (result != null) { result.getStatement().close(); }    
	}
	
return writer.toString();
}
	
public String getProjectId(String projectName, String ownerLogin) throws SQLException {
	
	ProjectDAO projectDAO = new ProjectDAO(con);
	writer = new StringWriter();
	ResultSet result = null;
	
	try {
        result = projectDAO.getProjectIdByNameandOwner(projectName, ownerLogin);
        while(result.next()) {
        	jsonBuilder = Json.createObjectBuilder();
		    jsonBuilder.add("projectId", result.getString("id"));
		    
		    jsonObject = jsonBuilder.build();
			
	        jw = Json.createWriter(writer);
	        jw.writeObject(jsonObject);
	        jw.close();
	    }

} catch (SQLException sqle) {
	sqle.printStackTrace();

} finally {
	/*
	 * We close the statement because according to the JavaDocs,
	 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
	 */
	if (result != null) { result.getStatement().close(); }    
}
	
return writer.toString();
}
	
public String getLabelContributors(String projectId, String labelId) throws SQLException {
	
	LabelDAO labelDAO = new LabelDAO(con);
	writer = new StringWriter();
	ResultSet result = null;
	try {
		
		 result = labelDAO.getLabelContributors(projectId, labelId);
		 while(result.next()) {
			 jsonBuilder = Json.createObjectBuilder();
			 jsonBuilder.add("id", result.getString("user_id"));
			 jsonBuilder.add("name", result.getString("login"));
			 jsonBuilder.add("role", result.getString("role"));
			 jsonBuilder.add("num_created_issues", result.getString("num_created_issues"));
			 jsonBuilder.add("num_solved_issues", result.getString("num_solved_issues"));
			 jsonBuilder.add("num_comments", result.getString("num_comments"));
			 jsonBuilder.add("type", result.getString("type"));
			 
			 jsonObject = jsonBuilder.build();
			 
			 jw = Json.createWriter(writer);
		     jw.writeObject(jsonObject);
	         if(!result.isLast())
	        	writer.write(",");
	         jw.close();
		 }
		
	} catch (SQLException e) {
		e.printStackTrace();
		
	} finally {
		/*
		 * We close the statement because according to the JavaDocs,
		 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
		 */
		if (result != null) { result.getStatement().close(); }
	}
	
	return writer.toString();
}
	
	public String getLabelComments(String labelId) throws SQLException {
		
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
			
			result = labelDAO.getLabelUserComments(labelId);
			 while(result.next()) {
				 jsonBuilder = Json.createObjectBuilder();
				 jsonBuilder.add("userid", result.getString("user_id"));
				 jsonBuilder.add("value", result.getString("value"));
				 
				 jsonObject = jsonBuilder.build();
				 
				 jw = Json.createWriter(writer);
			     jw.writeObject(jsonObject);
		         if(!result.isLast())
		        	writer.write(",");
		         jw.close();
			 }
			
		} catch (SQLException e) {
			e.printStackTrace();
			
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close(); }
		}
		
		return writer.toString();
	}
	
	public String getLabelById(String labelId) throws SQLException {
		
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
			
			result = labelDAO.getLabelById(labelId);
			 while(result.next()) {
				 jsonBuilder = Json.createObjectBuilder();
				 jsonBuilder.add("id", result.getString("id"));
				 jsonBuilder.add("name", result.getString("name"));
				 jsonBuilder.add("type", result.getString("type"));
				 
				 jsonObject = jsonBuilder.build();
				 
				 jw = Json.createWriter(writer);
			     jw.writeObject(jsonObject);
		         if(!result.isLast())
		        	writer.write(",");
		         jw.close();
			 }
			
		} catch (SQLException e) {
			e.printStackTrace();
		
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close(); }
		}
				
		return writer.toString();
	}
	
	public String getRQ2MaxValues(String projectId) throws SQLException {
		
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet maxCreated = null, maxSolved = null, maxComments = null;
		try {
			
			maxCreated = labelDAO.selectMaxCreatedIssuesProject(projectId);
			maxSolved = labelDAO.selectMaxSolvedIssuesProject(projectId);
			maxComments = labelDAO.selectMaxLabelCommentsNumProject(projectId);
			
			while(maxCreated.next()) {
				 jsonBuilder = Json.createObjectBuilder();
				 String maxCreatedValue = maxCreated.getString("max_created") != null ? maxCreated.getString("max_created") : "0";
				 jsonBuilder.add("max_created", maxCreatedValue);
				 
				 jsonObject = jsonBuilder.build();
				 jw = Json.createWriter(writer);
			     jw.writeObject(jsonObject);
			}
			
			writer.write(",");
			
			while(maxSolved.next()) {
				 jsonBuilder = Json.createObjectBuilder();
				 String maxSolvedValue = maxSolved.getString("max_solved") != null ? maxSolved.getString("max_solved") : "0";
				 jsonBuilder.add("max_solved", maxSolvedValue);
				 
				 jsonObject = jsonBuilder.build();
				 jw = Json.createWriter(writer);
			     jw.writeObject(jsonObject);
			}
			
			writer.write(",");
			
			while(maxComments.next()) {
				 jsonBuilder = Json.createObjectBuilder();
				 String maxCommentsValue = maxComments.getString("max_comments") != null ? maxComments.getString("max_comments") : "0";
				 jsonBuilder.add("max_comments", maxCommentsValue);
				 
				 jsonObject = jsonBuilder.build();
				 jw = Json.createWriter(writer);
			     jw.writeObject(jsonObject);
			}
			

						
		} catch (SQLException e) {
			e.printStackTrace();
		
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (maxCreated != null) { maxCreated.getStatement().close(); }
			if (maxSolved != null) { maxSolved.getStatement().close(); }
			if (maxComments != null) { maxComments.getStatement().close(); } 
			if (jw != null) {jw.close();}
			
		}
		
		return writer.toString();
	}
	
	public String getLabelResolutionInfo(String labelId) throws SQLException {
		
		LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
			result = labelDAO.getLabelResolutionData(labelId);
			 while(result.next()) {
				 				 
				 jsonBuilder = Json.createObjectBuilder();
				 jsonBuilder.add("label_id", result.getString("label_id"));
				 jsonBuilder.add("label_name", result.getString("label_name"));
				 jsonBuilder.add("avg_hs_first_comment", result.getString("avg_hs_first_comment"));
				 jsonBuilder.add("avg_hs_first_collab_response", result.getString("avg_hs_first_collab_response"));
				 jsonBuilder.add("avg_hs_to_merge", result.getString("avg_hs_to_merge"));
				 jsonBuilder.add("avg_hs_to_close", result.getString("avg_hs_to_close"));
				 jsonBuilder.add("avg_pending_issue_age", result.getString("avg_pending_issue_age"));
				 jsonBuilder.add("prctg_merged", result.getString("prctg_merged"));
				 jsonBuilder.add("prctg_closed", result.getString("prctg_closed"));
				 jsonBuilder.add("prctg_pending", result.getString("prctg_pending"));
				 
				 
				 jsonObject = jsonBuilder.build();
				 
				 jw = Json.createWriter(writer);
			     jw.writeObject(jsonObject);
			     if(!result.isLast())
			    	writer.write(",");
			     jw.close();
			}
			 
		} catch (SQLException e) {
			e.printStackTrace();
			
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close(); }
		}
		
	return writer.toString();
 }
	
 public String getProjectSummaryInformation(String projectId) throws SQLException {
	
	 LabelDAO labelDAO = new LabelDAO(con);
		writer = new StringWriter();
		ResultSet result = null;
		try {
			result = labelDAO.getProjectLabelinfo(projectId);
			 while(result.next()) {
				 jsonBuilder = Json.createObjectBuilder();
				 jsonBuilder.add("num_labels", result.getString("num_labels"));
				 jsonBuilder.add("perc_labeled", result.getString("perc_labeled"));
				 jsonBuilder.add("avg_num_labels", result.getString("avg_num_labels"));
				
				 jsonObject = jsonBuilder.build();
				
				 jw = Json.createWriter(writer);
			     jw.writeObject(jsonObject);
			     jw.close();
			 }
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			/*
			 * We close the statement because according to the JavaDocs,
			 * When a Statement object is closed, its current ResultSet object, if one exists, is also closed.
			 */
			if (result != null) { result.getStatement().close(); }
		}
		
	return writer.toString();
 }
	
}
