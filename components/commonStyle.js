import {StyleSheet, Dimensions} from 'react-native';
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;
const styles = StyleSheet.create({
	/*content*/
	content:{
		flex:1,
		width:"100%",
		backgroundColor:"#fff",
		marginTop:120,
		marginBottom:5,
		borderTopWidth:3,
		borderTopColor:'#eee',
		zIndex:2
	},



	/*categories*/
	viewCategory:{
		width:"50%",
		height:60,
		flexDirection:'row',
		position:"absolute",
		top:55,
		right:0,
		zIndex:2,
		marginTop:5
		
	},
	viewContent:{
		width: windowWidth,
		height:1000,
		justifyContent: 'flex-start', 
		//flexDirection:'row',
		//backgroundColor:"#ccc",
		
	},
	categoryBtn:{
		width:40,
		height:40,
		backgroundColor:"#888",
		color:"#fff",
		borderWidth: 1,
		borderColor:'#888',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        marginLeft:10

	},
	currentCategoryBtn:{
		width:40,
		height:40,
		backgroundColor:"#ff9944",
		color:"#fff",
		borderWidth: 1,
		borderColor:'#ff9944',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        marginLeft:10

	},
	itemView:{
		width:"100%",
		borderBottomWidth: 1,
		borderLeftWidth:5,
		borderBottomColor:'#ccc',
		borderLeftColor:"#345678",
		
	},
	cateTittle:{
		maxWidth:"80%",
		fontSize:18,
		padding:10,
		//backgroundColor:"#334455",
		fontWeight:('bold', '800')
	},
	description:{
		paddingLeft:10
	},
	cates:{

		//backgroundColor:"#877777",
		maxWidth:"80%",
		padding:10,
		flexDirection:'row',
		flexWrap:'wrap'
	},
	cate:{
		//backgroundColor:"#344222",
		flexDirection:'row',
	}

})
export default styles;