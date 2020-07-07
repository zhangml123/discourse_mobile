import moment from 'moment';
export function timeFormate(timestamp){
	//console.log("timestamp =" +timestamp)
	let D = moment.duration(timestamp,"seconds").days();
	let H = moment.duration(timestamp,"seconds").hours();
	let m = moment.duration(timestamp,"seconds").minutes();
	let s = moment.duration(timestamp,"seconds").seconds();
	if(D >= 1 ) return "约 "+ D + " 天";
	if(H >= 1 ) return "约 "+ H + " 小时";
	if(m >= 1 ) return "约 "+ m + " 分钟";
	 return "< 1 分钟";

}
