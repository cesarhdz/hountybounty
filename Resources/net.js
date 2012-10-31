/*
 * Creamo las functiones de Red, para comunicarnos con un servidor
 */

(function(){
	bh.net = {};
	
	var serverURL = 'http://bountyhunterapp.appspot.com/bounties';
	
	
	// Funcion para determinar los fugitivos desde un servidor remoto
	bh.net.getFugitives = function(_cb){
		
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function(){
			
			// La propiedad response text, guarda lo recibido
			// Sòlo es necesario convertirlo en objeto con JSON.parse
			_cb(JSON.parse(this.responseText));
		}
		
		xhr.open('GET', serverURL);
		xhr.send();
	}
	
	// Función pora cambiar el estado de un fugitivo
	bh.net.bustFugitive = function(_udid, _cb){
		
		Ti.App.info('Busting Fugitive ' + _udid);
		
		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function(){
			_cb(JSON.parse(this.responseText));
		}
		
		xhr.open('POST', serverURL);
		
		// Al ser POST, lo que hacemos es agregar
		// los datos en el mètodo send, en el caso
		// de get, no es necesario
		xhr.send({
			udid : _udid
		});
	}
	
	
	
})();
