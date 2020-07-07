/**
 * 获取分类列表
 */
import RNFetchBlob from 'react-native-fetch-blob'
import md5 from "react-native-md5";
import config from '../config'

const addr = config.SERVER_URL;
export function getCategories(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/categories.json'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function getCategory(cate_id){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/c/'+cate_id+'/show.json'
	   	//console.log("path = " +path)
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}

/**
 * 获取最新主题
 */
export function getTopics(params){

	return new Promise(function(resolve, reject) {
	   	let path = addr + params
	   	console.log("path = "+ path)
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
/**
 * 获取最新主题
 */
export function getTopicDetail(params){
	return new Promise(function(resolve, reject) {
	   	let path = addr + params
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
/**
 * 登录
 */

export function getCsrf(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/session/csrf.json'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});
}
export function session(csrf, username, password){
	return new Promise(function(resolve, reject) {
		//console.log("csrf = " + csrf)
	   	let path = addr + '/session'
	    let xhr = new XMLHttpRequest();
	    xhr.open('POST',path );
	    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	    xhr.setRequestHeader("x-csrf-token", csrf);
	    xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	    let data = "login="+username+"&password="+password;
	    xhr.onload = function() {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send(data);

	});

	/*return new Promise(function(resolve, reject) {
	   	let path = addr + '/session/csrf.json'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.responseText));
	      } 
	    };
	    xhr.onerror = function() {
	      reject(new Error(xhr.statusText));
	    };
	    xhr.send();
	});*/
}

/**
 * 
 *
 */
export function getSignupParams(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/u/hp.json';
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
 		xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}
/**
 * 注册账户
 *
 */
export function signup(data, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/u';		
	    let xhr = new XMLHttpRequest();
	    xhr.open('POST',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	    xhr.setRequestHeader("x-csrf-token", csrf);
	    xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest')
	    data.timezone = "Asia/Shanghai";
	   	var params = Object.keys(data)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
	    .join('&');
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    console.log(params)
	    xhr.send(params);

	});
}
/**
 *
 * 草稿
 */

export function draft(draft_key){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/draft.json?draft_key=' + draft_key;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(xhr.responseText);
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}
export function getDraft(username, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/drafts.json?offset=0&username='+username;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	    xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}


/**
 * 发布帖子、回复
 */
export function postTopic(data, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/posts';
	    let xhr = new XMLHttpRequest();
	    xhr.open('POST',path );
	    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	    xhr.setRequestHeader("x-csrf-token", csrf);
	    xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	    
	    data.unlist_topic = false;
	    data.is_warning = false;
	    data.archetype = 'regular';
	    data.typing_duration_msecs = 1700;
	    data.composer_open_duration_msecs = 5745;
	    data.shared_draft = false;
	    data.nested_post = true;

		var params = Object.keys(data)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
	    .join('&');
	    console.log(params)
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	        resolve(JSON.parse(xhr.responseText));
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      reject(new Error(JSON.parse(xhr.statusText)));
	    };
	    xhr.send(params);

	});
}

/**
 * 修改帖子
 */
export function postEdit(data, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/posts/'+data.post_id;
	    let xhr = new XMLHttpRequest();
	    xhr.open('PUT',path );
	    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	    xhr.setRequestHeader("x-csrf-token", csrf);
	    xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	    /*post[topic_id]: 83
		post[raw]: reply test22222222222222222s's'd's'd'f2222222
		post[raw_old]: reply test222222222222222222222222
		post[edit_reason]: 
		post[cooked]: <p>reply test22222222222222222s’s’d’s’d’f2222222</p>
	   
*/		

		let data1 = {}
		data1["post[topic_id]"]  = data.topic_id;
		data1["post[raw]"]  = data.raw;
		//data1["post[raw_old]"]  = data.raw_old;
		//data1["post[cooked]"]  = data.cooked;
		console.log("data1 = ")
		console.log(data1)
		var params = Object.keys(data1)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data1[k]))
	    .join('&');
	    console.log("params = ")
			
	    console.log(params)
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	        resolve(JSON.parse(xhr.responseText));
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      reject(new Error(JSON.parse(xhr.statusText)));
	    };
	    xhr.send(params);

	});
}
export function postDelete(context, post_id, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/posts/'+post_id;
	   	let data = {
	   		context:context
	   	}
	    let xhr = new XMLHttpRequest();
	    xhr.open('DELETE',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	var params = Object.keys(data)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
	    .join('&');
	    console.log(params)
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(xhr.responseText);
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send(params);

	});
}

