(function() {
	bh.ui = {};
	
	bh.ui.createAddWindow = function() {
		var win = Ti.UI.createWindow({
			title:L('new_fugitive'),
			layout:'vertical',
			backgroundColor:'#fff'
		});
		
		if (Ti.Platform.osname === 'iphone') {
			var b = Titanium.UI.createButton({
				title:'Close',
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			b.addEventListener('click',function() {
				win.close();
			});
			win.setRightNavButton(b);
		};
		
		/*
		 * Creamos formulario para agregar nuevo fugitivo
		 */
		var input = Ti.UI.createTextField({
			height : 40
			,width : 250
			,borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		
		var save = Ti.UI.createButton({
			title : L('save')
		})
		
		
		/*
		 * Cuando se de clik, guardamos
		 */
		save .addEventListener('click', function(){
			bh.db.add(input.value);
			win.close();
		});
		
		win.add(input);
		win.add(save);
		
		return win;
	};
	
	bh.ui.createDetailWindow = function(/*Object*/ _bounty) {
		var win = Ti.UI.createWindow({
			title:_bounty.title,
			layout:'vertical'
		});
		
		win.add(Ti.UI.createLabel({
			text:(_bounty.captured) ? L('busted') : L('still_at_large'),
			top:10,
			textAlign:'center',
			font: {
				fontWeight:'bold',
				fontSize:18
			},
			height:'auto'
		}));
		
		var cameraButton = Ti.UI.createButton({
			title:L('takepicture'),
			top:10,
			height:40,
			width:200
		});
		
		// Agregamos la imagen
		var imgView = Ti.UI.createImageView({
			backgroundColor : 'gray'
			,height : 150
			,width : 150
			,top : 10
			,url : (_bounty.url) ? _bounty.url : 'http://placehold.it/150x150&text=No+Picture'
			
		});
		
	
		
		
		win.add(imgView);
		
		// Mostrar la càmara al hacer click
		cameraButton.addEventListener('click', function(){
			Ti.Media.openPhotoGallery({
				success : function(e){
					var img = e.media;
					imgView.image = img;
					
					var f = Ti.Filesystem.getFile(
						Ti.Filesystem.applicationDataDirectory, 'photo' + _bounty.id + '.png'
					);
					
					f.write(img);
					
					
					bh.db.addPhoto(_bounty.id, f.nativePath);
					
					alert(f.nativePath);
				}
				,cancel : function(e){
					alert('Es necesario que tomes una fotografia')
				}
			});
		});
		
		win.add(cameraButton);
		
		if (!_bounty.captured) {
			var captureButton = Ti.UI.createButton({
				title:L('capture'),
				top:10,
				height:40,
				width:200
			});
			win.add(captureButton);
		}
		
		captureButton.addEventListener('click', function(e){
			bh.db.bust(_bounty.id);
			
			// Le decimos al mundo que lo hemos acapturado
			// bh.net.bustFugitive(Ti.Platform.id, function(data){
				// alert('algo');
			// });
			
			win.close();
		});
		
		var deleteButton = Ti.UI.createButton({
			title:L('delete'),
			top:10,
			height:40,
			width:200
		});
		win.add(deleteButton);
		
		deleteButton.addEventListener('click', function(){
			bh.db.del(_bounty.id);
			win.close();
		});
		
		return win;
	};
	
	bh.ui.createBountyTableView = function(/*Boolean*/ _captured) {
		var tv = Ti.UI.createTableView();
		
		tv.addEventListener('click', function(_e) {
			var tab = (_captured) ? bh.capturedTab : bh.fugitivesTab;
			tab.open(bh.ui.createDetailWindow(_e.rowData));
		});
		
		function populateData() {
			//use dummy data for now...
			var results = bh.db.list(_captured);
			
			tv.setData(results);
		}
		
		Ti.App.addEventListener('databaseUpdated', populateData);
		
		populateData();
		
		return tv;
	};
	
	bh.ui.createBountyWindow = function(/*Boolean*/ _captured) {
		var win = Titanium.UI.createWindow({
		  title: (_captured) ? L('captured') : L('fugitives'),
			activity : {
				onCreateOptionsMenu : function(e) {
					var menu = e.menu;
					var m1 = menu.add({ title : L('add') });
					m1.addEventListener('click', function(e) {
						//open in tab group to get free title bar (android)
						var tab = (_captured) ? bh.capturedTab : bh.fugitivesTab;
						tab.open(bh.ui.createAddWindow());
					});
				}
			}
		});
		win.add(bh.ui.createBountyTableView(_captured));
		
		if (Ti.Platform.osname === 'iphone') {
			var b = Titanium.UI.createButton({
				title:L('add'),
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			b.addEventListener('click',function() {
				//open modal on iOS - looks more appropriate
				bh.ui.createAddWindow().open({modal:true});
			});
			win.setRightNavButton(b);
		}
		return win;
	};
	
	bh.ui.createApplicationTabGroup = function() {
		var tabGroup = Titanium.UI.createTabGroup();
		
		var fugitives = bh.ui.createBountyWindow(false);
		var captured = bh.ui.createBountyWindow(true);
		
		bh.fugitivesTab = Titanium.UI.createTab({
		  title: L('fugitives'),
		  window: fugitives
		});
		
		bh.capturedTab = Titanium.UI.createTab({
		  title: L('captured'),
		  window: captured
		});
		
		tabGroup.addTab(bh.fugitivesTab);
		tabGroup.addTab(bh.capturedTab);
		
		return tabGroup;
	};
})();