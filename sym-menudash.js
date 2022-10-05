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
      let symbolKpi = elem.find('#kpi')[0];
      let symbolDisponibilidad = elem.find('#disponibilidad')[0];
      let symbolEventos = elem.find('#eventos')[0];
      let newUniqueIDStringv1 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
      let newUniqueIDStringv2 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
      let newUniqueIDStringv3 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
      symbolKpi.id = newUniqueIDStringv1;
      symbolDisponibilidad.id = newUniqueIDStringv2;
      symbolEventos.id = newUniqueIDStringv3;

      this.onDataUpdate = myCustomDataUpdateFunction;

      function myCustomDataUpdateFunction(data) {
        let kpiElement = $(`#${symbolKpi.id}`);
        let disponibilidadElement = $(`#${symbolDisponibilidad.id}`);
        let eventosElement = $(`#${symbolEventos.id}`);
        switch (window.location.href) {
          case 'https://pivision.volcan.com.pe/PIVision/#/Displays/50498/YAULI_MTTO_MOLINO_PRIMARIO_2':
            kpiElement.addClass( "link__navbar--active");
            break;
          case 'https://pivision.volcan.com.pe/PIVision/#/Displays/50501/YAULI_MTTO_MOLINO_PRIMARIO_3':
            disponibilidadElement.addClass( "link__navbar--active");
            break;
          case 'https://pivision.volcan.com.pe/PIVision/#/Displays/50502/YAULI_MTTO_MOLINO_PRIMARIO_4':
            eventosElement.addClass( "link__navbar--active");
            break;
          default:
            break;
        }

      }
    };
   
  PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
