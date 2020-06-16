import {NativeModules} from 'react-native';
import CookieManager from "react-native-cookies";
import  config from '../config'
import { session, getCsrf } from "../request/discourse_api";
var csrf = null;
var _self = this;
export function _isLogin(){
	return CookieManager.get(config.SERVER_URL)
	.then((res) => {
		//console.log('CookieManager.get =>', res); // => 'user_session=abcdefg; path=/;'
		if(res._forum_session && res._t ){
			return true;
		}else{
			return false;
		}
	});
}
export async function _login(username, password){
	try{
		const csrf = await getCsrf();
		const data = await session(csrf.csrf, username, password);
		console.log(data)
		if(data.user){
			NativeModules.DBManagerModule.setUser(data.user.username, data.user.name, data.user.avatar_template,csrf.csrf, (rs)=>{
				console.log(rs)
			});
			return {"status":"success","data":data};
		}else{
			console.log("asdfasdfasdfasd")
			return {"status":"failed","data":data};
		}
		
	}catch(e){
		console.log(e)
	}
}
export function _logout(){
	return CookieManager.clearAll()
	  .then((res) => {
	    //console.log('CookieManager.clearByName =>', res);
	  });
}

export function _getUsers(){
	return new Promise(function(resolve, reject) {
		try{
			NativeModules.DBManagerModule.getUser((users)=>{
				resolve(users);
			})
		}catch(e){
			reject(e);
		}
	   	

	});
	
}