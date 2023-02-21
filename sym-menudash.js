(function (PV) {

  PV.deriveVisualizationFromBase(symbolVis);

  var definition = { 
    typeName: "menudash",
    displayName: 'Menu Dash',
	  iconUrl: '/Scripts/app/editor/symbols/ext/Icons/comm.png',
    visObjectType: symbolVis,
    datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
    getDefaultConfig: function(){ 
        return {
          Height: 1000,
          Width: 200,
          hrefkpi: '',
          hrefdisponibilidad: '',
          hrefeventos: '',
          hrefinicio: '',
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
      console.log("menu dash");
      let symbolHrefKpi = elem.find('#hrefkpi')[0];
      let symbolHrefDisponibilidad = elem.find('#hrefdisponibilidad')[0];
      let symbolHrefEventos = elem.find('#hrefeventos')[0];
      let symbolHrefInicio = elem.find('#hreffooter')[0];
      let newUniqueIDStringv4 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
      let newUniqueIDStringv5 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
      let newUniqueIDStringv6 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
      let newUniqueIDStringv7 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
      symbolHrefKpi.id = newUniqueIDStringv4;
      symbolHrefDisponibilidad.id = newUniqueIDStringv5;
      symbolHrefEventos.id = newUniqueIDStringv6;
      symbolHrefInicio.id = newUniqueIDStringv7;

      this.onDataUpdate = myCustomDataUpdateFunction;
      this.onConfigChange = myCustomConfigurationChangeFunction;

      function myCustomDataUpdateFunction(data) {
        let var1 = $(`#${symbolHrefKpi.id}`);
        let var2 = $(`#${symbolHrefDisponibilidad.id}`);
        let var3 = $(`#${symbolHrefEventos.id}`);
        let var4 = $(`#${symbolHrefInicio.id}`);
        var1.attr("href",scope.config.hrefkpi)
        var2.attr("href",scope.config.hrefdisponibilidad)
        var3.attr("href",scope.config.hrefeventos)
        var4.attr("href",scope.config.hrefinicio)
      }

      function myCustomConfigurationChangeFunction() {
        let var1 = $(`#${symbolHrefKpi.id}`);
        let var2 = $(`#${symbolHrefDisponibilidad.id}`);
        let var3 = $(`#${symbolHrefEventos.id}`);
        let var4 = $(`#${symbolHrefInicio.id}`);
        if (scope.config.hrefkpi) var1.attr(`${scope.config.hrefkpi}`)
        if (scope.config.hrefdisponibilidad) var2.attr("href",scope.config.hrefdisponibilidad) 
        if (scope.config.hrefeventos) var3.attr("href",scope.config.hrefeventos) 
        if (scope.config.hrefinicio) var4.attr("href",scope.config.hrefinicio) 
      }
    };
   
  PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
