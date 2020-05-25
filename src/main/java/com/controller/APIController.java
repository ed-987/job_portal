package com.controller;

import java.util.List;

import javax.servlet.ServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.Repository.JobRepository;
import com.Repository.UserRepository;
import com.Service.Auth;
import com.component.InitSessions;
import com.google.gson.Gson;
import com.model.Job;
import com.model.LoginSession;
import com.model.User;


@Controller
public class APIController {

	@Autowired
	JobRepository jobRepository;
	
	@Autowired
	InitSessions initSessions;
	
	@Autowired
	UserRepository userRepository;
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@GetMapping(value= {"/list_all"})
	@ResponseBody
	public String list_all() {	
		List<Job> joblist=jobRepository.getJobs();
		String json = new Gson().toJson(joblist);
		return json.toString();
	}
	
	@GetMapping(value= {"/search"})
	@ResponseBody
	public String search(ServletRequest request) {	
		String q=request.getParameter("q");
		List<Job> joblist=jobRepository.searchJobs(q);
		String json = new Gson().toJson(joblist);
		//logger.debug(joblist.toString());
		return json.toString();
	}
	
	@PostMapping(value= {"/login"})
	@ResponseBody
	public String login(ServletRequest request) {
		String u=request.getParameter("u");
		String p=request.getParameter("p");
		boolean err=false;
		String ret;
		User user = null;
		try {
		  user = userRepository.findUser(u);
		}catch (Exception e) {
		  err=true;
			// TODO: handle exception
		}
		if(err) {
			ret="user not found";
		}else {
			String p2=user.getP();
			if(p.equals(p2)) {
				ret="password ok";
				String token = Auth.generateNewToken();
				token="$"+user.getAdmin()+token;
				LoginSession loginSession =new LoginSession(user.getId(),token);
				initSessions.addSession(loginSession);
				ret=token;
			}
			else {
				ret="password incorrect";
			}
		}
		  //logger.debug(user.toString());
		return ret;
	}
	

}
