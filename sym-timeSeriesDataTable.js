(function(CS) {
    	
    var myCustomSymbolDefinition = {
        
        typeName: 'timeSeriesDataTable',
        displayName: 'Time Series Data Table',
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,

        visObjectType: symbolVis,
  
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                Height: 300,
                Width: 400,
                Intervals: 1000,
                showDataItemNameCheckboxValue: true,
                showTimestampCheckboxValue: true,
                showDataItemNameCheckboxStyle: "table-cell",
                showTimestampCheckboxStyle: "table-cell",
                numberOfDecimalPlaces: 2,
                dataItemColumnColor: "cyan",
                timestampColumnColor: "lightgray",
                valueColumnColor: "lightgreen",
                hoverColor: "darkslategray",
                evenRowColor: "darkgray",
                oddRowColor: "none",
                outsideBorderColor: "none",
                headerBackgroundColor: "white",
                headerTextColor: "red",
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

        var symbolContainerElement = elem.find('#container')[0];
        var newUniqueIDString = "myCustomSymbol_" + Math.random().toString(36).substr(2, 16);
            
        symbolContainerElement.id = newUniqueIDString;
            

        let isFirstLoad = true;
        let labels = [];
        let units = [];
        
        function myCustomDataUpdateFunction(data) {
               
            if (data) {
                   
                $('#' + symbolContainerElement.id).empty();

                if (isFirstLoad) {
                    data.Data.forEach(element => {

                        if (element.Path) {
                            labels.push((element.Path.split("|"))[1]);
                        }

                        if (element.Units) {
                            units.push(element.Units);
                        }

                    });
                }
                
                isFirstLoad = false;
                let dates = [];

                data.Data[0].Values.forEach(item => { dates.push(item.Time); });
                //let auxiliar = dates.filter(aux => aux.split(" ")[1].split(":")[0] != 12 &&  aux.split(" ")[1].split(":")[0] != 0  );
            
                //dates = auxiliar;
                dates = dates.reverse();

                let headersRow = symbolContainerElement.insertRow(-1);
                headersRow.className = "myCustomRowClass";

                let dataItemHeaderCell = headersRow.insertCell(-1);
                dataItemHeaderCell.innerHTML = "<b>Fecha</b>";
                dataItemHeaderCell.className = "myCustomCellClass myCustomHeaderCellClass";

                labels.forEach(element => {
                    let timeStampHeaderCell = headersRow.insertCell(-1);
                    timeStampHeaderCell.innerHTML = `<b>${element}</b>`;
                    timeStampHeaderCell.className = "myCustomCellClass myCustomHeaderCellClass";
                });

                dates.forEach(date => {
                    let newRow = symbolContainerElement.insertRow(-1);
                    newRow.className = "myCustomRowClass";
                    let timeStampCell = newRow.insertCell(-1);

                    if (typeof(date) == "string") {
                        timeStampCell.innerHTML = (date);
                    } else {
                        timeStampCell.innerHTML = myFormatTimestampFunction(date);
                    }
                    
                    timeStampCell.className = "myCustomCellClass myCustomTimestampCellClass";

                    data.Data.forEach(tagitem => {

                        let valueCell = newRow.insertCell(-1);
                        let newInnerHTMLString = "";
                        let currentDateItem = tagitem.Values.find(o => o.Time == date);
                        if (currentDateItem) {
                            try {
                                newInnerHTMLString = parseFloat(("" + currentDateItem.Value).replace(",", ".")).toFixed(scope.config.numberOfDecimalPlaces);
                            } catch (err) {
                                newInnerHTMLString = currentDateItem.Value;
                            }
                            if (newInnerHTMLString == "NaN") {
                                newInnerHTMLString = currentDateItem.Value;
                            }
                        }

                        valueCell.innerHTML = newInnerHTMLString;
                        valueCell.className = "myCustomCellClass myCustomValueCellClass";
                        valueCell.style.textAlign = "center";

                    });

                }, data.Data);
            }
        }

        var myMonthAbbreviationsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        function myFormatTimestampFunction(rawTime) {

            var MyDateObject = new Date(0);
            MyDateObject.setUTCSeconds(rawTime);
            
            var MyDateString = "";
            MyDateString = myPrependZeroIfNeededFunction(MyDateObject.getDate()) +
                "-" +
                myMonthAbbreviationsArray[MyDateObject.getMonth()] +
                "-" +
                MyDateObject.getFullYear() +
                " " +
                myPrependZeroIfNeededFunction(MyDateObject.getHours()) +
                ":" +
                myPrependZeroIfNeededFunction(MyDateObject.getMinutes()) +
                ":" +
                myPrependZeroIfNeededFunction(MyDateObject.getSeconds());
                return MyDateString;
            }
        
            function myPrependZeroIfNeededFunction(MyNumber) {
                if (MyNumber < 10) return ("0" + MyNumber);
                else return (MyNumber); 
            }
           
            function myCustomConfigurationChangeFunction(data) {
                
                document.getElementById(symbolContainerElement.id).style.border = "3px solid " + scope.config.outsideBorderColor;
                document.getElementById(symbolContainerElement.id).style.borderRadius = "2em";
                
                if (scope.config.showTimestampCheckboxValue) {
                    scope.config.showTimestampCheckboxStyle = "table-cell";
                } else {
                    scope.config.showTimestampCheckboxStyle = "none";
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