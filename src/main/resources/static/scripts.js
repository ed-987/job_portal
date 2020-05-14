var heroku=true;

var url;
if(heroku){
  url="https://job-portal-app-demo.herokuapp.com/";
} else{
  url="http://localhost:8080/";
}

function open_box(job){
  if(document.getElementById("menu").style.display === "block"){
    document.getElementById("menu").style.display="none";
  }else{
    if(document.getElementById("open_box").style.display === "block"){
      document.getElementById("open_box").style.display = "none";
      opened_box="";
    }else{
      document.getElementById("open_box").style.display = "block";
      var text='Id: '+job.id+'<br>'+'name: '+job.name+'<br>'+'Descr: '+job.description;
      text+='<span class="close_box">X</span>';
      document.getElementById("open_box").innerHTML=text;
      opened_box=String(job.id);
    }
  }
}

function get_jobs(type){
  var xhr = new XMLHttpRequest();
  switch(type){
    case "search":
      var input=get_input("search_input");
      var uri=url+"search?q="+input;
      break;
    case "all":
      var uri=url+"list_all";
  }
  xhr.open("GET", uri, true);
  xhr.onload = function (e) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var obj=JSON.parse(xhr.responseText);
        var div='';
        if(obj.length===0){
          div='no results found';
        }
        for(job of obj){
          div+='<div  id="box'+String(job.id)+'" class="box" >';
          div+='Id: '+job.id+'<br>';
          div+='Job: '+job.name+'<br>';
          div+='Description: '+job.description+'<br>';
          div+='</div>';
        }
        set_id("main_container",div);
        hide_main();
        document.getElementById("main_container").style.display = "flex";
        for(job of obj){
          try{throw job}
          catch(job2){
            document.getElementById("box"+String(job2.id)).addEventListener("click", function(e) {
             open_box(job2);
            });
          }
        }
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null); 
}

function login(){
  var xhr = new XMLHttpRequest();
  var uri=url+"login";
  xhr.open("POST", uri, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function (e) {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var r=xhr.responseText;
      if (r.charAt(0)==="$"){
        localStorage.setItem("token", r);
        localStorage.setItem("user", get_input("login_input"));
        hide("login_link","login");
        block("home");
        clear_input("login_input","password_input");
        set_id("login_error","");
        logged_in_items();
        if(r.charAt(1)==="1"){
          localStorage.setItem("admin", 1);
          admin_items();
        }
      }
      else{
        set_id("login_error",r);
      }
  }
  };
  var u=get_input("login_input");
  var p=get_input("password_input");
  var send_value="u="+u+"&p="+p;
  xhr.send(send_value); 
}

function logged_in_items(){
  inline_block("user");
  var t=localStorage.getItem("user")+'<span id="logout_hover">logout</span>';
  set_id("user",t);
  on_click("logout_hover",logout);
}

function admin_items(){
  inline_block("add_job_button");
}
function post_job(){
  var xhr = new XMLHttpRequest();
  var uri=url+"add";
  xhr.open("POST", uri, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function (e) {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var r=xhr.responseText;
      switch(r){
        case "0":
          set_id("add_job_result","database error");
          break;
        case "1":
          clear_input("add_job_name","add_job_description");
          set_id("add_job_result","job added");
          break;
        case "2":
          set_id("add_job_result","please login");
          break;
        case "3":
          set_id("add_job_result","please login as admin");
      }
    }
  };
  var name=get_input("add_job_name");
  var description=get_input("add_job_description");
  var token=localStorage.getItem("token");
  var send_value="token="+token+"&name="+name+"&description="+description;
  xhr.send(send_value); 
}

function hide_main(){
  hide("main_container","home","login","add_job");
  set_id("add_job_result","");
}

function logout(){
  localStorage.clear();
  hide("user");
  inline_block("login_link");
  hide("main_container","home","login","add_job","add_job_button");
  block("home");
  set_id("add_job_result","");
}

function add_job(){
  hide_main();
  clear_input("add_job_name","add_job_description");
  block("add_job");
}

function hide(){
  for(var i=0;i<arguments.length;i++){
    document.getElementById(arguments[i]).style.display = "none";
  }
}
function block(){
  for(var i=0;i<arguments.length;i++){
    document.getElementById(arguments[i]).style.display = "block";
  }
}
function inline_block(){
  for(var i=0;i<arguments.length;i++){
    document.getElementById(arguments[i]).style.display = "inline-block";
  }
}
function is_hide(e){
  return document.getElementById(e).style.display==="none";
}
function is_block(e){
  return document.getElementById(e).style.display==="block";
}
function set_id(e,v){
  document.getElementById(e).innerHTML=v;
}
function clear_input(){
  for(var i=0;i<arguments.length;i++){
    document.getElementById(arguments[i]).value="";
  }
}
function get_input(e){
  return document.getElementById(e).value;
}
function on_click(b,f){
  document.getElementById(b).addEventListener("click", f);
}

var opened_box="";

document.getElementById("menu_button").addEventListener("click", function() {
  if(is_block("menu")){
    hide("menu");
  }else
  {
    block("menu");
  }
});

document.body.addEventListener("click", function(e) {
  if((document.getElementById("menu").style.display === "block") && (e.target.id !== "menu") && 
  (e.target.id !== "menu_button")){
    document.getElementById("menu").style.display = "none";
  }
  else if((document.getElementById("open_box").style.display === "block") && 
  (e.target.id !=="open_box") && (e.target.id !=="menu_button") &&
  (document.getElementById("menu").style.display !== "block") &&
  (e.target.id !== "box"+opened_box)){
    document.getElementById("open_box").style.display = "none";
  }
});

document.getElementById("all_jobs").addEventListener("click", function() {
  get_jobs("all");
});

document.getElementById("home_button").addEventListener("click", function() {
  hide_main();
  document.getElementById("home").style.display = "block";
});

document.getElementById("search_button").addEventListener("click", function() {
  get_jobs("search");
});

document.getElementById("search_input").addEventListener("keypress", function(e) {
  if(e.code==="Enter"){
    get_jobs("search");
  }
});

document.getElementById("login_link").addEventListener("click", function(e) {
  hide_main();
  document.getElementById("login").style.display = "block";
});

document.getElementById("login_input").addEventListener("keypress", function(e) {
  if(e.code==="Enter" || e.code==="NumpadEnter"){
    login();
  }
});

document.getElementById("password_input").addEventListener("keypress", function(e) {
  if(e.code==="Enter" || e.code==="NumpadEnter"){
    login();
  }
});

if(localStorage.getItem("user")){
  logged_in_items();
}
else{
  inline_block("login_link");
}
if(localStorage.getItem("admin")){
  admin_items();
}

on_click("login_button",login);
on_click("logout",logout);
on_click("add_job_button", add_job);
on_click("add_job_submit",post_job);