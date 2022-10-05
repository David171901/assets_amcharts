(function(PV) {
    
    function labelValue() {};
    PV.deriveVisualizationFromBase(labelValue);

    var definition = {
        typeName: "labelvalue",
        visObjectType: labelValue,
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: PV.Extensibility.Enums.DataQueryMode.ModePlotValues,
                customTitle: "",
                showSubtitle: false,
                showValue: false,
                showTime: false,
                fontSize: 16,
                Height: 500,
                Width: 300,
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
        let symbolCardTitle = elem.find('#card__title')[0];
        let symbolCardSubtitle = elem.find('#card__subtitle')[0];
        let symbolCardValue = elem.find('#card__value')[0];
        let symbolCardTime = elem.find('#card__time')[0];
        let newUniqueIDStringv1 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        let newUniqueIDStringv2 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        let newUniqueIDStringv3 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        let newUniqueIDStringv4 = "nuid_val_"+ Math.random().toString(36).substr(2, 16);
        symbolCardSubtitle.id = newUniqueIDStringv1;
        symbolCardValue.id = newUniqueIDStringv2;
        symbolCardTime.id = newUniqueIDStringv3;
        symbolCardTitle.id = newUniqueIDStringv4;
        
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;

        function myCustomDataUpdateFunction(data) {
            // console.log('label value',data);
            let depuredData = getDepuredData(data);
            let subtitleElement = $(`#${symbolCardSubtitle.id}`);
            let valueElement = $(`#${symbolCardValue.id}`);
            let timeElement = $(`#${symbolCardTime.id}`);
            subtitleElement.html(`${depuredData.Label.split('|')[0]}`)
            valueElement.html(`${parseFloat(depuredData.Value).toFixed(2)}${depuredData.Units}`)
            timeElement.html(`${depuredData.Time}`)
        }

        function getDepuredData(data){
            return  {
                ...data.Data[0].Values[data.Data[0].Values.length-1],
                "Label": "MOLINO PRIMARIO|TASA DE PARADAS",
                "Units": "%",
            };
        }

        function myCustomConfigurationChangeFunction() {
            let titleElement = $(`#${symbolCardTitle.id}`);
            let subtitleElement = $(`#${symbolCardSubtitle.id}`);
            let valueElement = $(`#${symbolCardValue.id}`);
            let timeElement = $(`#${symbolCardTime.id}`);

            if (scope.config.customTitle) {
                titleElement.html(`${scope.config.customTitle}`)
            }

            (scope.config.showSubtitle) ? 
                subtitleElement.addClass("d-none" ) : subtitleElement.removeClass("d-none" );

            (scope.config.showValue) ? 
                valueElement.addClass("d-none" ) : valueElement.removeClass("d-none" );

            (scope.config.showTime) ? 
                timeElement.addClass("d-none" ) : timeElement.removeClass("d-none" );

        }

    };

    PV.symbolCatalog.register(definition);
})(window.PIVisualization);