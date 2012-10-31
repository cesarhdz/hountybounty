(function() {

bh.db = {};



//bootstrap database

var db = Ti.Database.open('TiBountyHunter');

db.execute('CREATE TABLE IF NOT EXISTS fugitives(id INTEGER PRIMARY KEY, name TEXT, captured INTEGER, url TEXT);');

db.close();



bh.db.list = function(_captured) {

var fugitiveList = [];

var db = Ti.Database.open('TiBountyHunter');

var result = db.execute('SELECT * FROM fugitives WHERE captured = ? ORDER BY name ASC',

(_captured) ? 1 : 0);

while (result.isValidRow()) {

fugitiveList.push({

//add these attributes for the benefit of a table view

title: result.fieldByName('name'),

id: result.fieldByName('id'), //custom data attribute to pass to detail page

hasChild:true,

//add actual db fields

name: result.fieldByName("name"),

captured: (Number(result.fieldByName("captured")) === 1)

});

result.next();

}

result.close(); //make sure to close the result set

db.close();



return fugitiveList;

};

/*
 * Agregamos una fotografia
 */
bh.db.addPhoto = function(_id, _url){
	var db = Ti.Database.open('TiBountyHunter');
	db.execute("UPDATE fugitives SET url = ? WHERE id = ?", _url, _id);
	db.close();
	
	Ti.App.fireEvent('databaseUpdated');
}



bh.db.add = function(_name) {

var db = Ti.Database.open('TiBountyHunter');

db.execute("INSERT INTO fugitives(name,captured) VALUES(?,?)",_name,0);

db.close();



//Dispatch a message to let others know the database has been updated

Ti.App.fireEvent("databaseUpdated");

};



bh.db.del = function(_id) {

var db = Ti.Database.open('TiBountyHunter');

db.execute("DELETE FROM fugitives WHERE id = ?",_id);

db.close();

Ti.API.info('si se agrego')

//Dispatch a message to let others know the database has been updated

Ti.App.fireEvent("databaseUpdated");

};



bh.db.bust = function(_id) {

var db = Ti.Database.open('TiBountyHunter');

db.execute("UPDATE fugitives SET captured = 1 WHERE id = ?",_id);

db.close();



//Dispatch a message to let others know the database has been updated

Ti.App.fireEvent("databaseUpdated");

};


if(!Ti.App.Properties.hasProperty('seeded')){
	bh.net.getFugitives(function(data){
		for (var i = data.length - 1; i >= 0; i--){
		  bh.db.add(data[i].name);
		};
	});
}

Ti.App.Properties.setString('seeded', 'yuppers');

})();