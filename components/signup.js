/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, ScrollView} from 'react-native';
import { getSignupParams, signup, getCsrf } from "../request/discourse_api";
class Signup extends Component {
	constructor(props){
		super(props)
		this.state={
			password_confirmation:null,
			challenge:null,
			email:null,
			emailMsg:null,
			username:null,
			usernameMsg:null,
			name:"",
			nameMsg:null,
			password:null,
			passwordMsg:null,
			enableSubmit:false,
			errorMsg:null
		}
	}
	componentDidMount (){
		const {navigation } = this.props;
 		navigation.setOptions({
			title: "注册",
			headerStyle: {
	            height:45,
                

	        }
		});
		this.GetInfo();
		
	}
	GetInfo = async()=>{
		const params = await getSignupParams();
		let challenge = params.challenge;
		this.setState({
			password_confirmation:params.value,
			challenge:challenge.split('').reverse().join('')
		})		
	}
	submit = async ()=>{
		console.log("submit")
		let {email, username, name, password, password_confirmation, challenge, enableSubmit} = this.state;
		if(!enableSubmit) return false;
		console.log("cansubmit")
		this.setState({
			errorMsg:null
		})
		const csrf = await getCsrf();
		let params = {}
		params.email = email;
		params.username = username;
		params.name = name;
		params.password = password;
		params.password_confirmation = password_confirmation;
		params.challenge = challenge;
		const rs = await signup(params,csrf.csrf); 
		console.log("rs = ")
		console.log(rs)
		if(rs.success){
			const navigation = this.props.navigation;
			console.log("success")
			navigation.navigate('Active',{email:email})
			
		}else{
			this.setState({
				errorMsg: rs.message
			})
		}
	}
	inputEmail= (email)=>{
		console.log(email)
		this.setState({
			email:email
		})
		this.checkSubmit({email:email});
	}
	checkEmail = (email)=>{
		console.log(email)
		if(email == null || email == "") return false;
		if(email.length - email.indexOf(".") < 2 || email.indexOf("@") <= 0 ||  email.indexOf(".") - email.indexOf("@") < 2) {
			this.setState({
				emailMsg:{
					color:"#ff0000",
					msg:"请填写正确的邮箱地址"
				}
			})
			return false;
		}
		this.setState({
			emailMsg:{
				color:"#00ff00",
				msg:"邮箱地址可用"
			}
		})
		return true;
	}
	inputUName=(username)=>{
		console.log(username)
		this.setState({
			username:username
		})
		this.checkSubmit({username:username});
	}
	checkUName =(username)=>{
		if(username == null || username == "") return false;
		return true;
	}
	inputName = (name)=>{
		console.log(name)
		this.setState({
			name:name
		})
	}
	inputPwd = (password)=> {
		console.log(password)
		this.setState({
			password:password
		})
		this.checkSubmit({password:password});
	}
	checkPwd = (password)=>{
		if(password == null || password == "") return false;
		if(password.length < 10){
			this.setState({
				passwordMsg:{
					color:"#ff0000",
					msg:"密码过短"
				}
			})
			return false;
		}
		this.setState({
			passwordMsg:{
				color:"#00ff00",
				msg:"密码可用"
			}
		})
		return true;
	}
	checkSubmit=(obj)=>{
		let email = obj.email != null ? obj.email : this.state.email;
		let username = obj.username != null ? obj.username : this.state.username;
		let name = obj.name != null ? obj.name : this.state.name;
		let password = obj.password != null ? obj.password : this.state.password;

		
		if(this.checkEmail(email) && this.checkPwd(password) && this.checkUName(username)){
			this.setState({
				enableSubmit:true
			})
		}else{
			this.setState({
				enableSubmit:false
			})
		}
	}
	render(){
		const {emailMsg, usernameMsg, nameMsg, passwordMsg, enableSubmit, errorMsg}=this.state
		return(
			<ScrollView style={{flex:1,width:"100%",backgroundColor:"#fff"}}>
				<View style={{marginLeft:20,marginRight:20,marginTop:20}}>
					<Text style={{height:50, justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>邮箱</Text>
					<TextInput   placeholder = '' style={{borderWidth:1,borderColor:"#ccc",height:40}}  onChangeText = {this.inputEmail}></TextInput>
					
					{emailMsg ? 
						<Text style={{fontSize:16,color:emailMsg.color,marginTop:2}}>{emailMsg.msg}</Text>
					:
					<Text style={{fontSize:16,color:"#777",marginTop:2}}>绝对不会被公开显示</Text>
					 }

				</View>
				<View style={{marginLeft:20,marginRight:20,marginTop:20}}>
					<Text style={{height:50, justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>用户名</Text>
					<TextInput   placeholder = '' style={{borderWidth:1,borderColor:"#ccc",height:40}}  onChangeText = {this.inputUName}></TextInput>
					<Text style={{fontSize:16,color:"#777",marginTop:2}}>{usernameMsg || "独一无二，没有空格，简短"}</Text>
				</View>
				<View style={{marginLeft:20,marginRight:20,marginTop:20}}>
					<Text style={{height:50, justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>昵称</Text>
					<TextInput   placeholder = '' style={{borderWidth:1,borderColor:"#ccc",height:40}}  onChangeText = {this.inputName}></TextInput>
					<Text style={{fontSize:16,color:"#777",marginTop:2}}>{nameMsg || "全名（可选）"}</Text>
				</View>
				<View style={{marginLeft:20,marginRight:20,marginTop:20}}>
					<Text style={{height:50, justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>密码</Text>
					<TextInput   placeholder = '' style={{borderWidth:1,borderColor:"#ccc",height:40}} secureTextEntry = {true} onChangeText = {this.inputPwd}></TextInput>
					
					{passwordMsg ? 
						<Text style={{fontSize:16,color:passwordMsg.color,marginTop:2}}>{passwordMsg.msg}</Text>
					:
					<Text style={{fontSize:16,color:"#777",marginTop:2}}>至少 10 个字符</Text>
					 }
				</View>
				{errorMsg && <View style={{marginLeft:20,marginRight:20,marginTop:20,flexDirection:'row',justifyContent:'space-between'}}>
					<Text style={{color:"#ff0000",fontSize:16}}>{errorMsg}</Text>	
				</View>}
				<View style={{marginLeft:20,marginRight:20,marginTop:20,flexDirection:'row',justifyContent:'space-between'}}>
					
					{enableSubmit ? 
						<Text onPress={this.submit} style={{width:"35%", height:40,borderWidth:1,borderColor:"#00ff00",borderRadius:5,backgroundColor:"#00ff00",color:"#fff",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>创建新账户</Text>
					:
						<Text onPress={this.submit} style={{width:"35%", height:40,borderWidth:1,borderColor:"#ccc",borderRadius:5,backgroundColor:"#ccc",color:"#fff",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>创建新账户</Text>
					
					}
					<Text onPress={()=>this.props.navigation.goBack()} style={{width:"35%", height:40,borderWidth:1,borderColor:"#00ff00",borderRadius:5,backgroundColor:"#00ff00",color:"#fff",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>登录</Text>
				</View>
				
				<View style={{margin:20,flexDirection:'row'}}>
					<Text>注册即表示你同意</Text>
					<Text style={{color:"#00ff00"}}> 隐私策略 </Text>
					<Text>和</Text>
					<Text style={{color:"#00ff00"}}> 服务条款</Text>
				</View>
				

			</ScrollView>
		)
	}
}	
export default Signup;