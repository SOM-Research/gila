package fr.inria.atlanmod.labelanalysis.db;

	import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.apache.tomcat.dbcp.dbcp.BasicDataSource;
import org.apache.tomcat.jdbc.pool.DataSource;

public class DBConnection {

	private static String driver="com.mysql.jdbc.Driver";
	private static String url="jdbc:mysql://atlanmodexp.info.emn.fr";
	private static String port = "13506";
	public static String database = "vissoft14";
	private static String user="root";
	private static String password="coitointerrotto";
	private static Connection dbcon;
	private static boolean connected=false;

	public static void connect(){
	try {

		Class.forName(driver);
		
		StringBuilder dbFullPath = new StringBuilder(url);
		dbFullPath.append(":");
		dbFullPath.append(port);
		dbFullPath.append("/");
		dbFullPath.append(database);
		System.out.println(dbFullPath);
		dbcon = DriverManager.getConnection(dbFullPath.toString(),user,password);
		connected=true;
		System.out.println("Connected to database...");
		}
		catch (ClassNotFoundException cnfe) {
			System.out.println("Couldn't locate the driver class: " + cnfe);

		}
		catch (SQLException se) {
			System.out.println("Exception creating the database connection: " + se);

			    }
	}


	public static void disconnect(){
	if (connected==true){
	try {

		dbcon.close();
		connected = false;
		System.out.println("Database connection closed");
		} 
	catch (Exception e)
		{ System.out.println("Error while trying to close database connection "+e.toString()); }
	}else
			System.out.println("Database already disconnected");
	}
			
	public static boolean isConnected(){
		return connected;
		}

	public void disconnect(Connection con) {
		try {
			con.close();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
//	public Connection getConnection()
//	{
//		Connection con = null;
//		try {
//			Class.forName(driver);
//			
//			StringBuilder dbFullPath = new StringBuilder(url);
//			dbFullPath.append(":");
//			dbFullPath.append(port);
//			dbFullPath.append("/");
//			dbFullPath.append(database);
//			System.out.println(dbFullPath);
//			con = DriverManager.getConnection(dbFullPath.toString(),user,password);
//			connected=true;
//			System.out.println("Connected to database...");
//			}
//			catch (ClassNotFoundException cnfe) {
//				System.out.println("Couldn't locate the driver class: " + cnfe);
//	
//			}
//			catch (SQLException se) {
//				System.out.println("Exception creating the database connection: " + se);
//	
//				    }
//			return con;
//	}
	
//	public static Connection getConnection()
//	{
//		if (!connected)
//			connect();
//		return dbcon;
//
//	}
	
	public static Connection getConnection() {
		
		try {
			InitialContext cxt = new InitialContext();
			BasicDataSource ds = (BasicDataSource) cxt.lookup( "java:/comp/env/jdbc/mySqlConnectionPool" );
			return ds.getConnection();
			
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return null;
	}
}
