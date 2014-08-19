package fr.inria.atlanmod.labelanalysis.model;

import java.io.StringWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLWarning;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonWriter;

import fr.inria.atlanmod.labelanalysis.data.LabelDAO;
import fr.inria.atlanmod.labelanalysis.data.ProjectDAO;
import fr.inria.atlanmod.labelanalysis.db.DBConnection;

public class LabelAnalyzer {
	
	private DBConnection dbConnection = new DBConnection();
	
	public String getProjectLabels(String projectid) throws SQLException {
		
		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
        StringWriter writer = new StringWriter();
        ResultSet result = null;
		try {
	        result = labelDAO.getLabels(projectid);
	        while(result.next()) {
		        JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
		        jsonBuilder.add("id", result.getString("id"));
		        jsonBuilder.add("name", result.getString("name"));
		        jsonBuilder.add("num_issues", result.getString("num_issues"));
		        
		        JsonObject jsonLabel = jsonBuilder.build();
		
		        JsonWriter jw = Json.createWriter(writer);
		        jw.writeObject(jsonLabel);
		        if(!result.isLast())
		        	writer.write(",");
		        jw.close();
		      }
		        
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			if (result != null) { result.getStatement().close(); }
			dbConnection.disconnect();
		}
      
		return writer.toString();
	}
	
	public String getLabelRelations(String projectid) throws SQLException {
		
		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
        StringWriter writer = new StringWriter();
		ResultSet result = null;
		try {
		        result = labelDAO.getLabelRelation(projectid);
		        while(result.next()) {
			        JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
			        jsonBuilder.add("label1_id", result.getString("label1_id"));
			        jsonBuilder.add("label2_id", result.getString("label2_id"));
			        jsonBuilder.add("value", result.getString("value"));
			        
			        JsonObject labelRelation = jsonBuilder.build();
			
			        JsonWriter jw = Json.createWriter(writer);
			        jw.writeObject(labelRelation);
			        if(!result.isLast())
			        	writer.write(",");
			        jw.close();
			      }
		
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			if (result != null) { result.getStatement().close(); }    
			dbConnection.disconnect();
		}
        
        return writer.toString();
	} 
	
	public String getMaxLabelRelationCount(String projectid) throws SQLException {

		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
		StringWriter writer = new StringWriter();
		
		ResultSet result = null;
		try {
		        result = labelDAO.getMaxLabelRelationCount(projectid);
		        while(result.next()) {
		        	JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
		        	String maxlinkvalue = result.getString("max_relation_count") != null ? result.getString("max_relation_count") : "0"; 
				    jsonBuilder.add("maxlinkvalue", maxlinkvalue);
				    JsonObject maxValue = jsonBuilder.build();
					
			        JsonWriter jw = Json.createWriter(writer);
			        jw.writeObject(maxValue);
			        jw.close();
			    }
	
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			if (result != null) { result.getStatement().close(); }    
			dbConnection.disconnect();
		}
	    
	    return writer.toString();
	}
	
	public String getMaxLabelIssueCount(String projectid) throws SQLException {
	
		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
		StringWriter writer = new StringWriter();
		ResultSet result = null;
		try {
		        result = labelDAO.getMaxLabelIssueCount(projectid);
		        while(result.next()) {
		        	JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
		        	String maxcount = result.getString("max_issue_count") != null ? result.getString("max_issue_count") : "0";  
				    jsonBuilder.add("maxnodevalue", maxcount);
				    JsonObject maxValue = jsonBuilder.build();
			        JsonWriter jw = Json.createWriter(writer);
			        jw.writeObject(maxValue);
			        jw.close();
			    }
	
		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			if (result != null) { result.getStatement().close(); }    
			dbConnection.disconnect();
		}
		
		return writer.toString();
	}
	
