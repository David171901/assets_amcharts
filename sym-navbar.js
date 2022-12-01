(function (PV) {

  PV.deriveVisualizationFromBase(symbolVis);

  var definition = { 
    typeName: "navbar",
    displayName: 'Navbar',
	iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
    visObjectType: symbolVis,
    datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
    getDefaultConfig: function(){ 
        return {
          Height: 1000,
        } 
    },
	
    configOptions: function () {
	    return [{
	        title: 'Format Symbol',
	        mode: 'format'
	    }];
    }
  }
  function symbolVis() { };
  symbolVis.prototype.init = function(scope, elem) {
      console.log("Navbar");
    };
   
  PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