export function topicDelete(context, topic_id, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/t/'+topic_id;
	   	let data = {
	   		context:context
	   	}
	    let xhr = new XMLHttpRequest();
	    xhr.open('DELETE',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	var params = Object.keys(data)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
	    .join('&');
	    console.log(params)
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(xhr.responseText);
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send(params);

	});
}

export function postAction(data, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/post_actions';
	   	/*id: 94
		post_action_type_id: 2
		flag_topic: false*/
	    let xhr = new XMLHttpRequest();
	    xhr.open('POST',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	var params = Object.keys(data)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
	    .join('&');
	    console.log(params)
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send(params);

	});
}
export function postActionUnlike(post_id, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/post_actions/' + post_id;
	   	let data = {"post_action_type_id":2}
	    let xhr = new XMLHttpRequest();
	    xhr.open('DELETE',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	var params = Object.keys(data)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
	    .join('&');
	    console.log(params)
	    xhr.onload = function() {
	    	console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send(params);

	});
}
export function uploadFile(type, uri, csrf){
	return new Promise(function(resolve, reject) {
		let client_id = md5.hex_md5( Date.now() +"client_id" );
		let boundary = md5.hex_md5( Date.now() +"boundary" );
		let body = [{
	        name:'type', data:type,
	    },{
	    	name:'file',
        	filename: Date.now()+"_img",
        	data: RNFetchBlob.wrap(uri)
	        
	    }];
		 RNFetchBlob
	        .fetch('POST',addr + '/uploads.json?client_id=' + client_id,{
	            // 上传图片要设置Header
	            'Content-Type' : 'multipart/form-data; boundary=----WebKitFormBoundary'+boundary,
				'x-csrf-token':csrf,
			    'x-requested-with':'XMLHttpRequest'
	        },body)
	        .uploadProgress((written, total) => {
	            // 本地查找进度
	        })
	        .progress((received, total) => {
	            let perent = received / total;
	             // 上传进度打印
	            console.log(perent);
	        })
	        .then((response)=> response.json())
	        .then((response)=> {
	            // 上传信息返回
	            console.log("success")
	            console.log(response);
	            console.log(typeof response)
	            resolve(response);
	        })
	        .catch((error)=>{
	            // 错误信息
	            console.log("error")
	            console.log(error);
	             reject(new Error(JSON.parse(error)));
	        });

	});
}

export function getUsers(username){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/u/'+username+'.json';
	   	console.log("path = " + path)
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   //	xhr.setRequestHeader("x-csrf-token", csrf);
	   //	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	
	    xhr.onload = function() {
	    	//console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}
export function getUsersList(period, order, page, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/directory_items.json?page='+page+'&period='+period+'&order='+order;
	   	console.log("path = " + path)
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	
	    xhr.onload = function() {
	    
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}
export function getSummary(username, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/u/'+username+'/summary.json';
	   	console.log("path = " + path)
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	
	    xhr.onload = function() {
	    	//console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}

export function getUserAction(data, csrf){
	return new Promise(function(resolve, reject) {
		var params = Object.keys(data)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
	    .join('&');
	   	let path = addr + '/user_actions.json?'+params;
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	
	    xhr.onload = function() {
	    	//console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}

export function getBadges(username, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/user-badges/'+username+'.json?grouped=true'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	   	
	    xhr.onload = function() {
	    	//console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}
export function getAllBadges(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/badges.json'
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	    xhr.onload = function() {
	    	//console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}

export function search(data, csrf){
	return new Promise(function(resolve, reject) {
		var params = Object.keys(data)
	    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
	    .join('&');
	   	let path = addr + '/search.json?'+params;
	   	console.log(path)
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	    xhr.onload = function() {
	    	//console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}

export function getAbout( csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/about.json';
	   	console.log(path)
	    let xhr = new XMLHttpRequest();
	    xhr.open('GET',path );
	   	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	   	xhr.setRequestHeader("x-csrf-token", csrf);
	   	xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	    xhr.onload = function() {
	    	//console.log(xhr.responseText)
	      	//console.log(xhr)
	        resolve(JSON.parse(xhr.responseText));
	      
	    };
	    xhr.onerror = function() {
	    	console.log("error")
	      	reject(new Error(xhr.statusText));
	    };
	    xhr.send();

	});
}