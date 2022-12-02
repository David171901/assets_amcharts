(function (PV) {

    PV.deriveVisualizationFromBase(symbolVis);
  
      var definition = { 
          typeName: "navbarv3",
          displayName: 'Menu Navegacion Chungar',
          iconUrl: '/Scripts/app/editor/symbols/ext/Icons/navbarCOMM.png',
          visObjectType: symbolVis,
          datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
          getDefaultConfig: function(){ 
              return { 
                  Height: 150,
                  Width: 600,
                  title: '',
                  href: ''
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
          console.log('\t[+]navbar v2');
          let symbolTitle = elem.find('#navbar__title')[0];
          let newUniqueIDStringv1 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
          symbolTitle.id = newUniqueIDStringv1;
  
          this.onDataUpdate = myCustomDataUpdateFunction;
          this.onConfigChange = myCustomConfigurationChangeFunction;
  
          function myCustomDataUpdateFunction(data) {
              let titleElement = $(`#${symbolTitle.id}`);
              titleElement.html(scope.config.title)
              titleElement.attr("href",scope.config.href)
          }
  
          function myCustomConfigurationChangeFunction() {
              let titleElement = $(`#${symbolTitle.id}`);
              if (scope.config.title) titleElement.html(`${scope.config.title}`)
              if (scope.config.href) titleElement.attr("href",scope.config.href) 
          }
      };
     
    PV.symbolCatalog.register(definition); 
  })(window.PIVisualization); 
  