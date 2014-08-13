package fr.inria.atlanmod.labelanalysis.servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import fr.inria.atlanmod.labelanalysis.db.DBConnection;
import fr.inria.atlanmod.labelanalysis.model.LabelAnalysisRequestHandler;

/**
 * Servlet implementation class LabelAnalysisServlet
 */
@WebServlet("/LabelAnalysisServlet")
public class LabelAnalysisServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private LabelAnalysisRequestHandler handler = new LabelAnalysisRequestHandler();
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LabelAnalysisServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Access-Control-Allow-Origin", "http://atlanmod.github.io");
		response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Origin,	X-Requested-With, Content-Type, Accept");
		response.addHeader("Access-Control-Allow-Credentials", "true");
				
		handler.handleRequest(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// TODO Auto-generated method stub
	}
	
	@Override
	protected void doOptions(HttpServletRequest arg0, HttpServletResponse response)	throws ServletException, IOException {
		response.setHeader("Access-Control-Allow-Origin", "http://atlanmod.github.io");
		response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
		response.setHeader("Access-Control-Allow-Headers", "Origin,	X-Requested-With, Content-Type, Accept");
		response.addHeader("Access-Control-Allow-Credentials", "true");
	}

}
