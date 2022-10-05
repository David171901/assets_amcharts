(function (PV) {

  PV.deriveVisualizationFromBase(symbolVis);

  var definition = { 
    typeName: "menu-YAULI",
	iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
    visObjectType: symbolVis,
    datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
    getDefaultConfig: function(){ 
        return { 
            Height: 200,
            Width: 200,
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
      console.log("menu Yauli loaded");
  };
   
  PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
