package com.controller;

import javax.servlet.ServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.Repository.JobRepository;
import com.component.InitSessions;
import com.model.LoginSession;


@Controller
public class AddController {
	
	@Autowired
	InitSessions initSessions;
	
	@Autowired
	JobRepository jobRepository;
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@PostMapping(value= {"/add"})
	@ResponseBody
	public int addAPI(ServletRequest request) {
		String token=request.getParameter("token");
		String name=request.getParameter("name");
		String description=request.getParameter("description");
		//logger.debug(token);
		int check;
		if(token.charAt(1) =='1') {
		  check=2;
		  for(LoginSession o : initSessions.getSessions()) {
		    if(token.equals(o.getToken())) {
			  check=jobRepository.Add(name,description);
			  break;
		    }
		  }
		} else {
	      check=3;
	    }
        return check;
	}
}
