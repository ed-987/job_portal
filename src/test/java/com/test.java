package com;

import com.Service.Auth;

public class test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		String token = Auth.generateNewToken();
		System.out.print(token);
	}

}
