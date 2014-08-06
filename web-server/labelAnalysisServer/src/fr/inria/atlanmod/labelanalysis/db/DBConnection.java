package fr.inria.atlanmod.labelanalysis.db;


import java.sql.Connection;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import org.apache.tomcat.jdbc.pool.DataSource;


public class DBConnection {

	
	private DataSource src;
	private Connection con;
	
	public DBConnection() {
		
		try {
			
			InitialContext initContext = new InitialContext();
			Context envContext = (Context) initContext.lookup("java:comp/env");
			src = (DataSource) envContext.lookup("jdbc/dbCon");
			con = src.getConnection();
			
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	
	public Connection getConnection() {
		try
        {
            if(this.con==null || this.con.isClosed())
                this.con = src.getConnection();
        }
        catch(SQLException e) { 
        	e.printStackTrace(); 
        }
		
		return con;
    }

    public void disconnect() {
        try
        {
            if(this.con!=null && !this.con.isClosed())
                this.con.close();
        }
        catch(SQLException e) { e.printStackTrace();; }
    }

}
