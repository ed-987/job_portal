package com.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
		
		@GetMapping(value= {"/"})
		public String web() {
			return "JobPortal2";
		}
}


