(function(CS) {

    function symbolVis() {}
    CS.deriveVisualizationFromBase(symbolVis);

    var myCustomSymbolDefinition = {
        typeName: 'tablaparetto',
        displayName: 'Tabla Eventos',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        iconUrl: '/Scripts/app/editor/symbols/ext/icons/TablaEventosCOMM.png',
        // inject: ['timeProvider'],
        // supportsCollections: true,
        supportsDynamicSearchCriteria: true,
        
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                // DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 300,
                Width: 400,
                Intervals: 1000,
                // Mode: 'Compressed',
                FormatType: null,
                showDataItemNameCheckboxValue: true,
                showHeaderRightCheckboxValue: true,
                showDataItemNameCheckboxStyle: "table-cell",
                showTimestampCheckboxStyle: "table-cell",
                numberOfDecimalPlaces: 0,
                dataItemColumnColor: "black",
                headerRightTextColor: "#0A1C1A",
		        headerRightColumnColor: "white",
                valueColumnColor: "black",
                hoverColor: "lightgreen",
                evenRowColor: "darkgray",
                oddRowColor: "none",
                outsideBorderColor: "none",
                headerBackgroundColor: "#50555A",
                subheaderBackgroundColor: "#297C72",
                headerTextColor: "white",
                fontSize: '16',
                unitFontSize: 'px'
            };
        },
        configOptions: function() {
            return [{
                title: 'Format Symbol',
                mode: 'format'
            }];
        }      
    };

  
    
    
    symbolVis.prototype.init = function(scope, elem, timeProvider) {
            
            this.onDataUpdate = myCustomDataUpdateFunction;
            this.onConfigChange = myCustomConfigurationChangeFunction;
            console.log('\t[+]Tabla Eventos');
            var syContElement1 = elem.find('#container')[0];
            var newUniqueIDString1 = "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
            syContElement1.id = newUniqueIDString1;
            

            function myCustomDataUpdateFunction(data) {
                
                let dataFormat = data.Data[0].Values;

                let arrayData = [...new Set(dataFormat.map(el => el.Value.split('||')[0])) ].map(element => Object({
                        Label: element,
                        Incidents: dataFormat.filter(el => el.Value.includes(element)), 
                    })
                ).map(element => Object({
                        ...element,
                        Incidents: [...new Set(element.Incidents.map(el=> `${el.Value}`.split('||')[1]))],
                        Branch: (element.Incidents.filter(el => `${el.Time}`.includes('T00:00:00Z'))),
                    })
                ).map(element => Object({
                        ...element,
                        Values: element.Incidents.map(elemt => Object({
                            Incidents: elemt,
                            Count: dataFormat.filter(el => (el.Value.includes(`${element.Label}||${elemt}`))).length,
                            Time: dataFormat.filter(el => (el.Value.includes(`${element.Label}||${elemt}`))).reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.Value.split('||')[2]),0)
                        }))
                    })
                ).map(element => Object({
                    ...element,
                    Values: element.Incidents.map(el=> Object({
                        Value: `${el}||${element.Values.filter(elem => elem.Incidents == el)[0].Count}||${element.Values.filter(elem => elem.Incidents == el)[0].Time}||${formatTime(element.Values.filter(elem => elem.Incidents == el)[0].Time)}`,
                    })),
                    Time: new Date().toLocaleString()
                })).map(element => {
                    return Object({
                        ...element,
                        Quantity: element.Values.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.Value.split('||')[1]),0),
                        Minutes: element.Values.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.Value.split('||')[2]),0),
                        MinutesFormat: formatTime(element.Values.reduce((previousValue, currentValue) => previousValue + parseInt(currentValue.Value.split('||')[2]),0)),
                    })
                })
        
                let data_ = {
                    Data: arrayData.sort((a,b) => - a.Minutes + b.Minutes).filter(element => element.Label != 'No Data'),
                    SymbolName: "Symbol1"
                }
                console.log(" ~ file: sym-tablaparetto.js ~ line 116 ~ myCustomDataUpdateFunction ~ data_", data_)

                if (data) {
                    
                    $('#' + syContElement1.id).empty();
                     
                    let zeroHeaders = ['SINTOMA / ACTIVIDAD', 'CANTIDAD', 'TIEMPO (dias horas:min )'];

                    let headersRow = syContElement1.insertRow(-1);
                    
                    generatedRow( 'TIPO DE EVENTOS', headersRow ,zeroHeaders, 'headerAPCellClass cellAPClass', 'center', true, false);

                    for (let index = 0; index < data_.Data.length; index++) {
                        generatedMultiRow(data_.Data[index].Label, headersRow , dataToPush(data_,index));
                        generatedRow('', headersRow, ['Subtotal',data_.Data[index].Quantity,data_.Data[index].MinutesFormat], 'subtotalAPCellClass cellAPClass', 'center', false);
                    }
                    generatedRow('', headersRow, ['Total',data_.Data.reduce((previousValue, currentValue) => previousValue + currentValue.Quantity,0),formatTime(data_.Data.reduce((previousValue, currentValue) => previousValue + currentValue.Minutes,0))], 'headerAPCellClass cellAPClass', 'center', false);
                }
            }

            function getTotalData(totalOfArrays , arrayUnitOne , arrayUnitTwo){
                totalOfArrays.push('+');
                for(let index = 1 ; index < arrayUnitOne.length; index++){
                    index == 3|| index ==6 || index == 7 ?  
                    totalOfArrays.push((parseFloat(arrayUnitOne[index])+parseFloat(arrayUnitTwo[index])).toFixed(scope.config.numberOfDecimalPlaces)):
                    totalOfArrays.push(' ');
                };
                return totalOfArrays;
            }

            function dataToPush(data, index){
                data = data.Data[index].Values.sort((a,b)=> {
                    return - parseInt(a.Value.split('||')[2]) + parseInt(b.Value.split('||')[2])
                })
                return data.map(element => [element.Value.split('||')[0],element.Value.split('||')[1],element.Value.split('||')[3]])
            };

            function formatTime(time){
                var day = Math.floor (time / (24*60)); 
                var hour = Math.floor( (time - day*24*60)/60); 
                var minute = Math.floor( (time - day*24*60 - hour*60)); 
                return `${day == 0 ? '': `${day}d `}${hour}:${minute}`
            }

            function generatedRow(firstElement, insertRow, dataArray, nameClass, align, isHeader, isSubHeader){
                
                insertRow = syContElement1.insertRow(-1);
                let newCell = insertRow.insertCell(-1);
                newCell.innerHTML = firstElement;
                newCell.className = !isSubHeader ? "headerAPCellClass" : "subHeaderAPCellClass"
                 isHeader ? insertRow.className = "headerAPCellClass  cellAPClass" : insertRow.className = "rowAPClass cellAPClass myValueCellClass";
                
                return dataArray.forEach( filasItemCell => {
                    let newRowsInsert = insertRow.insertCell(-1);
                    newRowsInsert.innerHTML= filasItemCell;
                    newRowsInsert.className = nameClass;
                    newRowsInsert.style.textAlign = align;
                });
            }

            function generatedMultiRow(firstElement, insertRow, dataArray){
                dataArray.forEach( filasItemCell => {
                    generatedRow(firstElement, insertRow ,filasItemCell, 'cellAPClass myValueCellClass', 'center', false, true);
                });

                return true
            }

            function myCustomConfigurationChangeFunction(data) {
                document.getElementById(syContElement1.id).style.border = "3px solid " + scope.config.outsideBorderColor;
                if (scope.config.showHeaderRightCheckboxValue) {
                    scope.config.showHeaderRightCheckboxStyle = "table-cell";
                } else {
                    scope.config.showHeaderRightCheckboxStyle = "none";
                }
                if (scope.config.showDataItemNameCheckboxValue) {
                    scope.config.showDataItemNameCheckboxStyle = "table-cell";
                } else {
                    scope.config.showDataItemNameCheckboxStyle = "none";
                }
            }
        }
    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);