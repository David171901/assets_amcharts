(function(CS) {
    var myCustomSymbolDefinition = {
        typeName: 'balMetalYauli',
        displayName: 'Balance Metalúrgico Yauli',
        inject: ['timeProvider'],
        datasourceBehavior: CS.Extensibility.Enums.DatasourceBehaviors.Multiple,
        visObjectType: symbolVis,
        
        getDefaultConfig: function() {
            return {
                DataShape: 'TimeSeries',
                DataQueryMode: CS.Extensibility.Enums.DataQueryMode.ModePlotValues,
                Height: 300,
                Width: 400,
                Intervals: 1000,
                FormatType: null,
                showDataItemNameCheckboxValue: true,
                showBalMetalCheckboxValue: true,
                showDataItemNameCheckboxStyle: "table-cell",
                showBalMetalCheckboxStyle: "table-cell",
                numberOfDecimalPlaces: 2,
                valueBalMetalColumnColor: "black",
                hoverBalMetalColor: "lightgreen",
                evenBalMetalRowColor: "darkgray",
                oddBalMetalRowColor: "none",
                outsideBalMetalBorderColor: "none",
                headerBalMetalBackgroundColor: "black",
                balMetalHeaderTextColor: "white",
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
    
    
    symbolVis.prototype.init = function(scope, elem, timeProvider) {
        
        this.onDataUpdate = myCustomDataUpdateFunction;
        this.onConfigChange = myCustomConfigurationChangeFunction;
        
        scope.config.FormatType = null;
        console.log('\t[+]Balance Yauli Loaded');
        
        var syContElement1 = elem.find('#container')[0];
        var newUniqueIDString1 = 'myCustomSymbol_1' + Math.random().toString(36).substr(2, 16);
        
        syContElement1.id = newUniqueIDString1;

        class objectRow {
            constructor(head, unit, day, planD, month, planM, decimal){
                this.head = head;
                this.unit = unit;
                this.day = parseFloat(day).toFixed(decimal);
                this.planD = planD.toFixed(decimal);
                this.varD = (this.day - this.planD).toFixed(decimal);
                this.month = parseFloat(month).toFixed(decimal);
                this.planM = planM.toFixed(decimal);
                this.varM = (this.month - this.planM).toFixed(decimal);
            };

            get arObject(){
                return [this.head, this.unit, this.day, this.planD, this.varD, this.month, this.planM, this.varM];
            };
        };

        const getPlanValue = (trusth, index) => { return parseFloat(trusth[index].at(-1).Value)};

        const getPlanTms = (trusthData, indexA, indexB) => {return getPlanValue(trusthData,  indexA) + getPlanValue(trusthData, indexB)};

        const getPlanLey = (trusthData, tmsMcar, tmsMscr, indexA, indexB, ag) => {
            const metalProd = ((getPlanValue(trusthData, indexA) * tmsMcar) + (getPlanValue(trusthData, indexB) * tmsMscr));
            const headLey = metalProd / (tmsMcar + tmsMscr);
            return ag ? [headLey, metalProd]: [headLey, metalProd/100];
        };

        const getPlanRecovery = (headArray, elementArray) => {return elementArray[1] / headArray[1] * 100};

        const getSilverPlanRecovery = (planHeadAg, planZincAg, planPlomoAg, planCobreAg) => {
           return (getPlanRecovery(planHeadAg, planZincAg) + getPlanRecovery(planHeadAg, planPlomoAg) + getPlanRecovery(planHeadAg, planCobreAg));
        };

        const getDailyValue = (value) => {return (value / 28 / 2)};

        const getMonthlyValue = (value) => {return (value /28 * 12)};

        const getValue = (turn, dateToCompare, depure) => {
            if(turn.length != 0 && dateToCompare != null && depure != null){
            let haveDate = depure.filter(item => new Date(item.Time).getDate() == dateToCompare.getDate() && new Date(item.Time).getMonth()+1 == dateToCompare.getMonth()+1);
        
            if (haveDate.length != 0) return 0;
            else return turn.filter(item => new Date(item.Time).getDate() == dateToCompare.getDate() && new Date(item.Time).getMonth()+1 == dateToCompare.getMonth()+1).length != 0 ?   
            parseFloat(turn.filter(item => new Date(item.Time).getDate() == dateToCompare.getDate() && new Date(item.Time).getMonth()+1 == dateToCompare.getMonth()+1)[0].Value) : 0}
            else return turn.length != 0 ? turn[turn.length-1].Value : 0;
        };

        const getHeadElement = (index, turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyA, tmsDailyB) => {
            let headElement = 0;
            let headElementA = getValue(turnA[index], endDate, ticlioTurnA);
            let headElementB = getValue(turnB[index], endDate, ticlioTurnB);
            (tmsDailyA + tmsDailyB) != 0 ? headElement = ((headElementA * tmsDailyA) + (headElementB * tmsDailyB)) / (tmsDailyA + tmsDailyB) : 0 ;
            return parseFloat(headElement) ;  
        };

        const getEndDate = (turnA , turnB, ticlioTurnA, ticlioTurnB) => {
        console.log(" ~ file: sym-balMetalYauli.js:113 ~ getEndDate ~ turnA , turnB, ticlioTurnA, ticlioTurnB", turnA , turnB, ticlioTurnA, ticlioTurnB)
    
            let turnTA = turnA.length > 0 ? turnA[turnA.length-1].Time : null;
            console.log(" ~ file: sym-balMetalYauli.js:116 ~ getEndDate ~ turnTA", turnTA)
            let turnTB = turnB.length > 0 ? turnB[turnB.length-1].Time : null;
            console.log(" ~ file: sym-balMetalYauli.js:118 ~ getEndDate ~ turnTB", turnTB)
           
            let ticlioA = ticlioTurnA.length > 0 ? ticlioTurnA[ticlioTurnA.length-1].Time : null;
            console.log(" ~ file: sym-balMetalYauli.js:121 ~ getEndDate ~ ticlioA", ticlioA)
            let ticlioB = ticlioTurnB.length > 0 ? ticlioTurnB[ticlioTurnB.length-1].Time : null;
            console.log(" ~ file: sym-balMetalYauli.js:123 ~ getEndDate ~ ticlioB", ticlioB)
            
            if(turnTA != null && turnTA != ticlioA) dateToReturn = turnTA;
            else dateToReturn = turnTB != ticlioB ? turnTB : turnA[turnA.length-1].Time;
            console.log(" ~ file: sym-balMetalYauli.js:127 ~ getEndDate ~ dateToReturn", dateToReturn)
            
            return dateToReturn;
        };

        const getTotalRelave = (indexRelave, indexTMS, indexZinc, indexLead ,indexCupper, turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB) => {
            let totalRelave = 0;  
            startDate = new Date(timeProvider.displayTime.start);
            while(startDate.getTime() <= endDate.getTime()){
                startDate.setDate(startDate.getDate()+1);
                let tmsGeneralA = getValue(turnA[indexTMS], startDate, ticlioTurnA) - 
                (getValue(turnA[indexZinc],startDate,ticlioTurnA) + getValue(turnA[indexLead],startDate,ticlioTurnA) + getValue(turnA[indexCupper],startDate,ticlioTurnA));
                
                let tmsGeneralB = getValue(turnB[indexTMS], startDate, ticlioTurnB) - 
                (getValue(turnB[indexZinc],startDate,ticlioTurnB) + getValue(turnB[indexLead],startDate,ticlioTurnB) + getValue(turnB[indexCupper],startDate,ticlioTurnB));
                
                let tmsGeneral = tmsGeneralA + tmsGeneralB;
                let headOfElement = getHeadElement(indexRelave , turnA, turnB, startDate, ticlioTurnA, ticlioTurnB, tmsGeneralA, tmsGeneralB);
                totalRelave += headOfElement * tmsGeneral;
            }

            return parseFloat(totalRelave);
       };

       const getMetalElement = (headElement, totalTmsDaily) => { return parseFloat(headElement * totalTmsDaily / 100)};

       const getTotalMetal = (indexLey, indexTms,turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB) => {
            let totalMetal = 0;
            startDate = new Date(timeProvider.displayTime.start);
        
            while(startDate.getTime() <= endDate.getTime()){
                startDate.setDate(startDate.getDate()+1);
                let tmsDailyA = getValue(turnA[indexTms], startDate, ticlioTurnA);
                let tmsDailyB = getValue(turnB[indexTms], startDate, ticlioTurnB);
                let tmsTotalOfThisDay = tmsDailyA + tmsDailyB;
                let headOfElement = getHeadElement(indexLey , turnA, turnB, startDate, ticlioTurnA, ticlioTurnB, tmsDailyA, tmsDailyB);
                indexLey == 11 || indexLey == 13 ? totalMetal += (headOfElement * tmsTotalOfThisDay) : totalMetal += getMetalElement(headOfElement, tmsTotalOfThisDay);
            }
            
            return parseFloat(totalMetal);
        };

        const getTrusthData = (data) => {
            let trusthData = [];
            
            data.Data.forEach(item => { trusthData.push(item.Values.filter(exactValue => new Date(exactValue.Time).getHours() == 0).length == 0 ? [{Value: 0, Time: '2023-01-01T00:00:00Z'}] : item.Values.filter(exactValue => new Date(exactValue.Time).getHours() == 0))});
            return trusthData;
        };

        const getRecoveryElement = (concentrate, metalProd) => {
            return metalProd != 0 ? parseFloat(concentrate * 100 / metalProd) : 0;
        };

        const getTotalized = (turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB) => {
            startDate = new Date(timeProvider.displayTime.start);
            let totalizedData = 0;
          
            while(startDate.getTime() <= endDate.getTime()){
                startDate.setDate(startDate.getDate()+1);
                totalizedData += parseFloat(getValue(turnA[0], startDate, ticlioTurnA)) + parseFloat(getValue(turnB[0], startDate, ticlioTurnB)); 
            }
            return totalizedData;
        };

        const createObjectOfTurn = (trusthData, turn) => {
            turn = turn == 'A' ? 0 : 1;
            let turnData = [];
            for(let position = turn; position < 28; position+=2){
                turnData.push(trusthData[position]);
            };
            return turnData;
        };

        const insertRows = (rowToPut, cellulla, classToPut ) => {
            cellulla = syContElement1.insertRow(-1);
            cellulla.className = 'balMetalCellClass balMetalRowClass';
            
            rowToPut.forEach( element =>{
                let rowCellulla = cellulla.insertCell(-1);
                rowCellulla.innerHTML = `<b>${element}</b>`;
                if(!isNaN(element) && element < 0) rowCellulla.className = "balMetalNegative"; 
                !isNaN(element) && element < 0 ? rowCellulla.className = "balMetalNegative " + classToPut: rowCellulla.className = classToPut;
            });
        
        };

        const createTable = (labels, rowTMS, rowHZinc, rowHLead, rowHCupper, rowHSilver, rowRZinc, rowRLead, rowRCupper, rowRSilver, rowMZinc, rowMLead, rowMCupper, rowMSilver) => {
            let headersRow = syContElement1.insertRow(-1);
            headersRow.className = "balMetalRowClass";

            const separatorHRow = ['Heads', '', '', '','','','',''];
            const separatorRRow = ['Recoveries', '', '', '','','','',''];
            const separatorMRow = ['Productions', '', '','','','','',''];
            
            insertRows(labels, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            insertRows(rowTMS, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorHRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');

            insertRows(rowHZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowHLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowHCupper, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowHSilver, headersRow, 'balMetalCellClass balMetalValueCellClass');
            
            insertRows(separatorRRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowRZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowRLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowRCupper, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowRSilver, headersRow, 'balMetalCellClass balMetalValueCellClass');

            insertRows(separatorMRow, headersRow, 'balMetalCellClass balMetalHeaderCellClass');
            
            insertRows(rowMZinc, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowMLead, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowMCupper, headersRow, 'balMetalCellClass balMetalValueCellClass');
            insertRows(rowMSilver, headersRow, 'balMetalCellClass balMetalValueCellClass');
        };

        function myCustomDataUpdateFunction(data) {
            console.log(" ~ file: sym-balMetalYauli.js:240 ~ myCustomDataUpdateFunction ~ data", data)
            
            var startDate = new Date(timeProvider.displayTime.start);
            var onzaTroy = 31.1034768;
    
            if (data.Data.length > 5) {

                $('#' + syContElement1.id).empty();
                const auxDate = new Date();
                const labels = ['SC-CAR','Unit','Trat. Día','Plan Día','Var/D', 'Trat. Mes', 'Plan Mes', 'Var/M'];
             
                const trusthData = getTrusthData(data);
                console.log(" ~ file: sym-balMetalYauli.js:253 ~ myCustomDataUpdateFunction ~ trusthData", trusthData)
                
                const planTms = getPlanTms(trusthData, 41, 42);
                const tmsMcar = getPlanValue(trusthData, 41);
                const tmsMscr = getPlanValue(trusthData, 42);
                    
                const planTmsDaily = auxDate.getHours() >= 12 ?  getDailyValue(planTms) * 2 : getDailyValue(planTms);
                const planTmsMontly = getMonthlyValue(planTms);
                    
                const planHeadZn = getPlanLey(trusthData, tmsMcar, tmsMscr, 43, 44);
                const planHeadPb = getPlanLey(trusthData, tmsMcar, tmsMscr, 45, 46);
                const planHeadCu = getPlanLey(trusthData, tmsMcar, tmsMscr, 47, 48);
                const planHeadAg = getPlanLey(trusthData, tmsMcar, tmsMscr, 49, 50, true);

                const headPlanZinc = planHeadZn[0];
                const headPlanPlomo = planHeadPb[0];
                const headPlanCobre = planHeadCu[0];
                const headPlanPlata = planHeadAg[0];

                const tmsZnMcar = getPlanValue(trusthData, 51);
                const tmsZnMscr = getPlanValue(trusthData, 52);
                    
                const planZinc = getPlanLey(trusthData, tmsZnMcar, tmsZnMscr, 53, 54);
                const planZincAg = getPlanLey(trusthData, tmsZnMcar, tmsZnMscr, 63, 64, true);
                    
                const tmsPbMcar = getPlanValue(trusthData, 55);
                const tmsPbMscr = getPlanValue(trusthData, 56);

                const planPlomo = getPlanLey(trusthData, tmsPbMcar, tmsPbMscr, 57, 58);
                const planPlomoAg = getPlanLey(trusthData, tmsPbMcar, tmsPbMscr, 65, 66, true);
                 
                const tmsCuMcar = getPlanValue(trusthData, 59);
                const tmsCuMscr = getPlanValue(trusthData, 60);

                const planCobre = getPlanLey(trusthData, tmsCuMcar, tmsCuMscr, 61, 62);
                const planCobreAg = getPlanLey(trusthData, tmsCuMcar, tmsCuMscr, 67, 68, true);
                    
                const recoPlanZinc = getPlanRecovery(planHeadZn, planZinc);
                const recoPlanPlomo = getPlanRecovery(planHeadPb, planPlomo);
                const recoPlanCobre = getPlanRecovery(planHeadCu, planCobre);
                const recoPlanPlata = getSilverPlanRecovery(planHeadAg, planZincAg, planPlomoAg, planCobreAg);

                const metalPlanZinc = getDailyValue(planZinc[1]);
                const metalPlanMoZinc = getMonthlyValue(planZinc[1]);
                console.log(" ~ file: sym-balMetalYauli.js:327 ~ myCustomDataUpdateFunction ~ metalPlanMoZinc", metalPlanMoZinc)

                const metalPlanPlomo = getDailyValue(planPlomo[1]);
                console.log(" ~ file: sym-balMetalYauli.js:299 ~ myCustomDataUpdateFunction ~ metalPlanPlomo", metalPlanPlomo)
                const metalPlanMonPlomo = getMonthlyValue(planPlomo[1]);
                console.log(" ~ file: sym-balMetalYauli.js:301 ~ myCustomDataUpdateFunction ~ metalPlanMonPlomo", metalPlanMonPlomo)

                const metalPlanCobre = getDailyValue(planCobre[1]);
                console.log(" ~ file: sym-balMetalYauli.js:304 ~ myCustomDataUpdateFunction ~ metalPlanCobre", metalPlanCobre)
                const metalPlanMoCobre = getMonthlyValue(planCobre[1]);
                console.log(" ~ file: sym-balMetalYauli.js:306 ~ myCustomDataUpdateFunction ~ metalPlanMoCobre", metalPlanMoCobre)

                const auxMetalPlata =  (planZincAg[1] + planPlomoAg[1] + planCobre[1]);
                console.log(" ~ file: sym-balMetalYauli.js:309 ~ myCustomDataUpdateFunction ~ auxMetalPlata", auxMetalPlata)
                const metalPlanPlata = getDailyValue(auxMetalPlata );
                console.log(" ~ file: sym-balMetalYauli.js:311 ~ myCustomDataUpdateFunction ~ metalPlanPlata", metalPlanPlata)
                const metalPlanMoPlata = getMonthlyValue( auxMetalPlata);
                console.log(" ~ file: sym-balMetalYauli.js:313 ~ myCustomDataUpdateFunction ~ metalPlanMoPlata", metalPlanMoPlata)

                  
                const turnA = createObjectOfTurn(trusthData, 'A');
                console.log(" ~ file: sym-balMetalYauli.js:317 ~ myCustomDataUpdateFunction ~ turnA", turnA)
                const turnB = createObjectOfTurn(trusthData, 'B');
                console.log(" ~ file: sym-balMetalYauli.js:319 ~ myCustomDataUpdateFunction ~ turnB", turnB)
                
                const ticlioTurnA = turnA[4];
                console.log(" ~ file: sym-balMetalYauli.js:322 ~ myCustomDataUpdateFunction ~ ticlioTurnA", ticlioTurnA)
                const ticlioTurnB = turnB[4];
                console.log(" ~ file: sym-balMetalYauli.js:324 ~ myCustomDataUpdateFunction ~ ticlioTurnB", ticlioTurnB)
                
                let endDate = new Date(getEndDate(turnA[0], turnB[0], ticlioTurnA, ticlioTurnB));
                console.log(" ~ file: sym-balMetalYauli.js:327 ~ myCustomDataUpdateFunction ~ endDate", endDate)
                
                const tmsDailyA = parseFloat(getValue(turnA[0], endDate, ticlioTurnA));
                console.log(" ~ file: sym-balMetalYauli.js:330 ~ myCustomDataUpdateFunction ~ tmsDailyA", tmsDailyA)
                
                const tmsDailyB = parseFloat(getValue(turnB[0], endDate, ticlioTurnB));
                console.log(" ~ file: sym-balMetalYauli.js:333 ~ myCustomDataUpdateFunction ~ tmsDailyB", tmsDailyB)
                const totalTmsDaily = tmsDailyA + tmsDailyB;
                console.log(" ~ file: sym-balMetalYauli.js:335 ~ myCustomDataUpdateFunction ~ totalTmsDaily", totalTmsDaily)

                const tmsDailyZincA = getValue(turnA[3], endDate, ticlioTurnA);
                const tmsDailyZincB = getValue(turnB[3], endDate, ticlioTurnB);
                const tmsDailyZinc = tmsDailyZincA +tmsDailyZincB;

                const tmsDailyLeadA = getValue(turnA[2], endDate, ticlioTurnA);
                const tmsDailyLeadB = getValue(turnB[2], endDate, ticlioTurnB);
                const tmsDailyLead = tmsDailyLeadA + tmsDailyLeadB;

                const tmsDailyCupperA = getValue(turnA[1], endDate, ticlioTurnA)
                const tmsDailyCupperB = getValue(turnB[1], endDate, ticlioTurnB);
                const tmsDailyCupper = tmsDailyCupperA + tmsDailyCupperB;
                
                const tmsRelaveA = tmsDailyA - (tmsDailyZincA + tmsDailyLeadA + tmsDailyCupperA);
                const tmsRelaveB = tmsDailyB - (tmsDailyZincB + tmsDailyLeadB + tmsDailyCupperB);
                const totalRelaveTmsDaily = tmsRelaveA + tmsRelaveB;
                
                const headZinc = getHeadElement(9 , turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyA, tmsDailyB);
                const headLead = getHeadElement(7 , turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyA, tmsDailyB);
                const headCupper = getHeadElement(5 , turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyA, tmsDailyB);
                const headSilver = getHeadElement(11, turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyA, tmsDailyB) / onzaTroy;
                
                const headRelave = getHeadElement(12, turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsRelaveA, tmsRelaveB) / onzaTroy;
                const headCabSilver = getHeadElement(13, turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyA, tmsDailyB) / onzaTroy;
                
                const concZinc = getHeadElement(10 , turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyZincA, tmsDailyZincB);
                const concLead = getHeadElement(8 , turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyLeadA, tmsDailyLeadB);
                const concCupper = getHeadElement(6 , turnA, turnB, endDate, ticlioTurnA, ticlioTurnB, tmsDailyCupperA, tmsDailyCupperB);
            
                const metalZinc = getMetalElement(headZinc, totalTmsDaily);
                const metalLead = getMetalElement(headLead, totalTmsDaily);
                const metalCupper = getMetalElement(headCupper, totalTmsDaily);

                const concMetalZinc = getMetalElement(concZinc, tmsDailyZinc);
                const concMetalLead = getMetalElement(concLead, tmsDailyLead);
                const concMetalCupper = getMetalElement(concCupper, tmsDailyCupper);

                const metalRelave = parseFloat(headRelave * totalRelaveTmsDaily);
                const metalCabC = parseFloat(headCabSilver * totalTmsDaily);
                const metalSilver = parseFloat(metalCabC - metalRelave);

                
                const recoZinc = getRecoveryElement(concMetalZinc, metalZinc);
                const recoLead = getRecoveryElement(concMetalLead, metalLead);
                const recoCupper = getRecoveryElement(concMetalCupper, metalCupper);
               
                
                const totalTmsMonthly = getTotalized(turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB);

                const metalZincMonthly = getTotalMetal(9, 0,turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB);
                const conZincMonthly = getTotalMetal(10, 3,turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB);
                const recoZincMonthly = getRecoveryElement(conZincMonthly, metalZincMonthly);
                const headZincMonthly = getRecoveryElement(metalZincMonthly, totalTmsMonthly);
                
                const metalLeadMonthly = getTotalMetal(7, 0,turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB);
                const conLeadMonthly = getTotalMetal(8, 2,turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB);
                const recoLeadMonthly = getRecoveryElement(conLeadMonthly, metalLeadMonthly);
                const headLeadMonthly = getRecoveryElement(metalLeadMonthly, totalTmsMonthly);

                const metalCupperMonthly = getTotalMetal(5, 0, turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB);
                const conCupperMonthly = getTotalMetal(6, 1,turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB);
                const recoCupperMonthly = getRecoveryElement(conCupperMonthly, metalCupperMonthly);
                const headCupperMonthly = getRecoveryElement(metalCupperMonthly, totalTmsMonthly);
                
                const recoSilver = getRecoveryElement(metalSilver, metalCabC);
                
                const headSilverMonthly = getTotalMetal(11, 0 , turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB) / onzaTroy / totalTmsMonthly;
                const metalSilverMonthly = getTotalMetal(13, 0, turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB) / onzaTroy ;
                
                const relaveMensual = getTotalRelave(12, 0, 3, 2 , 1, turnA, turnB, startDate, endDate, ticlioTurnA, ticlioTurnB) / onzaTroy;
                
                const conSilverMonthly =  parseFloat(metalSilverMonthly - relaveMensual);
                const recoverySilverMonthly = getRecoveryElement(conSilverMonthly, metalSilverMonthly);
                
                
                const rowTMS = new objectRow('Ore Milled','dmt', totalTmsDaily, planTmsDaily, totalTmsMonthly, planTmsMontly, 0);
                const rowHZinc = new objectRow('Zinc','%', headZinc, headPlanZinc ,  headZincMonthly, headPlanZinc,  2);
                const rowHLead = new objectRow('Plomo','%', headLead, headPlanPlomo , headLeadMonthly, headPlanPlomo ,  2);
                const rowHCupper = new objectRow('Cobre','%', headCupper, headPlanCobre , headCupperMonthly, headPlanCobre, 2);
                const rowHSilver = new objectRow('Plata','oz / t', headSilver, headPlanPlata, headSilverMonthly, headPlanPlata, 2);
                const rowRZinc = new objectRow('Zinc','%', recoZinc, recoPlanZinc, recoZincMonthly, recoPlanZinc, 2);
                const rowRLead = new objectRow('Plomo','%', recoLead, recoPlanPlomo, recoLeadMonthly, recoPlanPlomo, 2);
                const rowRCupper = new objectRow('Cobre','%', recoCupper, recoPlanCobre, recoCupperMonthly, recoPlanCobre, 2);
                const rowRSilver = new objectRow('Plata','%', recoSilver, recoPlanPlata, recoverySilverMonthly, recoPlanPlata, 2);
                const rowMZinc = new objectRow('Zinc','fmt', concMetalZinc, metalPlanZinc, conZincMonthly, metalPlanMoZinc, 2);
                const rowMLead = new objectRow('Plomo','fmt', concMetalLead, metalPlanPlomo, conLeadMonthly, metalPlanMonPlomo, 2);
                const rowMCupper = new objectRow('Cobre','fmt', concMetalCupper, metalPlanCobre, conCupperMonthly, metalPlanMoCobre, 2);
                const rowMSilver = new objectRow('Plata','k oz', metalSilver, metalPlanPlata, conSilverMonthly, metalPlanMoPlata, 2);
               
                createTable(labels, rowTMS.arObject, 
                rowHZinc.arObject, rowHLead.arObject, rowHCupper.arObject, rowHSilver.arObject,
                rowRZinc.arObject, rowRLead.arObject, rowRCupper.arObject, rowRSilver.arObject,
                rowMZinc.arObject, rowMLead.arObject, rowMCupper.arObject, rowMSilver.arObject);
            
            };
        };

        function myCustomConfigurationChangeFunction(data) {
            document.getElementById(syContElement1.id).style.border = '3px solid ' + scope.config.outsideBalMetalBorderColor;
            document.getElementById(syContElement1.id).style.borderRadius = '20%';
            
            if (scope.config.showBalMetalCheckboxValue) {
                scope.config.showBalMetalCheckboxStyle = 'table-cell';
            } else {
                scope.config.showBalMetalCheckboxStyle = 'none';
            }
            if (scope.config.showDataItemNameCheckboxValue) {
                scope.config.showDataItemNameCheckboxStyle = 'table-cell';
            } else {
                scope.config.showDataItemNameCheckboxStyle = 'none';
            }

        };
    };

    CS.symbolCatalog.register(myCustomSymbolDefinition);

})(window.PIVisualization);