package com.model;

public class Application {	
	private int id;
	private String fname;
	private String lname;
	private int job_id;
	private int user_id;
	private String file_name;
	private String job_name;
	
	public Application() {
	}

	public Application(String fname, String lname, int job_id, String file_name) {
		super();
		this.fname = fname;
		this.lname = lname;
		this.job_id = job_id;
		this.file_name = file_name;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public int getJob_id() {
		return job_id;
	}

	public void setJob_id(int job_id) {
		this.job_id = job_id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public String getFile_name() {
		return file_name;
	}

	public void setFile_name(String file_name) {
		this.file_name = file_name;
	}

	public String getJob_name() {
		return job_name;
	}

	public void setJob_name(String job_name) {
		this.job_name = job_name;
	}
	
}
