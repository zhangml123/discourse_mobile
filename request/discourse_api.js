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
/**
 * 获取最新主题
 */
export function getTopics(params){
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
 * 草稿
 */

export function draft(){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/draft.json?draft_key=new_topic'
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
export function postTopic(title, raw, category, csrf){
	return new Promise(function(resolve, reject) {
	   	let path = addr + '/posts';
	    let xhr = new XMLHttpRequest();
	    xhr.open('POST',path );
	    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	    xhr.setRequestHeader("x-csrf-token", csrf);
	    xhr.setRequestHeader("x-requested-with", 'XMLHttpRequest');
	    let data = {
	    	raw: raw,
			title: title,
			unlist_topic: false,
			category: category,
			is_warning: false,
			archetype: 'regular',
			typing_duration_msecs: 1100,
			composer_open_duration_msecs: 5745,
			shared_draft: false,
			draft_key: 'new_topic',
			nested_post: true,
	    }
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