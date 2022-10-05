(function (PV) {

    function symbolVis() { };
    PV.deriveVisualizationFromBase(symbolVis);
  
      var definition = { 
          typeName: "ventilador",
          //iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
          visObjectType: symbolVis,
          datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
          getDefaultConfig: function() { 
              return { 
                  height: 80,
                  width: 80,
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
          console.log('[+] Ventilador Loaded');
          
          const ventiladorGif = '<img class="flex" src="./Scripts/app/editor/symbols/ext/content/images/ventiladorW.gif">';
          const ventiladorStatic = '<img class="flex" src="./Scripts/app/editor/symbols/ext/content/images/ventiladorNW.png">';
  
          let symbolContainerDiv = elem.find('#ventilador')[0];
          
          
          let newUniqueIDString = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
          symbolContainerDiv.id = newUniqueIDString;
  
  
          this.onDataUpdate = myCustomDataUpdateFunction;
  
          function myCustomDataUpdateFunction(data) {
              
              let isActive = data.Value;
              console.log('[+] Data >', data);
              let label = data.Label.split('|')[0];
              console.log('label> ', label);
              console.log('[+] Running or? > ', isActive);
              let container = $(`#${symbolContainerDiv.id}`);
               
              if (isActive == '1' || parseInt(isActive) == 1 || isActive == 'Sobrecarga' || isActive == 'Arrancando' || isActive == true || isActive == 'Active' || isActive == 'active' || isActive == 'true' || isActive == 'True' || isActive == 'Encendido' || isActive == 'encendido') {
                  isActive =1;
                  console.log('\t[+] Working ', isActive);
                  container.html(ventiladorGif);
                  
              } else {
                  isActive =0;
                  console.log('\t[-] No Working ', +isActive);
                  container.html(ventiladorStatic);
              }
              
              container.css({ 'height': scope.config.height });
              container.css({ 'width': scope.config.width });
              
          }
  
          function myCustomConfigurationChangeFunction() {
              let container = $(`#${symbolRunningDiv.id}`);
              container.css({ 'height': scope.config.height});
              container.css({ 'width': scope.config.width});
          }
  
      };
     
    PV.symbolCatalog.register(definition); 
  })(window.PIVisualization); 
  