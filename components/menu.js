/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
class Menu extends Component {
	componentDidMount (){

	}
	render(){
		const {categoriesAll, navigation} = this.props
		return(
			<View style={{width:"100%",position:"absolute",top:50,padding:10,backgroundColor:"#efefef",zIndex:5}}>
				<View style={{width:"100%",height:80,borderBottomWidth:1,backgroundColor:"#fff",flexDirection:'row',
		flexWrap:'wrap',borderBottomColor:"#ddd"}}>
					<Text onPress = {()=>navigation.navigate('TopicList',{type:"latest"})} style={{width:"50%",height:40,  textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>最新</Text>
					<Text onPress = {()=>navigation.navigate('TopicList',{type:"top"})} style={{width:"50%",height:40, textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>热门</Text>
					<Text onPress = {()=>navigation.navigate('Badges')} style={{width:"50%",height:40,   textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>徽章</Text>
					<Text onPress = {()=>navigation.navigate('Users')}  style={{width:"50%",height:40,textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>用户</Text>
					{/*<Text style={{width:"50%",height:40,    textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>群组</Text>*/}
					
				</View>
				<View style={{width:"100%",height:120,borderBottomWidth:1,backgroundColor:"#fff",borderBottomColor:"#ddd"}}>
					<Text style={{width:"100%",height:40, textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>分类 ( 还有 {categoriesAll.length - 6} 个分类 )</Text>
					
					<View style={{maxWidth:"100%",
						paddingLeft:15,
						flexDirection:'row',
						flexWrap:'wrap',
					}}>
					{categoriesAll.map((cate,k)=>{
						if(k>5)return;
						if(cate.cateTittle != "" ){
		    				return <View  key={k} style={{flexDirection:'row',width:"50%",height:20}}>

		    				{cate.type == 1 && <LinearGradient
												    start={{ x : 0, y : 1 }} end={{ x : 1, y : 1 }}
												    locations={[ 0,0.5,0.5, 1]}
												    colors={[cate.p_color, cate.p_color, cate.color, cate.color ]}
												    style={{width:10,height:10,margin:5}}>
													    
													</LinearGradient>}
			    			{cate.type == 0 && <Text key={k} style={{width:10,height:10,margin:5,backgroundColor:cate.color}}></Text> }	
			    				<Text key={k+"a"}  style={{fontSize:14}}>{cate.cateTittle}</Text>
		    				</View>
		    			}
					})}

					</View>
				</View>
				<View style={{width:"100%",backgroundColor:"#fff",flexDirection:'row'}}>
					<Text onPress={()=>navigation.navigate('About')} style={{width:"50%",height:40,  textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>关于</Text>
					<Text style={{width:"50%",height:40, textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>常见问题</Text>
					
				</View>
			</View>
		)
	}
}	
export default Menu;