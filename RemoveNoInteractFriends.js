(() => {
  /*
  ** Please credit me if you're interested in my work :D
  ** DO NOT remove these credit line when sharing!
  */
  
	const exceptions = ['100030089564311', '100011158877849', '100001467593814'];
	
	const LIMIT_POSTS = 100;
	const ACCESS_TOKEN = ''; // GET TOKEN HERE: https://github.com/nguyenxuanphuprofile/Facebook-JS/blob/master/GetFacebookToken2019.js
	
	var getFriendList = (e, o) => {var a = new XMLHttpRequest;a.onreadystatechange = (() => {4 == a.readyState && 200 == a.status && o(JSON.parse(a.responseText).data)}), a.open("GET", "https://graph.facebook.com/me/friends?limit=5000&fields=id,name&access_token=" + e), a.send()}
	var getPosts = (e, o) => {var a = new XMLHttpRequest;a.onreadystatechange = (() => {4 == a.readyState && 200 == a.status && o(JSON.parse(a.responseText).data)}), a.open("GET", "https://graph.facebook.com/me/posts?limit="+LIMIT_POSTS+"&fields=id,name&access_token=" + e), a.send()}
	var getShares=(e,n,o=!1)=>{o||(o="https://graph.facebook.com/"+n+"/comments?limit=5000&fields=from.id&access_token="+e);var t=new XMLHttpRequest;t.open("GET",o),t.send(),t.onreadystatechange=(()=>{if(4==t.readyState&&200==t.status){var e=JSON.parse(t.responseText);e.data.forEach(e=>{void 0!==friendsList[e.from.id]&&(friendsList[e.from.id].point+=1)}),void 0!==e.paging&&void 0!==e.paging.next?console.log("Continue scanning reactions for "+n):(console.log("Scanned comments on post "+n),completedPosts.push(n))}})},getComments=(e,n,o=!1)=>{o||(o="https://graph.facebook.com/"+n+"/comments?limit=5000&fields=from.id&access_token="+e);var t=new XMLHttpRequest;t.open("GET",o),t.send(),t.onreadystatechange=(()=>{if(4==t.readyState&&200==t.status){var o=JSON.parse(t.responseText);o.data.forEach(e=>{void 0!==friendsList[e.from.id]&&(friendsList[e.from.id].point+=1)}),void 0!==o.paging&&void 0!==o.paging.next?console.log("Continue scanning reactions for "+n):(console.log("Scanned comments on post "+n),getShares(e,n))}})},getReactions=(e,n,o=!1)=>{o||(o="https://graph.facebook.com/"+n+"/reactions?limit=5000&access_token="+e);var t=new XMLHttpRequest;t.open("GET",o),t.send(),t.onreadystatechange=(()=>{if(4==t.readyState&&200==t.status){var o=JSON.parse(t.responseText);o.data.forEach(e=>{void 0!==friendsList[e.id]&&(friendsList[e.id].point+=1)}),void 0!==o.paging&&void 0!==o.paging.next?console.log("Continue scanning reactions for "+n):(console.log("Scanned reactions on post "+n),getComments(e,n))}})},removeFriend=(e,n)=>{var o=new XMLHttpRequest,t=new FormData;t.append("fb_dtsg",require("DTSGInitialData").token),t.append("uid",e.id),t.append("unref","bd_profile_button"),t.append("floc","profile_button"),t.append("nctr[_mod]","pagelet_timeline_profile_actions"),t.append("__req","x"),t.append("__be","1"),t.append("__pc","PHASED:ufi_home_page_pkg"),t.append("dpr","1"),o.open("POST","https://www.facebook.com/ajax/profile/removefriendconfirm.php"),o.send(t),o.onreadystatechange=(()=>{4==o.readyState&&200==o.status&&n(e)})};
	var friendsList = {}, completedPosts = [];
	console.log('Loading friends list...');
	getFriendList(ACCESS_TOKEN, graph_friendlist => {
		console.log('Successfully loaded ' + graph_friendlist.length + ' friends...');
		for (fid in graph_friendlist) {
			friendsList[graph_friendlist[fid].id] = {};
			friendsList[graph_friendlist[fid].id].name = graph_friendlist[fid].name;
			friendsList[graph_friendlist[fid].id].point = 0;
		}
		console.log('Loading posts...');
		getPosts(ACCESS_TOKEN, posts => {
			console.log('Loaded ' + posts.length + ' posts.');
			console.log('Loading posts reactions...');
			posts.forEach(post => {
				getReactions(ACCESS_TOKEN, post.id, false);
			});
			var interval = setInterval(() => {
				if (completedPosts.length == posts.length) {
					console.log('> Done scanning progress!');
					var removeList = [];
					for (friend_id in friendsList) if (friendsList[friend_id].point == 0 && !exceptions.includes(friend_id)) removeList.push({
						id: friend_id,
						name: friendsList[friend_id].name
					});
					console.log('> Done filtered friends to be removed!');
					console.log('⚠️ ' + removeList.length + ' friends will be removed due to have no interaction!');
					var timer = 0;
					removeList.forEach(rem => {
						timer += 1;
						setTimeout(() => {
							removeFriend(rem, (removed) => {
								console.log('✔️ [' + removed.id + '] ' + removed.name + ' has just been removed from friends list!');
							});
						}, timer * 800);
					});
					clearInterval(interval);
				}
			}, 500);
		});
	});
})();
