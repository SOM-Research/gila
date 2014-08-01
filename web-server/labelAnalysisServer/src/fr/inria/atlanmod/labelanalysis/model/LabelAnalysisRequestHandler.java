/**
 * 
 */
package fr.inria.atlanmod.labelanalysis.model;

import java.io.IOException;
import java.io.StringWriter;

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
	public void handleRequest(HttpServletRequest req, HttpServletResponse res) {
		
		String event = req.getParameter("event");
		
		if (event.equals("rq1nodes")) {
			
			String projectid = req.getParameter("projectId");
			LabelAnalyzer analyzer = new LabelAnalyzer();
			StringWriter resWriter = analyzer.getProjectLabels(projectid);
			
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
	      
			try {
		        String jsonarray = "[" + resWriter.toString() + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
	    	  
		} if (event.equals("rq1links")) {
			String projectid = req.getParameter("projectId");
			LabelAnalyzer analyzer = new LabelAnalyzer();
			StringWriter resWriter = analyzer.getLabelRelations(projectid);
			
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
	      
			try {
		        String jsonarray = "[" + resWriter.toString() + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
	    	  e.printStackTrace();
	      
			  } 
				
			} else if (event.equals("rq1maxvalues")) {
				
				String projectid = req.getParameter("projectId");
				LabelAnalyzer analyzer = new LabelAnalyzer();
				StringWriter maxRelationNumWriter = analyzer.getMaxLabelRelationCount(projectid);
				StringWriter maxIssueNumWriter = analyzer.getMaxLabelIssueCount(projectid);
				
				res.setContentType("text/x-json;charset=UTF-8");           
				res.setHeader("Cache-Control", "no-cache");
		      
				try {
			        StringBuilder jsonarray = new StringBuilder("[");
			        jsonarray.append(maxRelationNumWriter.toString());
			        jsonarray.append(",");
			        jsonarray.append(maxIssueNumWriter.toString());
			        jsonarray.append("]");
			        System.out.println(jsonarray);
					res.getWriter().write(jsonarray.toString());
					
				} catch (IOException e) {
		    	  e.printStackTrace();
				
				}
			
		} else if (event.equals("getprojects")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer();
			String jsonStream = analyzer.getAllProjects();
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
	      
			try {
		        String jsonarray = "[" + jsonStream + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		} else if (event.equals("getlabels")) {
			
			String projectid = req.getParameter("projectid"); 
			
			LabelAnalyzer analyzer = new LabelAnalyzer();
			String jsonStream = analyzer.getAllLabels(projectid);
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
	      
			try {
		        String jsonarray = "[" + jsonStream + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
		
		} else if (event.equals("rq2label")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer();
			String labelId = req.getParameter("labelId");
			String jsonStream = analyzer.getLabelById(labelId);
			
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
			
			try {
		        String jsonarray = "[" + jsonStream + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		} else if  (event.equals("rq2contributors")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer();
			String labelId = req.getParameter("labelId");
			String jsonStream = analyzer.getLabelContributors(labelId);
			
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
			
			try {
		        String jsonarray = "[" + jsonStream + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
		
		} else if  (event.equals("rq2links")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer();
			String labelId = req.getParameter("labelId");
			String jsonStream = analyzer.getLabelComments(labelId)
					;
			
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
			
			try {
		        String jsonarray = "[" + jsonStream + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		} else if  (event.equals("rq2maxvalues")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer();
			String labelId = req.getParameter("labelId");
			String jsonStream = analyzer.getRQ2MaxValues(labelId);
			
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
			
			try {
		        String jsonarray = "[" + jsonStream + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
		
		} else if (event.equals("rq3data")) {
			
			LabelAnalyzer analyzer = new LabelAnalyzer();
			String labelId = req.getParameter("labelId");
			String jsonStream = analyzer.getLabelResolutionInfo(labelId);
			
			res.setContentType("text/x-json;charset=UTF-8");           
			res.setHeader("Cache-Control", "no-cache");
			
			try {
		        String jsonarray = "[" + jsonStream + "]";
		        System.out.println(jsonarray);
				res.getWriter().write(jsonarray);
				
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
}
