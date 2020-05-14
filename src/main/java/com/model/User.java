package com.model;

public class User {
	private int id;
	private String name;
	private String p;
	private String admin;
	
	public User() {
	}
	
	public User(int id, String name, String p, String admin) {
		super();
		this.id = id;
		this.name = name;
		this.p = p;
		this.admin = admin;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getP() {
		return p;
	}
	public void setP(String p) {
		this.p = p;
	}
	public String getAdmin() {
		return admin;
	}

	public void setAdmin(String admin) {
		this.admin = admin;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", p=" + p + "]";
	}
	

}
