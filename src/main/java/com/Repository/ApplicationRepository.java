package com.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.model.Application;
import com.model.Job;

@Repository
public class ApplicationRepository {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	private final Logger logger = LoggerFactory.getLogger(getClass()); 
	
	private final RowMapper<Application> mapper = new RowMapper<Application>() {
		
		@Override
		public Application mapRow(ResultSet rs, int rowNum) throws SQLException{
		    Application n = new Application();
			n.setId(rs.getInt("applications.id"));
			n.setFname(rs.getString("applications.fname"));
			n.setLname(rs.getString("applications.lname"));
			n.setJob_name(rs.getString("jobs.name"));
			n.setJob_id(rs.getInt("applications.job_id"));
			n.setFile_name(rs.getString("applications.file_name"));
			return n;
		}
	};

	public int saveNoReg(Application a) {
		final String sql = "INSERT INTO applications (fname,lname,job_id,user_id,file_name) VALUES (?,?,?,?,?);";
		return jdbcTemplate.update(sql,a.getFname(),a.getLname(),a.getJob_id(),a.getUser_id(),a.getFile_name());	
	}

	public List<Application> getApps() {
		final String sql = "SELECT applications.id,applications.fname,applications.lname,applications.job_id,applications.file_name,jobs.name FROM applications INNER JOIN jobs ON applications.job_id=jobs.id;";

		List<Application> ret=new ArrayList<Application>();
		
		try {
			ret=jdbcTemplate.query(sql,mapper);
		} catch (DataAccessException e) {
			logger.debug("HERE ****** jdbc error : " + e);
			e.printStackTrace();
		}
		return ret;
	}

}
