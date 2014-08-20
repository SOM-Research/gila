package fr.inria.atlanmod.labelanalysis.data;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class ProjectDAO {

private Connection con;
	
	public ProjectDAO(Connection con) {
		this.con = con;
	}
	
public ResultSet getAllProjects() throws SQLException {
		
		Statement stmt = null;
		try {
			stmt = con.createStatement();
			String query = "select p.id, p.name, u.login"
						+ " from _orginal_projects_using_labels p inner join users u on p.owner_id = u.id"
						+ " order by p.name"
						+ " limit 100";
			
		     ResultSet rs = stmt.executeQuery(query);
		     return rs;
	     
		} catch (SQLException e) {
			throw e;			
		} 	
	}
	
	public ResultSet getProjectByNameLikeSearchString(String searchstring) throws SQLException {
		Statement stmt = null;
		try {
			stmt = con.createStatement();
			String query = "select p.id, p.name, u.login"
						+ " from _orginal_projects_using_labels p inner join users u on p.owner_id = u.id"
						+ " where p.name like '" + searchstring + "%'"
						+ " order by p.name";
			
		     ResultSet rs = stmt.executeQuery(query);
		     return rs;
	     
		} catch (SQLException e) {
			throw e;			
		} 	
	}
	
	public ResultSet getProjectIdByNameandOwner(String name, String owner) throws SQLException {
		
		Statement stmt = null;
		try {
			String query = "select p.id from"
						+ " projects p inner join users u on p.owner_id = u.id"
						+ " where u.login = '" + owner + "' and p.name = '" + name + "'";
			
			stmt = con.createStatement();
		    ResultSet rs = stmt.executeQuery(query);
		    return rs;		
		    
		} catch (SQLException e) {
			throw e;
		} 
	}
}
