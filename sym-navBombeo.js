(function (PV) {
    "use strict";
  
    function symbolVis() { };
    PV.deriveVisualizationFromBase(symbolVis);
  
    var definition = { 
      typeName: "navBombeo",
      displayName: "Menu de Bombeo",
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
      
    symbolVis.prototype.init = function(scope, elem) {
        console.log("menu loaded");
    };
     
    PV.symbolCatalog.register(definition); 
  })(window.PIVisualization); 
  