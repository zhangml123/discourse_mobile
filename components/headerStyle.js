import {StyleSheet, Dimensions} from 'react-native';
const styles = StyleSheet.create({
	accountImage:{

		resizeMode:"contain",
		position:"absolute",
        right:"5%",
        //backgroundColor:"#ccc" 
	},
	imageLeft:{
		width:"8%",
		resizeMode:"contain",
		position:"absolute",
        left:"5%"  
	},
	imageRight:{
		width:35,
		height:35,
		borderRadius:35,
		marginTop:6
	},
	input:{
		width:"60%",
		height:40,
		marginTop:5,
		position:"absolute",
        left:"20%",
        paddingLeft:"15%",
        backgroundColor:"#eee",
        borderRadius:8
	},
	search:{
		width:"6%",
		resizeMode:"contain",
		position:"absolute",
        left:"22%"  
	},
})

export default styles;