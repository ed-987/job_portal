package com.component;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import com.model.LoginSession;

@Component
public class InitSessions {
	
	List<LoginSession> loginSessions =new ArrayList<LoginSession>();
	
	public void addSession(LoginSession loginSession) {
		loginSessions.add(loginSession);
	}
	
	public List<LoginSession> getSessions(){
		return loginSessions;
	}
}
