function search(query) {
	db.collection("users").where("name", ">=", query).get().then((snap) => {
		snap.forEach((doc) => {
			let data = doc.data();

			storage.ref(data.profilePic).getDownloadURL().then((url) => {
				let elements = "<div class='search-result'><div class='search-result-profilePic-container'><img class='search-result-profilePic' src=" + url + " ></div><div class='search-result-name-container'><div class='search-result-name'>" + data.name + "</div><div class='connect-button' onclick='makePeer('" + data.uid + "')'>Make Peer</div></div></div>";
				$("#search-results-name").append(elements);
			});
		});
	});
}

auth.onAuthStateChanged((user) => {
	if (!user) {
		document.location.replace("/login.html");
	} else {
		db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
			let data = doc.data();
			let friends = data.friends;

			friends.forEach((friend) => {
				db.collection("users").doc(friend).get().then((docFriend) => {
					let friendData = docFriend.data();

					storage.ref(friendData.profilePic).getDownloadURL().then((url) => {
						let elements = `
						<a class="active-chat fade">
							<img class='chat-profilePic' src=${url} >
							<p class='chat-name'>${friendData.name}</p>
						</a>`;
						$("#chat-list").append(elements);
					});
				});
			});

			db.collection("users").where("tags", "array-contains-any", data.tags).get().then((snap) => {
				snap.forEach((docOther) => {
					let dataOther = docOther.data();

					storage.ref(dataOther.profilePic).getDownloadURL().then((url) => {
						let elements = `
						<div class='search-result'>
							<div class='search-result-profilePic-container'>
								<img class='search-result-profilePic' src="${url}" >
							</div><div class='search-result-name-container'>
							<div class='search-result-name'>${dataOther.name}</div>
								<button class='connect-button' onClick='makePeer('"${dataOther.uid}"')'>Make Peer</button>
							</div>
						</div>`;
						$("#similar-tags").append(elements);
					});
				});
			});
		});
	}
});