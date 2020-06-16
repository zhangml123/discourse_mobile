const htmlWeb = `
	<div onClick="aa()" id = "test" style="font-size:70px;color:#444">asdfasdfasd</div>
	<textarea id="editor_id" name="content" style="width:700px;height:300px;">
&lt;strong&gt;HTML内容&lt;/strong&gt;
</textarea>
	
	<script src="./kindeditor/kindeditor-all.js"></script>
	<script>
	function aa(){
alert("click")
}
	alert("js running")
		//alert(KindEditor)
		//alert("test.js")
	 var editor;
			KindEditor.ready(function(K) {
				editor = K.create('textarea[name="content"]', {
					themeType : 'qq',
					resizeType : 1,
					allowPreviewEmoticons : false,
					allowImageUpload : false,
					items : [
						'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
						'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
						'insertunorderedlist', '|', 'emoticons', 'image', 'link']
				});
			});
	</script>
   
`;
export default htmlWeb;