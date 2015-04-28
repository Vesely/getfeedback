
// //Give me a user from database
// var getUser = function (userId) {
// };


//Give me a userId from local storage
var getUserFromStorage = function () {
	return localStorage.getItem('userId');
};


//Save user to local storage
var setUserToStorage = function(userId) {
	if (userId) {
		localStorage.setItem('userId', userId);
	};
};
