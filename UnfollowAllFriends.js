(() => {
  /*
  **  
  **  
  */
  
  const ACCESS_TOKEN = ''; // Get Token Here: https://github.com/nguyenxuanphuprofile/Facebook-JS/blob/master/GetFacebookToken2019.js

	var get_friends = (e, o) => {
		var a = new XMLHttpRequest;
		a.onreadystatechange = (() => {
			4 == a.readyState && 200 == a.status && o(JSON.parse(a.responseText).data)
		}), a.open("GET", "https://graph.facebook.com/me/friends?limit=5000&fields=id,name&access_token=" + e), a.send()
	};
	var removeFriend = (user, callback) => {
		var xhr = new XMLHttpRequest;
		var frm = new FormData();
		frm.append('subject_id', user.id);
		frm.append('forceredirect', 'false');
		frm.append('location', '83');
		frm.append('m_sess', '');
		frm.append('fb_dtsg', require('MRequestConfig')['dtsg']['token']);
		xhr.open('POST', '/a/subscriptions/remove');
		xhr.send(frm);
		if (xhr.readyState == 4 && xhr.status !== 400 && xhr.status !== 500) callback(user);
	}
	get_friends(ACCESS_TOKEN, friend_list => {
		friend_list.forEach(friend => {
			removeFriend(friend, unfollowed => {
				console.log('Unfollowed ' + unfollowed.name);
			});
		});
	});
})();
