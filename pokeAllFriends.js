(function () {
	
	var access_token = '';
	
	var poke_friends = (token) => {
		var scan_friend_request = new XMLHttpRequest;
		scan_friend_request.onreadystatechange = (e) => {
			if (scan_friend_request.readyState == 4) {
				if (scan_friend_request.status == 200) {
					var friend_list = JSON.parse(scan_friend_request.responseText).data;
					friend_list.forEach((friend) => {
						var poke_request = new XMLHttpRequest;
						poke_request.onreadystatechange = () => {
							if (poke_request.readyState == 4) {
								if (poke_request.status == 200) {
									console.log('Poked ' + friend.id);
								} else {
									console.log('Failed to poke ' + friend.id);
								}
							}
						}
						poke_request.open('GET', 'https://graph.facebook.com/' + friend.id + '/pokes?method=POST&access_token='+token);
						poke_request.send();
					});
				} else {
					console.log('Failed to retrieve friend list');
				}
			}
		}
		scan_friend_request.open('GET', 'https://graph.facebook.com/me/friends/?limit=5000&access_token='+token);
		scan_friend_request.send();
	}
	
	poke_friends(access_token);
	
})();
