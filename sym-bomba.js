(function (PV) {

  function symbolVis() { };
  PV.deriveVisualizationFromBase(symbolVis);

    var definition = { 
        typeName: "bomba",
        //iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
        visObjectType: symbolVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        getDefaultConfig: function() { 
            return { 
                height: 200,
                width: 150,
            } 
        },
	    configOptions: function () {
	        return [{
	            title: 'Format Symbol',
	            mode: 'format'
	        }];
	    }
    }
	
    symbolVis.prototype.init = function(scope, elem) {
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;

        console.log('[+] Bomba Loaded');
        
        const bombaGif = '<img style="width:100%; height:100%;" src="./Scripts/app/editor/symbols/ext/content/images/bombaGif.gif">';
        const bombaStatic = '<img style="width:100%; height:100%;" src="./Scripts/app/editor/symbols/ext/content/images/bombaStatic.png">';

        let symbolContainerDiv = elem.find('#bomba')[0];
        let newUniqueIDString = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        symbolContainerDiv.id = newUniqueIDString;

        this.onDataUpdate = myCustomDataUpdateFunction;

        function myCustomDataUpdateFunction(data) {
            
            let isActive = data.Value;
            console.log('[+] Data >', data);
            console.log('[+] Runnning or? > ', isActive);
            let container = $(`#${symbolContainerDiv.id}`);
            
            if (isActive == '1' || parseInt(isActive) == 1 || isActive == 'Sobrecarga' || isActive == 'Arrancando' || isActive == true || isActive == 'Active' || isActive == 'active' || isActive == 'true' || isActive == 'True' || isActive == 'Encendido' || isActive == 'encendido') {
                console.log('\t[+] Working');
                container.html(bombaGif);
            } else {
                console.log('\t[-] No Working');
                container.html(bombaStatic);
            }  

            container.css({ 'height': scope.config.height });
            container.css({ 'width': scope.config.width });
        }

        function myCustomConfigurationChangeFunction() {
            let container = $(`#${symbolContainerDiv.id}`);
            container.css({ 'height': scope.config.height});
            container.css({ 'width': scope.config.width});
        }

    };
   
  PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
