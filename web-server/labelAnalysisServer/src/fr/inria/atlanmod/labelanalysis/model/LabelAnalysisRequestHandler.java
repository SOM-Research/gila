/**
 * 
 */
package fr.inria.atlanmod.labelanalysis.model;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 *
 */
public class LabelAnalysisRequestHandler {

	/**
	 * @param req
	 * @param res
	 */
	public void handleRequest(HttpServletRequest req, HttpServletResponse res, Connection con) {
		
		String event = req.getParameter("event");
		res.setContentType("text/x-json;charset=UTF-8");           
		res.setHeader("Cache-Control", "no-cache");
		
		if (event.equals("rq1nodes")) {
			
			String projectid = req.getParameter("projectId");
			LabelAnalyzer analyzer = new LabelAnalyzer(con);
			try {
				
				String resWriter = analyzer.getProjectLabels(projectid);
		        String jsonarray = "[" + resWriter.toString() + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			}
	    	  
		} else if (event.equals("rq1links")) {
			String projectid = req.getParameter("projectId");
			LabelAnalyzer analyzer = new LabelAnalyzer(con);
			try {
				
				String resWriter = analyzer.getLabelRelations(projectid);
		        String jsonarray = "[" + resWriter + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
				
		} else if (event.equals("rq1maxvalues")) {
				
				String projectid = req.getParameter("projectId");
				LabelAnalyzer analyzer = new LabelAnalyzer(con);
				try {
					
					String maxRelationNum = analyzer.getMaxLabelRelationCount(projectid);
					String maxIssueNum = analyzer.getMaxLabelIssueCount(projectid);
				    StringBuilder jsonarray = new StringBuilder("[");
			        jsonarray.append(maxRelationNum);
			        jsonarray.append(",");
			        jsonarray.append(maxIssueNum);
			        jsonarray.append("]");
					res.getWriter().write(jsonarray.toString());
					
				} catch (SQLException sqle) {
					sqle.printStackTrace();
				} catch (IOException ioe) {
					ioe.printStackTrace();
				} 
			
		} else if (event.equals("getprojects")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer(con);
			
			try {
				String searchpattern = req.getParameter("searchstring");
				String jsonStream = (searchpattern != null) ? analyzer
						.getProjectsMatchingSearchPattern(searchpattern)
						: analyzer.getInitialProjects();
				String jsonarray = "[" + jsonStream + "]";
 				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
			
		} else if (event.equals("getprojectlabels")) {
			
			String projectid = req.getParameter("projectid"); 
			
			try {
				
				LabelAnalyzer analyzer = new LabelAnalyzer(con);
				String jsonStream = analyzer.getAllLabels(projectid);
	      		String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
		
		} else if (event.equals("getrq2labels")) {
			
			String projectid = req.getParameter("projectid"); 
			
			try {
				
				LabelAnalyzer analyzer = new LabelAnalyzer(con);
				String jsonStream = analyzer.getRQ2Labels(projectid);
	      		String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
		
		} else if (event.equals("getrq3labels")) { 
			
			String projectid = req.getParameter("projectid"); 
			
			try {
				
				LabelAnalyzer analyzer = new LabelAnalyzer(con);
				String jsonStream = analyzer.getRQ3Labels(projectid);
	      		String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
		
		} else if (event.equals("getprojectid")) {

			//the received param has the form projectOwner/projectname
			String param = req.getParameter("project");
			
			//parse project information
			String[] project = param.split("/");
			String projectOwner = project[0];
			String projectName = project[1];
			try {
				
				LabelAnalyzer analyzer = new LabelAnalyzer(con);
				String jsonStream = analyzer.getProjectId(projectName, projectOwner);
		        String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
		
		} else if (event.equals("rq2label")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer(con);
			String labelId = req.getParameter("labelId");
			try {
				
				String jsonStream = analyzer.getLabelById(labelId);
		        String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
			
		} else if  (event.equals("rq2contributors")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer(con);
			String labelId = req.getParameter("labelId");
			String projectId = req.getParameter("projectId");
			try {
				
				String jsonStream = analyzer.getLabelContributors(projectId, labelId);
		        String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
		
		} else if  (event.equals("rq2links")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer(con);
			String labelId = req.getParameter("labelId");
			try {
				
				String jsonStream = analyzer.getLabelComments(labelId);
			    String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
			
		} else if  (event.equals("rq2maxvalues")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer(con);
			String projectId = req.getParameter("projectId");
			try {
				
				String jsonStream = analyzer.getRQ2MaxValues(projectId);
		        String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
		
		} else if (event.equals("rq3data")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer(con);
			String labelId = req.getParameter("labelId");
			
			try {
				
				String jsonStream = analyzer.getLabelResolutionInfo(labelId);
		        String jsonarray = "[" + jsonStream + "]";
				res.getWriter().write(jsonarray);
				
			} catch (SQLException sqle) {
				sqle.printStackTrace();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			} 
		}
	}
	
}
