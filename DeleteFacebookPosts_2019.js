(() => {
	/*
	** Author: @MonokaiJs[FB: @MonokaiJsp]
	** Home: https://omfg.vn
	** ISC Licensed
	*/

	var token = ""; //Insert Token Here
	http3.open('GET', 'https://graph.facebook.com/me/posts?fields=id&limit=9999&access_token='+token);
	http3.send();
	http3.onreadystatechange = function(){
		if(http3.readyState == 4 && http3.status == 200){
			graphData = JSON.parse(http3.responseText);
			graphData.data.forEach((pdata) => {
				var http4 = new XMLHttpRequest;
				http4.open('DELETE', 'https://graph.facebook.com/v3.2/' + pdata.id + '?access_token=' + token);
				http4.send();
				http4.onreadystatechange = function () {
					if(http4.readyState == 4 && http4.status == 200){
						console.log('Deleted ' + pdata.id + '.');
					} else {
						console.log('Failed to delete ' + pdata.id);
					}
				}
			})
		}
	}
})();
