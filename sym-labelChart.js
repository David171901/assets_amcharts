(function(PV) {
    
    function labelValue() {};
    PV.deriveVisualizationFromBase(labelValue);

    var definition = {
        typeName: "labelChart",
        displayName: "Value",
        iconUrl: "/Scripts/app/editor/symbols/ext/icons/labelChartCOMM.png",
        visObjectType: labelValue,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModePlotValues,
                customTitle: "",
                showValue: false,
                fontSize: 16,
                Height: 500,
                Width: 300,
                unit: '',
                color: '#3AB8A8',
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

    labelValue.prototype.init = function(scope, elem) {
        
        console.log('\t[+]label value');
        let isFirts = true;
        let prevJson;
        let symbolCardTitle = elem.find('#card__title')[0];
        let symbolCardValue = elem.find('#card__value')[0];
        let newUniqueIDStringv2 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        let newUniqueIDStringv4 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        symbolCardValue.id = newUniqueIDStringv2;
        symbolCardTitle.id = newUniqueIDStringv4;
        
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;

        function myCustomDataUpdateFunction(data) {
            let depuredData = getDepuredData(data);
            console.log(" ~ file: sym-labelChart.js:52 ~ myCustomDataUpdateFunction ~ depuredData", depuredData)
            let valueElement = $(`#${symbolCardValue.id}`);
            valueElement.html(`${parseFloat(depuredData.Value).toFixed(2)} ${depuredData.Units}`);
            
            let titleElement = $(`#${symbolCardTitle.id}`);
            titleElement.html(`${depuredData.Label}`);
        }

        function getDepuredData(data){
            let json;   
            if( isFirts ) {
                prevJson  = {
                    ...data.Data[0],
                    Label:  data.Data[0].Label.split('|')[1],
                }
                json = {
                    ...prevJson,
                    Value: data.Data[0].Values[data.Data[0].Values.length-1].Value,
                }
                isFirts = false;
            } else {
                json = {
                    ...prevJson,
                    Value: data.Data[0].Values[data.Data[0].Values.length-1].Value,
                }
            }
            return json;
        }

        function myCustomConfigurationChangeFunction() {
            let valueElement = $(`#${symbolCardValue.id}`);

            (scope.config.showValue) ? 
                valueElement.addClass("d-none" ) : valueElement.removeClass("d-none" );

        }

    };

    PV.symbolCatalog.register(definition);
})(window.PIVisualization);