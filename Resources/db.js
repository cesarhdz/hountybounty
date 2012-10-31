/*
 * Archivo para manejar los datos enn el proyecto
 */

(function(){
	
	bh.db = {};
	
	// Abrimos la base de datos, y se crea por si no existe
	var db = Ti.Database.open('TBH');
	db.execute('CREATE TABLE IF NOT EXISTS fugitives(id INTEGER PRIMARY KEY, name TEXT, captured INTEGER);');
	db.close();
	
	
	bh.db.list = function(_captured){
		var fList = [];
		var db = Ti.Database.open('TBH');
		
		var result = db.execute('SELECT * FROM fugitives WHERE captured = ? ORDER BY name ASC',
			(_captured) ? 1 : 0);
			
		while (result.isValidRow()){
			fList.push({
				title : result.fieldByName('name'),
				id : result.fieldByName('id'),
				hasChild : true,
				name : result.fieldByName('name'),
				captured : (Number(result.fieldByName('captured')) === 1)
			}) ;
		}
		
		result.next;
		
		result.close(); // Cerramos el apuntador
		db.close();
	
		return fList;
	}
	
	bh.db.add = function(_name){
		
		var db = Ti.Database.open('TBH');
		db.execute("INSERT INTO fugitives(name, captured) VALUES(?, ?)", _name, 0);
		
		Ti.App.fireEvent('dbUpdate');
	}
	
	bh.db.del = function(_id){
		var db = Ti.Database.open('TBH');
		db.execute("DELETE FROM fugitives WHERE id = ?", _id);
		db.close();
		
		Ti.App.info();
		
		Ti.App.fireEvent('dbUpdate');
	}
	
	bh.db.bust = function(_id){
		var db = Ti.Database.open('TBH');
		db.execute('UPDATE fugitives SET captured = 1 WHERE id = ?', _id);
		db.close();
		
		Ti.App.fireEvent('dbUpdate');
		
	}
	
})();
