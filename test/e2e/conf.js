var env = require('./environment.js');

exports.config = {
	seleniumAddress: env.seleniumAddress,
	specs: ['./sp_app/main_page.js'],

	baseUrl: env.baseUrl,

	onPrepare: function() {
		browser.driver.get(env.baseUrl);
 		browser.driver.findElement(by.id('id_username')).sendKeys('x');
		browser.driver.findElement(by.id('id_password')).sendKeys('x');
		browser.driver.findElement(by.id('login_btn')).click();
 	}
}
