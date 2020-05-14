package com.controller;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletRequest;

import org.json.simple.JSONArray;
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
import com.Service.Data;
import com.component.InitSessions;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.google.gson.Gson;
import com.model.Job;
import com.model.LoginSession;
import com.model.User;


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
