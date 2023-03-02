(function (CS) {
  var myCustomSymbolDefinition = {
    typeName: "tableconteo",
    displayName: "Table Conteo",
    inject: ["timeProvider"],
    datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
    visObjectType: symbolVis,
    getDefaultConfig: function () {
      return {
        DataShape: "TimeSeries",
        DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
        Height: 300,
        Width: 400,
        Intervals: 1000,
        showDataItemNameCheckboxValue: true,
        showHeaderRightCheckboxValue: true,
        showDataItemNameCheckboxStyle: "table-cell",
        showTimestampCheckboxStyle: "table-cell",
        numberOfDecimalPlaces: 0,
        dataItemColumnColor: "black",
        headerRightTextColor: "black",
        headerRightColumnColor: "white",
        valueColumnColor: "black",
        hoverColor: "lightgreen",
        evenRowColor: "darkgray",
        oddRowColor: "none",
        outsideBorderColor: "none",
        headerBackgroundColor: "black",
        headerTextColor: "white",
        fontSize: "16",
        unitFontSize: "px",
      };
    },
    configOptions: function () {
      return [
        {
          title: "Format Symbol",
          mode: "format",
        },
      ];
    },
  };

  function symbolVis() {}
  CS.deriveVisualizationFromBase(symbolVis);
  symbolVis.prototype.init = function (scope, elem, timeProvider) {
    this.onDataUpdate = myCustomDataUpdateFunction;
    this.onConfigChange = myCustomConfigurationChangeFunction;
    console.log("\t[+]Table Conteo");
    var syContElement1 = elem.find("#container")[0];
    var newUniqueIDString1 =
      "myCustomSymbol_1" + Math.random().toString(36).substr(2, 16);
    syContElement1.id = newUniqueIDString1;

    function myCustomDataUpdateFunction(data) {
      console.log(" ~ file: sym-tableconteo.js:60 ~ myCustomDataUpdateFunction ~ data:", data)
      if (data) {
        let url = obtenerURL();
        let urlChungar = "https://pivision.volcan.com.pe/PIVision/#/Displays/50644/RENDIMIENTO-PLANTA-CHUNGAR";
        // Datos iniciales
        // formatTwoArraysInOne(sumatoriaDosDataArrayPorFecha(data.Data[12].Values,data.Data[13].Values),data.Data[11]);
        let endDateConditional = timeProvider.displayTime.end != "*"
        ? new Date(timeProvider.displayTime.end)
        : new Date();
        let conditionalJoin = (endDateConditional.getMonth() == new Date().getMonth())
        let dataDryTons = (url == urlChungar) ? formatTwoArraysInOne(sumatoriaDosDataArrayPorFecha(data.Data[0].Values,data.Data[1].Values),data.Data[2], conditionalJoin).Values : data.Data[0].Values;
        console.log(" ~ file: sym-tableconteo.js:63 ~ myCustomDataUpdateFunction ~ dataDryTons:", dataDryTons)
        
        if (url != urlChungar) {
          dataDryTons.shift();
          dataDryTons.shift();
        } else {
          // dataDryTons.shift();
          // dataDryTons.pop();
        }
        let lengthDataDryTons = dataDryTons.length;
        dataDryTons = dataDryTons.filter((el) => el.Value != 0);
        dataDryTons = dataDryTons.map((el) => el.Value.replace(",", ""));
        let dataTargetUp = (url == urlChungar) ? 5775 : 5623; // data.Data[1].Values[0].Value
        let dataTargetDown = (url == urlChungar) ? 5238 : 5296; // data.Data[2].Values[0].Value

        let dataDryTonsUp = dataDryTons.filter((el) => el > dataTargetUp);
        let dataDryTonsDown = dataDryTons.filter((el) => el < dataTargetDown && el > 100);
        let dataDryTonsRegular = dataDryTons.filter(
          (el) => el > dataTargetDown && el < dataTargetUp
        );

        let cellA1 = dataDryTonsUp.length;
        let cellA2 = dataDryTonsRegular.length;
        let cellA3 = dataDryTonsDown.length;
        let cellB1 = dataDryTonsUp.reduce(
          (accumulator, currentValue, currentIndex, array) =>
            (parseFloat(accumulator) + parseFloat(currentValue)),
          0
        )  / dataDryTonsUp.length;
        if(isNaN(cellB1)) cellB1 = 0;
        let cellB2 = dataDryTonsRegular.reduce(
          (accumulator, currentValue, currentIndex, array) =>
            (parseFloat(accumulator) + parseFloat(currentValue)), 
          0
        )/ dataDryTonsRegular.length;
        if(isNaN(cellB2)) cellB2 = 0;
        let cellB3 = dataDryTonsDown.reduce(
          (accumulator, currentValue, currentIndex, array) =>
            (parseFloat(accumulator) + parseFloat(currentValue)),
          0
        ) / dataDryTonsDown.length;
        if(isNaN(cellB3)) cellB3 = 0;
        let cellC1 = cellB1 - dataTargetUp;
        if(cellC1 < 0) cellC1 = 0;
        let cellC2 = 0;
        let cellC3 = dataTargetDown - cellB3;

        let cellB4 = cellC3 * cellA3 - cellC1 * cellA1;

        $("#" + syContElement1.id).empty();

        let zeroHeaders = ["Dias", "Prom. TMS", "Diferencia"]; //,Columnas;

        let row1 = [cellA1.toFixed(0), cellB1.toFixed(scope.config.numberOfDecimalPlaces), cellC1.toFixed(scope.config.numberOfDecimalPlaces)];
        let row2 = [cellA2.toFixed(0), cellB2.toFixed(scope.config.numberOfDecimalPlaces), cellC2.toFixed(scope.config.numberOfDecimalPlaces)];
        let row3 = [cellA3.toFixed(0), cellB3.toFixed(scope.config.numberOfDecimalPlaces), cellC3.toFixed(scope.config.numberOfDecimalPlaces)];
        let row4 = [lengthDataDryTons.toFixed(scope.config.numberOfDecimalPlaces), cellB4.toFixed(scope.config.numberOfDecimalPlaces), ""];

        //     let totalMINE = [];
        //     totalMINE = getTotalData(totalMINE, ruteSCAND, ruteCARAND);

        let headersRow = syContElement1.insertRow(-1);

        generatedRow(
          "Comportamiento",
          headersRow,
          zeroHeaders,
          "headerAPCellClass cellAPClass",
          "center",
          true
        );
        generatedRow(
          "Por encima del Limite esperado",
          headersRow,
          row1,
          "myValueCellClass",
          false
        ); // 'center', false);// 'cellAPClass myValueCellClass', 'center', false);
        generatedRow(
          "Dentro del Limite esperado",
          headersRow,
          row2,
          "myValueCellClass",
          false
        ); // 'cellAPClass myValueCellClass', 'center', false);
        generatedRow(
          "Por debajo del Limite esperado",
          headersRow,
          row3,
          "myValueCellClass",
          false
        ); 
        generatedRow(
            "Se dejo de producir (TMS)",
            headersRow,
            row4,
            "myValueCellClass",
            false
          );
        // 'cellAPClass myValueCellClass', 'center', false);
        //    // generatedRow('Total', headersRow, totalMINE, 'myCustomRightHeaderCellClass cellAPClass myValueCellClass', 'center', true);
      }
    }

    function generarFechasIntermedias(fechaInicio, fechaFin) {
      console.log(" ~ file: sym-tableconteo.js:171 ~ generarFechasIntermedias ~ fechaInicio, fechaFin:", fechaInicio, fechaFin)
      const fechas = [];
    
      // Convertir las fechas a objetos Date
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);
    
      // Iterar sobre el rango de fechas y agregar cada fecha al array
      let fechaActual = new Date(fechaInicioObj);
      fechaActual.setDate(fechaActual.getDate() + 1);
      while (fechaActual <= fechaFinObj) {
        const fechaFormateada = `${fechaActual.getDate()}/${fechaActual.getMonth()+1}/${fechaActual.getFullYear()}` + ' 00:00:00' 
        fechas.push(fechaFormateada);
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    
      return fechas;
    }

    function sumatoriaDosDataArrayPorFecha (data1, data2) {
      let startDate = timeProvider.displayTime.start;
      let endDate = timeProvider.displayTime.end != "*"
        ? new Date(timeProvider.displayTime.end)
        : new Date();
      const fechasIntermedias = generarFechasIntermedias(startDate, endDate);
      let arrayValues = [];
      fechasIntermedias.forEach(el => {
        let dataValue1 = data1.filter(elem => elem.Time.split(' ')[0] == el.split(' ')[0])[0] ? data1.filter(elem => {
          return elem.Time.split(' ')[0] == el.split(' ')[0]
        })[0].Value.replace(',','') : 0;
        let dataValue2 = data2.filter(elem => elem.Time.split(' ')[0] == el.split(' ')[0])[0] ? data2.filter(elem => elem.Time.split(' ')[0] == el.split(' ')[0])[0].Value.replace(',','') : 0;
        
        arrayValues.push({
          Value: (el == '2023-01-29') ? 0 : (parseFloat(dataValue1) + parseFloat(dataValue2)).toString(),
          Time: `${el}T19:00:00.000Z`,
        })
      })

      console.log(" ~ file: sym-tableconteo.js:199 ~ sumatoriaDosDataArrayPorFecha ~ arrayValues:", arrayValues)
          
      return {
        DataType: "Float",
        DisplayDigits: -5,
        EndTime: "2023-01-12T19:11:51.857Z",
        Label: "03 PLANTA CONCENTRADORA|SUMA TONELAJE G2",
        Maximum: 0,
        Minimum: 0,
        Path: "af:\\\\CDPMS16\\BASE DE DATOS PI ASSET FRAMEWORK - PLANTA DE OXIDOS\\PLANTA CONCENTRADORA CHUNGAR\\00 KPIs CLAVE\\03 PLANTA CONCENTRADORA|SUMA TONELAJE G2",
        StartTime: "2023-01-01T00:00:00Z",
        Values: arrayValues,
      };
    }

    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    function formatTwoArraysInOne (value1, value2, conditional) {
      // value1 Estatico
      // value2 Real
      let lastValue2 = value2.Values.at(-1);
      if(conditional) { return {
        ...value1,
        Values: [...value1.Values, lastValue2]
      }} else {
        return {
          ...value1,
          Values: [...value1.Values]
        }
      }
    }

    function obtenerURL() {
      var url = window.location.href;
      return url;
    }

    function getTotalData(totalOfArrays, arrayUnitOne, arrayUnitTwo) {
      for (let index = 0; index < arrayUnitOne.length; index++) {
        totalOfArrays.push(
          (
            parseFloat(arrayUnitOne[index]) + parseFloat(arrayUnitTwo[index])
          ).toFixed(scope.config.numberOfDecimalPlaces)
        );
      }
      return totalOfArrays;
    }

    function dataToPush(arrayColector, data, indexMin, indexMax) {
      for (let selector = indexMin; selector < indexMax; selector++) {
        arrayColector.push(
          parseFloat(
            data.Data[selector].Values[
              data.Data[selector].Values.length - 1
            ].Value.replace(",", "")
          ).toFixed(scope.config.numberOfDecimalPlaces)
        );
      }
      return arrayColector;
    }

    function generatedRow(
      firstElement,
      insertRow,
      dataArray,
      nameClass,
      align,
      isHeader
    ) {
      insertRow = syContElement1.insertRow(-1);
      let newCell = insertRow.insertCell(-1);
      newCell.innerHTML = firstElement;
      newCell.className = "headerAPCellClass";
      isHeader
        ? (insertRow.className = "headerAPCellClass  cellAPClass")
        : (insertRow.className = "rowAPClass cellAPClass myValueCellClass");

      return dataArray.forEach((filasItemCell) => {
        let newRowsInsert = insertRow.insertCell(-1);
        newRowsInsert.innerHTML = filasItemCell;
        newRowsInsert.className = nameClass;
        newRowsInsert.style.textAlign = align;
      });
    }

    function myCustomConfigurationChangeFunction(data) {
      document.getElementById(syContElement1.id).style.border =
        "3px solid " + scope.config.outsideBorderColor;
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
  };
  CS.symbolCatalog.register(myCustomSymbolDefinition);
})(window.PIVisualization);
