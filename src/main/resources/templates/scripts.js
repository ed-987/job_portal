var server="h";

var url;
switch(server){
  case "h":
    url="https://job-portal-app-demo.herokuapp.com/";
    break;
  case "w":
    url="http://80.99.219.38:8082/";
    break;
  case "l":
    url="http://localhost:8082/";
}

function open_box(job){
  if(is_block("menu")){
    document.getElementById("menu").style.display="none";
  }else{
    if(is_block("open_box")){
      hide("open_box");
      opened_box="";
    }else{
      block("open_box");
      var text='Id: '+job.id+'<br>'+'name: '+job.name+'<br>'+'Descr: '+job.description;
      text+='<span id="close_box" class="close_box">X</span>';
      text+='<div id="apply_form"></div>'
      text+='<div id="apply"><button id="apply_button">apply</button></div>';
      text+='<div id="job_id_div" job_id="'+job.id+'"></div>';
      set_id("open_box",text);
      on_click("apply_button",apply);
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
  inline_block("user","logout");
  var t=localStorage.getItem("user")+'<span id="logout_hover">logout</span>';
  set_id("user",t);
  on_click("logout_hover",logout);
}

function admin_items(){
  inline_block("add_job_button","add_job_button_m","see_apps_button");
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

function apply(){
  if(localStorage.getItem("user")){
    set_id("apply",get_id("open_box_buttons_store1"));
  }else{
    set_id("apply",get_id("open_box_buttons_store2"));
    on_click("no_reg_button",function() {set_id("apply_form",get_id("open_box_apply_no_reg_store"));});
  }
}

function upload_cv_no_reg() {
  //event.stopPropagation();
  event.preventDefault();
  var fileInput = document.getElementById('apply_cv');
  var file = fileInput.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fname',get_input("apply_fname"));
  formData.append('lname',get_input("apply_lname"));
  var job_id=parseInt(document.getElementById("job_id_div").getAttribute("job_id"));
  formData.append('job_id',job_id);
  sendData(formData);
};

function sendData(formData) {
  const uri = url+"upload";
  const xhr = new XMLHttpRequest();
  
  xhr.open("POST", uri, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          var r=xhr.responseText;
          switch(r){
            case "0":
              set_id("no_reg_apply_result","database error");
              break;
            case "1":
              clear_input("apply_fname","apply_lname","apply_cv");
              set_id("no_reg_apply_result","application submitted");
          }
      }
  };
  xhr.send(formData);
}

function download(file){
  const uri = url+"get-file";
  const xhr = new XMLHttpRequest();
  
  xhr.open("POST", uri, true);
  xhr.responseType="arraybuffer";
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          var blob=new Blob([xhr.response]);
          var link=document.createElement('a');
          link.href=window.URL.createObjectURL(blob);
          link.download=file;
          link.click();
      }
  };
  var send_value="file="+file;
  xhr.send(send_value);
}

function hide_main(){
  hide("main_container","home","login","add_job","applications");
  set_id("add_job_result","");
}

function logout(){
  localStorage.clear();
  hide("user");
  inline_block("login_link");
  hide("main_container","home","login","add_job","add_job_button","add_job_button_m","see_apps_button","applications");
  block("home");
  set_id("add_job_result","");
}

function add_job(){
  hide_main();
  clear_input("add_job_name","add_job_description");
  block("add_job");
}

function see_applications(){
  hide_main();
  block("applications");

  var xhr = new XMLHttpRequest();
  var uri=url+"get_apps";
  xhr.open("POST", uri, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function (e) {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var obj=JSON.parse(xhr.responseText);
      var div='<table id="apps_table">';
      div+='<tr>';
      div+='<th>#</th>';
      div+='<th>Applicant Name (id)</th>';
      div+='<th>Job Title (id)</th>';
      div+='<th>CV</th>';
      div+='<th></th>';
      div+='</tr>';
      var user_id;
      var cv;
      for(app of obj){
        if(app.user_id===0){
          user_id="n/a";
        }else{
          user_id=app.user_id.toString();
        }
        if(typeof app.file_name==="undefined"){
          cv="n/a";
        }else{
          cv=app.file_name;
        }
        div+="<tr>";
        div+='<td>'+app.id+'</td>';
        div+='<td>'+app.fname+' '+app.lname+' ('+user_id+')</td>';
        div+='<td>'+app.job_name+' ('+app.job_id+')</td>';
        div+='<td class="no_wrap">'+cv+' <img src="download2.png" class="table_icon" id="download_icon" onclick="download(\''+cv+'\');"></td>';
        div+='<td id="delete_col"><img src="delete.png" class="table_icon" onclick="delete_app(\''+app.id+'\');"</td>';
        //div+='<td onclick="delete_app(\''+app.id+'\');">DELETE <span class=\"del_conf\" id=\"del_conf'+app.id+'\"><span class=\"Y_N\" onclick=\"delete_app_do('+app.id+');\"> Y </span> /<span class=\"Y_N\" onclick=\"delete_app_canx('+app.id+');\"> N </span></span></td>';
        div+="</tr>";
      }
      set_id("applications",div);
      block("applications");
    }
  };
  var token=localStorage.getItem("token");
  var send_value="token="+token;
  xhr.send(send_value); 
}

