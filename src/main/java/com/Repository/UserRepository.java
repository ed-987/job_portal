package com.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.model.User;

@Repository
public class UserRepository {

	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	private final RowMapper<User> mapper = new RowMapper<User>() {
		
		@Override
		public User mapRow(ResultSet rs, int rowNum) throws SQLException{
		    User n = new User();
			n.setId(rs.getInt("id"));
			n.setName(rs.getString("name"));
			n.setP(rs.getString("description"));
			return n;
		}
	};
	
	public User findUser(String name) throws SQLException{
		name=name.toLowerCase();
		final String sql = "SELECT id,name,p,admin FROM users WHERE name=?";
		try {
		return jdbcTemplate.queryForObject(sql, new Object[]{name}, (rs, rowNum) ->
        new User(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("p"),
                rs.getString("admin")
        ));
		}
		catch (Exception e) {
			throw e;
			// TODO: handle exception
		}
	}

}