	public String getAllProjects() throws SQLException {
		
		Connection con = dbConnection.getConnection();
		ProjectDAO projectDAO = new ProjectDAO(con);
		StringWriter writer = new StringWriter();
		ResultSet result = null;
		try {
	        
	        result = projectDAO.getAllProjects();
	        while(result.next()) {
	        	JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
			    jsonBuilder.add("projectId", result.getString("id"));
			    String projectName = result.getString("login") + "/" + result.getString("name");
			    jsonBuilder.add("projectName", projectName);
			    
			    JsonObject jsonProject = jsonBuilder.build();
				
		        JsonWriter jw = Json.createWriter(writer);
		        jw.writeObject(jsonProject);
	        	writer.write(",");
		        jw.close();
		    }

		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			if (result != null) { result.getStatement().close();}    
			dbConnection.disconnect();
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
		
		Connection con = dbConnection.getConnection();
		ProjectDAO projectDAO = new ProjectDAO(con);
		StringWriter writer = new StringWriter();
		ResultSet result = null;
		try {
	        result = projectDAO.getProjectByNameLikeSearchString(searchpattern);
	        while(result.next()) {
	        	JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
			    jsonBuilder.add("projectId", result.getString("id"));
			    String projectName = result.getString("login") + "/" + result.getString("name");
			    jsonBuilder.add("projectName", projectName);
			    
			    JsonObject jsonProject = jsonBuilder.build();
				
		        JsonWriter jw = Json.createWriter(writer);
		        jw.writeObject(jsonProject);
		        if(!result.isLast())
		        	writer.write(",");
		        jw.close();
		    }

		} catch (SQLException sqle) {
			sqle.printStackTrace();
		
		} finally {
			if (result != null) { result.getStatement().close();}    
			dbConnection.disconnect();
		}
		
		return writer.toString();

	}
	
	public String getAllLabels(String projectId) throws SQLException {
	
		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
		StringWriter writer = new StringWriter();
		ResultSet result = null;
		try {
	        result = labelDAO.getAllProjectLabels(projectId);
	        while(result.next()) {
	        	JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
			    jsonBuilder.add("labelId", result.getString("id"));
			    jsonBuilder.add("labelName", result.getString("name"));
			    
			    JsonObject jsonLabel = jsonBuilder.build();
				
		        JsonWriter jw = Json.createWriter(writer);
		        jw.writeObject(jsonLabel);
		        if(!result.isLast())
		        	writer.write(",");
		        jw.close();
		    }

	} catch (SQLException sqle) {
		sqle.printStackTrace();
	
	} finally {
		if (result != null) { result.getStatement().close(); }    
		dbConnection.disconnect();
	}
		
	return writer.toString();
}
	
public String getProjectId(String projectName, String ownerLogin) throws SQLException {
	
	Connection con = dbConnection.getConnection();
	ProjectDAO projectDAO = new ProjectDAO(con);
	StringWriter writer = new StringWriter();
	ResultSet result = null;
	
	try {
        result = projectDAO.getProjectIdByNameandOwner(projectName, ownerLogin);
        while(result.next()) {
        	JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
		    jsonBuilder.add("projectId", result.getString("id"));
		    
		    JsonObject jsonProject = jsonBuilder.build();
			
	        JsonWriter jw = Json.createWriter(writer);
	        jw.writeObject(jsonProject);
	        jw.close();
	    }

} catch (SQLException sqle) {
	sqle.printStackTrace();

} finally {
	if (result != null) { result.getStatement().close(); }    
	dbConnection.disconnect();
}
	
return writer.toString();
}
	
public String getLabelContributors(String projectId, String labelId) throws SQLException {
	
	Connection con = dbConnection.getConnection();
	LabelDAO labelDAO = new LabelDAO(con);
	StringWriter writer = new StringWriter();
	ResultSet result = null;
	try {
		
		 result = labelDAO.getLabelContributors(projectId, labelId);
		 while(result.next()) {
			 JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
			 jsonBuilder.add("id", result.getString("user_id"));
			 jsonBuilder.add("name", result.getString("login"));
			 jsonBuilder.add("role", result.getString("role"));
			 jsonBuilder.add("num_created_issues", result.getString("num_created_issues"));
			 jsonBuilder.add("num_solved_issues", result.getString("num_solved_issues"));
			 jsonBuilder.add("num_comments", result.getString("num_comments"));
			 jsonBuilder.add("type", result.getString("type"));
			 
			 JsonObject jsonContributor = jsonBuilder.build();
			 
			 JsonWriter jw = Json.createWriter(writer);
		     jw.writeObject(jsonContributor);
	         if(!result.isLast())
	        	writer.write(",");
	         jw.close();
		 }
		
	} catch (SQLException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		
	} finally {
		if (result != null) { result.getStatement().close(); }
		dbConnection.disconnect();
	}
	
	return writer.toString();
}
	
	public String getLabelComments(String labelId) throws SQLException {
		
		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
		StringWriter writer = new StringWriter();
		ResultSet result = null;
		try {
			
			result = labelDAO.getLabelUserComments(labelId);
			 while(result.next()) {
				 JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
				 jsonBuilder.add("userid", result.getString("user_id"));
				 jsonBuilder.add("value", result.getString("value"));
				 
				 JsonObject jsonContributor = jsonBuilder.build();
				 
				 JsonWriter jw = Json.createWriter(writer);
			     jw.writeObject(jsonContributor);
		         if(!result.isLast())
		        	writer.write(",");
		         jw.close();
			 }
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		} finally {
			if (result != null) { result.getStatement().close(); }
			dbConnection.disconnect();
		}
		
		return writer.toString();
	}
	
	public String getLabelById(String labelId) throws SQLException {
		
		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
		StringWriter writer = new StringWriter();
		ResultSet result = null;
		try {
			
			result = labelDAO.getLabelById(labelId);
			 while(result.next()) {
				 JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
				 jsonBuilder.add("id", result.getString("id"));
				 jsonBuilder.add("name", result.getString("name"));
				 jsonBuilder.add("type", result.getString("type"));
				 
				 JsonObject jsonLabel = jsonBuilder.build();
				 
				 JsonWriter jw = Json.createWriter(writer);
			     jw.writeObject(jsonLabel);
		         if(!result.isLast())
		        	writer.write(",");
		         jw.close();
			 }
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		
		} finally {
			if (result != null) { result.getStatement().close(); }
			dbConnection.disconnect();
		}
				
		return writer.toString();
	}
	
	public String getRQ2MaxValues(String projectId) throws SQLException {
		
		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
		StringWriter writer = new StringWriter();
		
		ResultSet maxCreated = null, maxSolved = null, maxComments = null;
		try {
			
			maxCreated = labelDAO.selectMaxCreatedIssuesProject(projectId);
			maxSolved = labelDAO.selectMaxSolvedIssuesProject(projectId);
			maxComments = labelDAO.selectMaxLabelCommentsNumProject(projectId);
			
			while(maxCreated.next()) {
				 JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
				 String maxCreatedValue = maxCreated.getString("max_created") != null ? maxCreated.getString("max_created") : "0";
				 jsonBuilder.add("max_created", maxCreatedValue);
				 
				 JsonObject jsonMaxCreated = jsonBuilder.build();
				 JsonWriter jw = Json.createWriter(writer);
			     jw.writeObject(jsonMaxCreated);
			     jw.close();
			}
			
			writer.write(",");
			
			while(maxSolved.next()) {
				 JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
				 String maxSolvedValue = maxSolved.getString("max_solved") != null ? maxSolved.getString("max_solved") : "0";
				 jsonBuilder.add("max_solved", maxSolvedValue);
				 
				 JsonObject jsonMaxSolved = jsonBuilder.build();
				 JsonWriter jw = Json.createWriter(writer);
			     jw.writeObject(jsonMaxSolved);
			     jw.close();
			}
			
			writer.write(",");
			
			while(maxComments.next()) {
				 JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
				 String maxCommentsValue = maxComments.getString("max_comments") != null ? maxComments.getString("max_comments") : "0";
				 jsonBuilder.add("max_comments", maxCommentsValue);
				 
				 JsonObject jsonMaxComments = jsonBuilder.build();
				 JsonWriter jw = Json.createWriter(writer);
			     jw.writeObject(jsonMaxComments);
				 jw.close();
			}
			

						
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		
		} finally {
			if (maxCreated != null) { maxCreated.getStatement().close(); }
			if (maxSolved != null) { maxSolved.getStatement().close(); }
			if (maxComments != null) { maxComments.getStatement().close(); }
			dbConnection.disconnect();
		}
		
		return writer.toString();
	}
	
	public String getLabelResolutionInfo(String labelId) throws SQLException {
		
		Connection con = dbConnection.getConnection();
		LabelDAO labelDAO = new LabelDAO(con);
		StringWriter writer = new StringWriter();
		ResultSet result = null;
		try {
			result = labelDAO.getLabelResolutionData(labelId);
			 while(result.next()) {
				 				 
				 JsonObjectBuilder jsonBuilder = Json.createObjectBuilder();
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
				 
				 
				 JsonObject jsonResolution = jsonBuilder.build();
				 
				 JsonWriter jw = Json.createWriter(writer);
			     jw.writeObject(jsonResolution);
			     if(!result.isLast())
			    	writer.write(",");
			     jw.close();
			}
			 
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			
		} finally {
			if (result != null) { result.getStatement().close(); }
			dbConnection.disconnect();
		}
		
	return writer.toString();
 }
	
}