function delete_app(id){
  $.confirm({
    useBootstrap: false,
    title: 'Are you sure you want to delete the application?',
    content: null,
    buttons: {
        "YES, Delete": {
          btnClass: 'btn-blue',
          action: function () {
            delete_app_do(id);
          }
        },
        NO: function () {
        }
    }
  });
}

/* function delete_app_canx(id){
  event.stopPropagation();
  document.getElementById("del_conf"+id).style.visibility="hidden";
} */

function delete_app_do(id){
  event.stopPropagation();
  var xhr = new XMLHttpRequest();
  var uri=url+"delete_app";
  xhr.open("POST", uri, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function (e) {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      if(xhr.responseText==='1'){
        see_applications();
      }else{
        alert("error");
      }
      
    }
  };
  var token=localStorage.getItem("token");
  var send_value="token="+token+"&id="+id;
  xhr.send(send_value);   
}

function hide(){
  for(var i=0;i<arguments.length;i++){
    document.getElementById(arguments[i]).style.display = "none";
    if(arguments[i]==="menu"){
      document.getElementById("menu_button").style.backgroundColor="#b8b888";  
    }
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
function get_id(e){
  return document.getElementById(e).innerHTML;
}
function clear_input(){
  for(var i=0;i<arguments.length;i++){
    document.getElementById(arguments[i]).value="";
  }
}
function is_target(){
  var ret=false;
  var p=arguments[0];
  var e=document.getElementById(p);
  if(e===null){
    ret=true;
  }else{
    for(var i=1;i<arguments.length;i++){
      if(document.getElementById(arguments[i]).contains(e) && (p !== "close_box")){
        ret=true;
        break;
      }
    }
  }
  return ret;
}
function get_input(e){
  return document.getElementById(e).value;
}
function on_click(b,f){
  document.getElementById(b).addEventListener("click", f);
}
function on_enter(e,f){
  document.getElementById(e).addEventListener("keypress", function(e) {
    if(e.code==="Enter" || e.code==="NumpadEnter"){
      f();
    }
  });
}

var opened_box="";

document.getElementById("menu_button").addEventListener("click", function() {
  if(is_block("menu")){
    hide("menu");
  }else
  {
    block("menu");
    document.getElementById("menu_button").style.backgroundColor="teal";  
  }
});

document.body.addEventListener("click", function(e) {
  if((document.getElementById("menu").style.display === "block") && (e.target.id !== "menu") && 
  (e.target.id !== "menu_button")){
    hide("menu");
  }
  else if(is_block("open_box") && (document.getElementById("menu").style.display !== "block") &&
  !is_target(e.target.id,"open_box","menu_button","box"+opened_box))
  {
    hide("open_box");
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

on_enter("search_input",function() {get_jobs("search")});
on_enter("login_input",login);
on_enter("password_input",login);
on_enter("add_job_name",post_job);
on_enter("add_job_description",post_job);

on_click("all_jobs",function() {get_jobs("all")});
on_click("all_jobs_button",function() {get_jobs("all")});
on_click("search_button",function() {get_jobs("search")});
on_click("login_button",login);
on_click("logout",logout);
on_click("add_job_button", add_job);
on_click("add_job_button_m", add_job);
on_click("add_job_submit",post_job);
on_click("home_button",function() {hide_main();block("home");});
on_click("login_link",function() {hide_main();block("login");});
on_click("see_apps_button",see_applications);
