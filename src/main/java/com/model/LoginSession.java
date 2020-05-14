package com.model;

public class LoginSession {

	private int user_id;
	private String token;
	
	public LoginSession() {
	}
	
	public LoginSession(int user_id, String token) {
		super();
		this.user_id = user_id;
		this.token = token;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	
	
	
	
}
