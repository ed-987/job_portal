package com.controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class FileController {
	
	@Value("${upload.path}")
	private String uploadPath;
	
	private final Logger logger = LoggerFactory.getLogger(getClass()); 

	@PostMapping(
			  value = "/get-file",
			  produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
			)
			public @ResponseBody byte[] getFile(HttpServletResponse response, ServletRequest request) throws IOException {
				
				//	@RequestParam("file") String file,
				String file=request.getParameter("file");
				logger.debug("file= {}",file);
				InputStream in = new FileInputStream(uploadPath+file);
				response.setHeader("Content-Disposition", "attachment; filename=\"" + file + "\"");
			    return IOUtils.toByteArray(in);
			}
}
