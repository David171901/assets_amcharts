(function(CS) {
    
    var myCustomSymbolDefinition = {
        typeName: 'courierTable',
        displayName: 'Leyes Courier',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        supportsCollections: true,
        supportsDynamicSearchCriteria: true,
        
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 300,
                Width: 400,
                Intervals: 1000,
                Mode: 'Compressed',
                showDataItemCourierStyle: "table-cell",
                numberOfDecimalPlaces: 2,
                dataItemCourierColumnColor: "black",
                showDataItemCourierValue: true,
                valueCourierColumnColor: "black",
                hoverCourierColor: "lightgreen",
                evenCourierRowColor: "darkgray",
                oddCourierRowColor: "none",
                outsideCourierBorderColor: "none",
                headerCourierBackgroundColor: "black",
                headerCourierTextColor: "white",
            };
        },
        configOptions: function() {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        }      
    };

  
    
    function symbolVis() {}
    CS.deriveVisualizationFromBase(symbolVis);
    symbolVis.prototype.init = function(scope, elem) {
            
            this.onDataUpdate = myCustomDataUpdateFunction;
            this.onConfigChange = myCustomConfigurationChangeFunction;
            console.log('\t[+]Courier Loaded');
            var syContElement1 = elem.find('#container')[0];
            var newUniqueIDString1 = "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
            syContElement1.id = newUniqueIDString1;
            

            function myCustomDataUpdateFunction(data) {
                if (data) {
                    
                    $('#' + syContElement1.id).empty();
                     
                  
                    let firstHeaders = ['ITEM', 'COBRE', 'PLOMO', 'ZINC', 'PLATA', 'HIERRO', 'SÓLIDOS', 'FLUJO'];
                    let filaCabezaBulk = ['CABEZA BULK'];
                    let filaConcentradoZinc = ['CONCENTRADO ZINC'];
                    let filaRelaveFinal = ['RELAVE FINAL'] ;
                  
                    filaCabezaBulk = pushToPushData(data, 0, 7, filaCabezaBulk);
                    filaConcentradoZinc = pushToPushData(data, 7, 14, filaConcentradoZinc);
                    filaRelaveFinal = pushToPushData(data, 14, 21, filaRelaveFinal);
                    
                
                    let headersRow = syContElement1.insertRow(-1);
                    generatedRow(headersRow, firstHeaders, "headerCourierCellClass cellCourierClass ", "center");
                    generatedRow(headersRow, filaCabezaBulk, "childrenCourierClass cellCourierClass dataItemCourierCellClass rowCourierClass", "center");
                    generatedRow(headersRow, filaConcentradoZinc, "childrenCourierClass cellCourierClass dataItemCourierCellClass rowCourierClass", "center");
                    generatedRow(headersRow, filaRelaveFinal, "childrenCourierClass cellCourierClass dataItemCourierCellClass rowCourierClass", "center");
                }
                   
            }

            function pushToPushData(data, init, limit,filasToPush){
                for(item = init; item < limit; item++){  
                    let arrayToExtract = data.Data[item];
                    let elementToPush = getValue( arrayToExtract, item);
                    filasToPush.push(elementToPush);
                }
                return filasToPush;
            }


            function getValue(elementToGetValue, item){
                let unidad = ' %';

                if(item == 3 || item == 10 || item == 17){
                    unidad = ' Onz/Ton';
                }else{
                    if(item == 6 || item == 13 || item == 20){
                        unidad = ' L/min';
                    }
                }
                
                return parseFloat((elementToGetValue.Values[elementToGetValue.Values.length-1].Value).replace(',','.')).toFixed(scope.config.numberOfDecimalPlaces).toString() + unidad;
            };

            function generatedRow(headersRow, dataArray, nombreClase, alineacion){
                headersRow = syContElement1.insertRow(-1);
                
                return dataArray.forEach( filasItemCell => {
                    let filasNewRows = headersRow.insertCell(-1);
                    filasNewRows.innerHTML= filasItemCell;
                    filasNewRows.className = nombreClase;
                    filasNewRows.style.textAlign = alineacion;
                });
            }

            function myCustomConfigurationChangeFunction(data) {
                document.getElementById(syContElement1.id).style.border = "3px solid " + scope.config.outsideBorderColor;
                document.getElementById(syContElement1.id).style.borderRadius = "2em";
                if (scope.config.showDataItemCourierValue) {
                    scope.config.showDataItemCourierStyle = "table-cell";
                } else {
                    scope.config.showDataItemNameCheckboxStyle = "none";
                }
            }
        }
    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);