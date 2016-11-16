(function(){
	var	
		APP = function(){
			this.init = function(){
				var _this = this;
				this.service.startUI.call(this);
				this.service.runAnima();
				window.checkLoginState = function () {
					FB.getLoginStatus(function(response) {
						_this.fb.changeState(response);
					});
				}
				window.fbAsyncInit = function() {
					FB.init({
						appId      : 1612130129090779,
						cookie     : true,  
						xfbml      : true, 
						version    : 'v2.5'
					 });

					FB.getLoginStatus(function(response) {
						_this.fb.changeState(response);
					});
				};
				(function(d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/en_US/sdk.js";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			}
		},
		app = new APP();
		
	APP.prototype.fb = {
		logged: function() {
			FB.api('/me', function(response) {
				app.ui.logoffBlock.userName.html(response.name);
			});
		},
		changeState: function(response) {
			switch(response.status){
				case 'connected':
				console.log(response)
				 // var accessToken = response.authResponse.accessToken;
				//
					app.ui.logoffBlock.removeClass('s_hidden');
					app.ui.loginBlock.addClass('s_hidden');
					app.fb.logged();
				break
				case 'not_authorized':
					app.ui.logoffBlock.addClass('s_hidden');
					app.ui.loginBlock.removeClass('s_hidden');
					app.ui.loginBlock.status.html('Please log into this app.');
				break;
				default:
					app.ui.logoffBlock.addClass('s_hidden');
					app.ui.loginBlock.removeClass('s_hidden');
					app.ui.loginBlock.status.html('Please log into Facebook.');
				break
			}
		}
	};
	APP.prototype.service = {
		logout: function (){
			FB.logout(function(response) {
			  FB.getLoginStatus(app.fb.changeState);
			  app.service.runAnima();
			});

		},
		runAnima: function(){
			app.ui.blueBack.css({opacity:0}).stop().animate({opacity:0.9},3000);
			app.ui.loginBlock.css({opacity:0, fontSize:'2px'}).stop().animate({opacity:1, fontSize:'23px'},1000);
		},
		startUI: function(){
			this.ui = {
				blueBack: $('<div class = "blueBack"/>')
					.appendTo(document.body)
					.css({opacity:0}),
				loginBlock: $('<div>')
					.addClass('loginString')
					.appendTo(document.body),
				logoffBlock: $('<div>')
					.addClass('logoffBlock s_hidden')
					.appendTo(document.body)
			};
			this.ui.loginBlock.control = $('<fb:login-button scope="public_profile,email" onlogin="checkLoginState();"/>')
				.appendTo(app.ui.loginBlock)
				.addClass('loginButton');
			this.ui.loginBlock.status = $('<div/>')
				.addClass('s_centered')
				.appendTo(app.ui.loginBlock);
			this.ui.logoffBlock.control = $('<div/>')
				.html('logout')
				.addClass('logoutButton s_pointer s_lwb')
				.appendTo(app.ui.logoffBlock)
				.on('click', app.service.logout);
			this.ui.logoffBlock.userName = $('<div/>')
				.addClass('userName s_lwb')
				.appendTo(app.ui.logoffBlock);
		}
	} 
	$(document).ready(function(){app.init.call(app)});
}())