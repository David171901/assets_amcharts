(function(PV) {
    
    function molinoVis() {};
    PV.deriveVisualizationFromBase(molinoVis);

    var definition = {
        typeName: "InteractiveMolino",
        visObjectType: molinoVis,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 200,
                Width: 150
            }
        },
        configOptions: function() {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        }
    }
    
    function symbolVis() {};
    PV.deriveVisualizationFromBase(symbolVis);

    molinoVis.prototype.init = function(scope, elem) {
        
        const molinoGif = '<img class="img-fluid h-100 w-100 position-absolute" src="./Scripts/app/editor/symbols/ext/content/images/molino.gif">';
        const molinoStatic = '<img class="img-fluid h-100 w-100 position-absolute" src="./Scripts/app/editor/symbols/ext/content/images/molino-static.png">';
        
        let symbolContainerDiv = elem.find('#molinoContainer')[0];
        let newUniqueIDString = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        symbolContainerDiv.id = newUniqueIDString;
        
        this.onDataUpdate = myCustomDataUpdateFunction;

        function myCustomDataUpdateFunction(data) {
            
            let depuredData = getDepuredData(data);
            let isActive = depuredData[depuredData.length-1].Value;
            let container = $(`#${symbolContainerDiv.id}`);

            if (isActive == '1' || isActive == 1 || isActive == 'Sobrecarga' || isActive == 'Arrancando' || isActive == true || isActive == 'Active' || isActive == 'active' || isActive == 'true' || isActive == 'True' || isActive == 'Encendido' || isActive == 'encendido') {
                container.html(molinoGif);
            } else {
                container.html(molinoStatic);
            }
        }

        function getDepuredData(data){
            return  data.Data[0].Values.filter(item => item.IsGood != false );
        }
    };

    PV.symbolCatalog.register(definition);
})(window.PIVisualization);