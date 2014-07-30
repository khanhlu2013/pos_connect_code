describe('main page', function() {
	var ptor = protractor.getInstance();
	var driver = ptor.driver;	

	var sp_result = element.all(by.repeater('sp in sp_lst'));

 	// var findById = function(id){
 	// 	return driver.findElement(protractor.By.id(id))
 	// }

 // 	it('login first before other test',function(){
	// 	driver.get('http://0.0.0.0:5000/');
	// 	findById('id_username').sendKeys('x');
	// 	findById('id_password').sendKeys('x');
	// 	findById('login_btn').click();
 // 		browser.get('http://0.0.0.0:5000');
	// })

	it('can search for name',function(){
 		browser.get('http://0.0.0.0:5000');
		var name_search_input = element(by.model('name_search_str'));
		name_search_input.sendKeys('jack');
		name_search_input.sendKeys(protractor.Key.ENTER);

		expect(sp_result.count()).toEqual(82);
	})
});