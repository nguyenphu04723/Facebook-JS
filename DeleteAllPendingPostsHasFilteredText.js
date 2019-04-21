(() => {
	/*
	* Date  : 16/02/2019
	*/
	
	var groupID = '2294816267404325';								// REPLACE YOUR GROUP ID HERE
	var filtered_text = ['Fuck', 'Death'];
	
	var dtsg_ag = require('DTSGInitData').async_get_token;
	var dtsg    = require('DTSGInitData').token;
	var getPendingPosts = (dtsg_ag, groupID, cb_posts) => {
		var xhr		= new XMLHttpRequest;
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var html   = JSON.parse(xhr.responseText.substring(9))['domops'][0][3]['__html'];
				var parser = new DOMParser();
				var data = parser.parseFromString(html, 'text/html');
				var feed = data.querySelectorAll('._4-u2.mbm._4mrt._5jmm._5pat._5v3q._7cqq._5pjc._4-u8');
				var posts = [];
				feed.forEach(post => {
					var postID = post.id.substring(10);
					var postText = HTMLToText(post.querySelector('._5_jv._58jw').innerHTML);
					//console.log(postID);
					posts.push({
						id: postID,
						text: postText
					});
				});
				cb_posts(posts);
			}
		}
		xhr.open('GET', '/groups/unified_queue/async_response/?group_id=' + groupID + '&queue=pending&fb_dtsg_ag=' + dtsg_ag + '&__a=1');
		xhr.send();
	}
	var deletePendingPost = (fb_dtsg, groupID, postID) => {
		var dxhr = new XMLHttpRequest;
		var FORM = new FormData();
		FORM.append('fb_dtsg', fb_dtsg);
		FORM.append('group_id', groupID);
		FORM.append('post_id', postID);
		FORM.append('pending', '1');
		FORM.append('story_dom_id', 'mall_post_' + postID);
		FORM.append('nctr[_mod]', 'pagelet_pending_queue');
		FORM.append('confirmed', '1');
		FORM.append('__a', '1');
		dxhr.open('POST', '/ajax/groups/mall/delete/');
		dxhr.send(FORM);
		dxhr.onreadystatechange = () => {
			if (dxhr.readyState == 4 && dxhr.status == 200) {
				console.log('Deleted ' + postID);
			}
		}
	}
	
	/* DELETE ALL POSTS HAS FILTERED TEXT */
	
	getPendingPosts(dtsg_ag, groupID, (posts) => {
		posts.forEach(pending_post => {
			filtered_text.forEach(l => {
				if (pending_post.includes(l)) { deletePendingPost(dtsg, groupID, pending_post.id); break;
			});
		});
	});
	
	
	
	var HTMLToText = (html) => {
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}
})();
