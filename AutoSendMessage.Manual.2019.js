(() => {
	/*
	{
		Author: 	"MonokaiJs",
		Home:		"https://omfg.vn",
		Donate:		"https://omfg.vn/donate"
	}
	*/
	
	const ACCESS_TOKEN = ''; // Insert Token here!
	
	var friend_limit_count = 500; // limit friends number
	var dtsg = document.getElementsByName("fb_dtsg")[0].value;
	var msgs = ['Chúc mừng năm mới!', 'Happy New Year', 'Happy New Year 2019!', 'Happy New Year 2019!!!!', 'Năm mới hạnh phúc', 'Chúc mừng năm mới ;)', 'Năm mới hạnh phúc <3', 'Năm mới bình an :D', 'Chúc năm mới hạnh phúc <3'];
	var sendMessage = (mmsg, uuid) => {
		var formData = new FormData();
		formData.append("ids["+uuid+"]", uuid);
		formData.append("body", mmsg);
		formData.append("fb_dtsg", dtsg);
		var r = new XMLHttpRequest;
		r.onreadystatechange = () => {
			if (r.readyState == 4 && r.status == 200) {
				console.log('Message was sent to [' + uuid + ']');
			}
		}
		r.open('POST', 'https://m.facebook.com/messages/send/?icm=1&refid=12&ref=dbl');
		r.send(formData);
	}
	var getFriendList = (token, callback) => {
		console.log('Written by @MonokaiJs [https://fb.me/MonokaiJsp](omfg.vn)');
		console.log('Do not remove credit line.');
		var rr = new XMLHttpRequest;
		rr.onreadystatechange = () => {
			if (rr.readyState == 4 && rr.status == 200) {
				var d = JSON.parse(rr.responseText).data;
				callback(d);
			}
		}
		rr.open('GET', 'https://graph.facebook.com/me/friends?fields=id&access_token='+token);
		rr.send();
	}
	getFriendList(ACCESS_TOKEN, (frList) => {
		var counter = 0;
		frList.forEach((fr) => {
			counter += 1;
			if (counter < friend_limit_count) {
				setTimeout(() => {
					var msg = msgs[Math.floor(Math.random() * msgs.length)];
					sendMessage(msg, fr.id);
				}, 100*counter);
			}
		});
	});
})();
