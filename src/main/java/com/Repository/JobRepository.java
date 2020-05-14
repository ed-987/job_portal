package com.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.model.Job;
import com.model.Product;
import com.repository.ShopRepositoty;

@Repository
public class JobRepository{
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	private final RowMapper<Job> mapper = new RowMapper<Job>() {
		
		@Override
		public Job mapRow(ResultSet rs, int rowNum) throws SQLException{
		    Job n = new Job();
			n.setId(rs.getInt("id"));
			n.setName(rs.getString("name"));
			n.setDescription(rs.getString("description"));
			return n;
		}
	};

	public List<Job> getJobs() {
		final String sql = "SELECT id,name,description FROM jobs";
		return jdbcTemplate.query(sql,mapper);
	}

	public List<Job> searchJobs(String search) {
		final String sql = "SELECT id,name,description FROM jobs WHERE LOWER (name) LIKE ? ";
				//+ "OR LOWER (description) LIKE ?";
		search=("%"+search+"%").toLowerCase();
		//return jdbcTemplate.query(sql,mapper,search,search);
		return jdbcTemplate.query(sql,mapper,search);
	}

	public Job getJobDetails(int id) {
		final String sql = "SELECT id,name,description FROM jobs WHERE id=?";
		return jdbcTemplate.queryForObject(sql, new Object[]{id}, (rs, rowNum) ->
        new Job(
                rs.getInt("id"),
                rs.getString("name"),
                rs.getString("description")            
        ));
	}

	public int Add(String name, String description) {
		final String sql = "INSERT INTO jobs (name,description) VALUES (?,?);";
		return jdbcTemplate.update(sql,name,description);
	}


	/*
	 * public List<Product> getProductsByPrice(String search) { final String sql =
	 * "SELECT id,name,brand,description,price FROM products WHERE LOWER (name) LIKE ? "
	 * + "OR LOWER (brand) LIKE ? ORDER BY price";
	 * search=("%"+search+"%").toLowerCase(); return
	 * jdbcTemplate.query(sql,mapper,search,search); }
	 * 
	 * public List<Product> getProductsByBrand(String search) { final String sql =
	 * "SELECT id,name,brand,description,price FROM products WHERE LOWER (name) LIKE ? "
	 * + "OR LOWER (brand) LIKE ? ORDER BY brand";
	 * search=("%"+search+"%").toLowerCase(); return
	 * jdbcTemplate.query(sql,mapper,search,search); }
	 */

}
