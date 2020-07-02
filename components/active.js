/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
class Active extends Component {
	componentDidMount (){
 		const {navigation } = this.props;
 		navigation.setOptions({
			title: "激活账号",
			headerStyle: {
	            height:45
	        }
		});
    }
	render(){
		const {email} = this.props.route.params
		return(
			<View style={{flex:1,backgroundColor:"#fff",padding:10}}>
				<Text style={{fontSize:20,marginTop:30}}>快完成了！我们发送了一封激活邮件到{email}。请按照邮件中的步骤来激活你的账户。</Text>

				<Text style={{fontSize:20,marginTop:30}}>如果你没有收到邮件，请检查你的垃圾邮件收件箱。</Text>
				<Text style={{marginTop:30,width:"100%", height:40,borderWidth:1,borderColor:"#00ff00",borderRadius:5,backgroundColor:"#00ff00",color:"#fff",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>重发激活邮件</Text>
				<Text style={{marginTop:30,width:"100%", height:40,borderWidth:1,borderColor:"#ccc",borderRadius:5,backgroundColor:"#ccc",color:"#fff",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>更改邮件地址</Text>
				<Text style={{marginTop:30,width:"100%", height:40,borderWidth:1,borderColor:"#ccc",borderRadius:5,backgroundColor:"#ccc",color:"#fff",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>登录</Text>
			</View>
		)
	}
}	
export default Active;