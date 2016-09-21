package fr.inria.atlanmod.labelanalysis.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.jdbc.pool.DataSource;

import fr.inria.atlanmod.labelanalysis.model.LabelAnalysisRequestHandler;
import java.util.logging.Logger;

/**
 * Servlet implementation class LabelAnalysisServlet
 */
@WebServlet("/LabelAnalysisServlet")
public class LabelAnalysisServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	private final static Logger LOGGER = Logger.getLogger(LabelAnalysisServlet.class.getName()); 
	private DataSource dataSource;
	
	public void init() throws ServletException {
		initDataSource();
	}
	
	public void initDataSource() {
		try {
			if (dataSource != null)	
				dataSource.close();

			InitialContext initContext = new InitialContext();
			Context envContext = (Context) initContext.lookup("java:comp/env");
			dataSource = (DataSource) envContext.lookup("jdbc/dbCon");
			
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private Connection getConnection() {
		Connection connection = null;
		try {
			connection = dataSource.getConnection();
			LOGGER.info("Getting database connection. Valid connection: " + connection.isValid(2));

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return connection;
	}
	
//    /**
//     * @see HttpServlet#HttpServlet()
//     */
//    public LabelAnalysisServlet() {
//        super();
//        // TODO Auto-generated constructor stub
//    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
		response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Origin,	X-Requested-With, Content-Type, Accept");
		response.addHeader("Access-Control-Allow-Credentials", "true");
		try {
			//get connection
			Connection connection = this.getConnection();
						
//			if (connection.isValid(2)) {
//				LOGGER.info("The assigned connection is closed. Reinitializing data source...");
//				initDataSource();
//				connection = this.getConnection();
//			}
			
			LOGGER.info("Number of active connections: " + dataSource.getNumActive());
			
			//actual logic
			LabelAnalysisRequestHandler handler = new LabelAnalysisRequestHandler();
			handler.handleRequest(request, response, connection);
			
			LOGGER.info("Request execution finished. Closing connection, valid: " + connection.isValid(2));
			connection.close();
			LOGGER.info("Connection closed " + connection.isClosed());

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// TODO Auto-generated method stub
	}
	
	@Override
	public void doOptions(HttpServletRequest arg0, HttpServletResponse response)	throws ServletException, IOException {
		response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
		response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Origin,	X-Requested-With, Content-Type, Accept");
		response.addHeader("Access-Control-Allow-Credentials", "true");
	}
	
}