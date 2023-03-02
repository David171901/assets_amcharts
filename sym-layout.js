(function (PV) {

    PV.deriveVisualizationFromBase(symbolVis);
  
      var definition = { 
          typeName: "layout",
          displayName: 'Layout',
          iconUrl: '/Scripts/app/editor/symbols/ext/Icons/navbarCOMM.png',
          visObjectType: symbolVis,
          datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
          getDefaultConfig: function(){ 
              return { 
                  Height: 1024,
                  Width: 1440,
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
          console.log('\t[+]Layout');
  
          this.onDataUpdate = myCustomDataUpdateFunction;
          this.onConfigChange = myCustomConfigurationChangeFunction;
  
          function myCustomDataUpdateFunction(data) {
            return true
          }
  
          function myCustomConfigurationChangeFunction() {
            return true
          }
      };
     
    PV.symbolCatalog.register(definition); 
  })(window.PIVisualization); 
  