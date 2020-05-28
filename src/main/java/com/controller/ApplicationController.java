package com.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.Repository.ApplicationRepository;
import com.google.gson.Gson;
import com.model.Application;

@Controller
public class ApplicationController {
	
	@Autowired
	ApplicationRepository applicationRepository;

	@Value("${upload.path}")
	private String uploadPath;
	
	private final Logger logger = LoggerFactory.getLogger(getClass()); 
	 
	@PostMapping(value= {"/upload"})
	@ResponseBody
	public int upload(
			@RequestParam("file") MultipartFile file, 
			@RequestParam("fname") String fname,
			@RequestParam("lname") String lname, 
			@RequestParam("job_id") int job_id) 
					throws IllegalStateException, IOException {
	
		 File transferFile = new File(uploadPath + file.getOriginalFilename()); 
		 file.transferTo(transferFile);
		 int save=applicationRepository.saveNoReg(new Application(fname,lname,job_id,file.getOriginalFilename()));
		 return save;
	}
	
	@PostMapping(value= {"/get_apps"})
	@ResponseBody
	public String get_apps(
			@RequestParam("token") String token)
					throws IllegalStateException, IOException {
			
		List<Application> applist=applicationRepository.getApps();
		String json = new Gson().toJson(applist);
		return json.toString();
	}
	
	@PostMapping(value= {"/delete_app"})
	@ResponseBody
	public int delete_app(
			@RequestParam("token") String token, @RequestParam("id") int id)
					throws IllegalStateException, IOException {
		
		return applicationRepository.deleteApp(id);
	}
	
}
