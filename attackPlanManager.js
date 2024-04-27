/*
* Script Name: Attack Plan Manager
* Version: v1.0
* Last Updated: 2024-02-20
* Author: SaveBank
* Author Contact: Discord: savebank
* Contributor:  
* Approved: 
* Approved Date: 
* Mod: 
*/


// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// CONSTANTS
var sbAllIdsAPM = [
    'planSelector',
];
var planIds = [];
var sbButtonIDsAPM = [];
var sbPlans = {};



var scriptConfig = {
    scriptData: {
        prefix: 'sbAPM',
        name: 'Attack Plan Manager',
        version: 'v1.0',
        author: 'SaveBank',
        authorUrl: 'https://forum.tribalwars.net/index.php?members/savebank.131111/',
        helpLink: '',
    },
    translations: {
        en_DK: {
            'Redirecting...': 'Redirecting...',
            Help: 'Help',
            'Attack Plan Manager': 'Attack Plan Manager',
            'There was an error!': 'There was an error!',
            'Import attack plan:': 'Import attack plan:',
            'Import': 'Import',
            'Export attack plan:': 'Export attack plan:',
            'Select attack plan:': 'Select attack plan:',
            'Export': 'Export',
            'Reset Input': 'Reset Input',
            'Save Plan': 'Save Plan',
            'Delete Plan': 'Delete Plan',
            'Attack type': 'Attack type',
            'Unit Template': 'Unit Template',
            'Loading': 'Loading',
            'Load Troop Templates': 'Load Troop Templates',
        },
        de_DE: {
            'Redirecting...': 'Weiterleiten...',
            Help: 'Hilfe',
            'Attack Plan Manager': 'Angriffsplan Manager',
            'There was an error!': 'Es gab einen Fehler!',
            'Import attack plan:': 'Angriffsplan importieren:',
            'Import': 'Importieren',
            'Export attack plan:': 'Angriffsplan exportieren:',
            'Select attack plan:': 'Angriffsplan auswählen:',
            'Export': 'Exportieren',
            'Reset Input': 'Eingaben zurücksetzen',
            'Delete Plan': 'Plan löschen',
            'Save Plan': 'Plan speichern',
            'Attack type': 'Angriffstyp',
            'Unit Template': 'Truppenvorlage',
            'Loading': 'Lade',
            'Load Troop Templates': 'Truppenvorlagen laden',
        }
    }
    ,
    allowedMarkets: [],
    allowedScreens: ['overview_villages'],
    allowedModes: ['combined'],
    isDebug: DEBUG,
    enableCountApi: false
};





$.getScript(`https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`,
    async function () {
        const startTime = performance.now();
        if (DEBUG) {
            console.debug(`Init`);
        }
        await twSDK.init(scriptConfig);
        const scriptInfo = twSDK.scriptInfo();
        const isValidScreen = twSDK.checkValidLocation('screen');
        const isValidMode = twSDK.checkValidLocation('mode');
        if (!isValidScreen && !isValidMode) {
            // Redirect to correct screen if necessary
            UI.InfoMessage(twSDK.tt('Redirecting...'));
            twSDK.redirectTo('overview_villages&combined');
            return;
        }
        const { worldUnitInfo, worldConfig, tribes, players, villages } = await fetchWorldConfigData();
        const villageMap = new Map();
        villages.forEach(village => {
            const key = village[0];
            villageMap.set(key, village);
        });
        const playersMap = new Map();
        players.forEach(player => {
            const key = player[0];
            playersMap.set(key, player);
        });

        const endTime = performance.now();
        if (DEBUG) console.debug(`${scriptInfo}: Troop templates: ${templates}`);
        if (DEBUG) console.debug(`${scriptInfo}: Startup time: ${(endTime - startTime).toFixed(2)} milliseconds`);
        if (DEBUG) console.debug(`${scriptInfo} worldUnitInfo: `, worldUnitInfo);
        if (DEBUG) console.debug(`${scriptInfo} worldConfig: `, worldConfig);
        if (DEBUG) console.debug(`${scriptInfo} tribes: `, tribes);
        if (DEBUG) console.debug(`${scriptInfo} players: `, players);
        if (DEBUG) console.debug(`${scriptInfo} villages: `, villages);
        if (DEBUG) console.debug(`${scriptInfo} villageMap: `, villageMap);
        if (DEBUG) console.debug(`${scriptInfo} playersMap: `, playersMap);
        // Entry point
        (async function () {
            try {
                const startTime = performance.now();
                openDatabase();
                renderUI();
                addEventHandlers();
                initializeInputFields();
                const endTime = performance.now();
                if (DEBUG) console.debug(`${scriptInfo}: Time to initialize: ${(endTime - startTime).toFixed(2)} milliseconds`);
            } catch (error) {
                UI.ErrorMessage(twSDK.tt('There was an error!'));
                console.error(`${scriptInfo}: Error:`, error);
            }
        })();

        function renderUI() {
            const style = generateCSS();
            const importContent = generateImport();
            const exportContent = generateExport();
            const planSelectorContent = generatePlanSelector();
            const unitSelectorContent = generateUnitSelector();

            let content = `
                <div class="ra-mb10 sb-grid sb-grid-2">
                    <fieldset id="import" class="ra-mb10">
                        ${importContent}
                    </fieldset>
                    <fieldset id="export"  class="ra-mb10">
                        ${exportContent}
                    </fieldset>
                </div> 
                <div>
                    <fieldset class="ra-mb10 sb-grid sb-grid-5">
                        <div>
                            ${planSelectorContent}
                        </div>
                        <div>
                            <button id="savePlan" class="btn">${twSDK.tt('Save Plan')}</button>
                        </div>
                        <div>
                            <button id="deletePlan" class="btn">${twSDK.tt('Delete Plan')}</button>
                        </div>
                        <div>
                           <button id="loadTroopTemplates" class="btn">${twSDK.tt('Load Troop Templates')}</button>
                        </div>
                        <div class="ra-tac">
                            <button id="resetInput" >${twSDK.tt('Reset Input')}</button>
                        </div>
                    </fieldset>
                </div>
                <div>
                    <fieldset class="ra-mb10">
                        ${unitSelectorContent}
                    </fieldset>
                </div>
                <div id="sbPlansDiv" class="ra-mb10">
                </div>
            `
            twSDK.renderBoxWidget(
                content,
                'AttackPlanManager',
                'attack-plan-manager',
                style
            );

        }

        function addEventHandlers() {
            $('#importPlan').click(function () {
                var importContent = $('#importInput').val();
                importPlan(importContent);
            });
            $('#exportPlan').click(function () {
                localStorageSettings = getLocalStorage();
                let planId = localStorageSettings.planSelector;
                let exportContent = sbPlans[parseInt(planId.substring(planId.lastIndexOf('-') + 1))];
                let content = exportWorkbench(exportContent);
                $('#exportInput').val(content);
            });
            $('#resetInput').click(function () {
                resetInput();
            });
            $('#savePlan').click(function () {
                localStorageSettings = getLocalStorage();
                let planId = localStorageSettings.planSelector;
                let lastDashIndex = planId.lastIndexOf('-');
                let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
                console.log("Save plan", actualPlanId);
                console.log(sbPlans);
                console.log(sbPlans[actualPlanId]);
                modifyPlan(actualPlanId, sbPlans[actualPlanId]);
            });
            $('#deletePlan').click(function () {
                localStorageSettings = getLocalStorage();
                let planId = localStorageSettings.planSelector;
                let lastDashIndex = planId.lastIndexOf('-');
                let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
                console.log("Delete plan", actualPlanId);
                deletePlan(actualPlanId);
                if (actualPlanId in sbPlans) {
                    console.log("Delete plan", actualPlanId);
                    console.log(sbPlans);
                    delete sbPlans[actualPlanId];
                    let index = planIds.indexOf(planId);
                    if (index !== -1) {
                        planIds.splice(index, 1);
                    }
                }
                localStorageSettings.planSelector = '---';
                $(`#${planId}`).hide();
                saveLocalStorage(localStorageSettings);
                populatePlanSelector();
            });
            $(document).ready(function () {
                sbAllIdsAPM.forEach(function (id) {
                    $('#' + id).on('change', handleInputChange);
                });
            });
        }

        function initializeInputFields() {
            planIds = [];
            sbButtonIDsAPM = [];
            sbPlans = {};
            getAllPlans().then(plans => {
                if (plans.length > 0) {
                    for (let i = 0; i < plans.length; i++) {
                        sbPlans[plans[i].key] = plans[i].plan;
                        console.log("Plan", plans[i].plan); // Access the plan property
                        $('#sbPlansDiv').append(`<div id="plan-id-${plans[i].key}" class="ra-mb10">${renderPlan(plans[i].plan, plans[i].key)}</div>`);
                        planIds.push(`plan-id-${parseInt(plans[i].key)}`); // Use the key as the id
                        $('#plan-id-' + plans[i].key).hide(); // Use the key as the id
                    }
                } else {
                    console.log("No plans found");
                }
                populatePlanSelector();
                createButtons();
            }).catch(error => {
                // Handle any errors here.
                console.error("Error retrieving plans", error);
            });
        }

        function generateCSS() {

            let css = `
                    .sb-grid-5 {
                        grid-template-columns: repeat(5, 1fr);
                    }
                    .sb-grid-4 {
                        grid-template-columns: repeat(4, 1fr);
                    }
                    .sb-grid-3 {
                        grid-template-columns: repeat(3, 1fr);
                    }
                    .sb-grid-2 {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .sb-grid-20-80 {
                        grid-template-columns: 20% 80%;
                    }
                    .sb-grid-25-25-50 {
                        grid-template-columns: calc(25% - 5px) calc(25% - 5px) calc(50% - 10px);
                    }
                    .sb-grid {
                        display: grid;
                        grid-gap: 10px;
                    }
                    .sb-grid {
                        display: grid;
                        grid-gap: 10px;
                    }
                    fieldset {
                        border: 1px solid #c1a264;
                        border-radius: 4px;
                        padding: 9px;
                    }
                    legend {
                        font-size: 12px; 
                        font-weight: bold; 
                    }
                    input[type="number"] {
                        padding: 8px;
                        font-size: 14px;
                        border: 1px solid #c1a264;
                        border-radius: 3px;
                        width: 90px;
                    }
                    input[type="checkbox"] {
                        margin-right: 5px;
                        transform: scale(1.2);
                    }
                    input[type="email"] {
                        padding: 8px;
                        font-size: 11px;
                        border: 1px solid #c1a264;
                        border-radius: 3px;
                        width: 100%; 
                    }
                    input[type="email"]::placeholder { 
                        font-style: italic;
                        font-size: 10px;
                    }
                    input[type="number"]::-webkit-inner-spin-button,
                    input[type="number"]::-webkit-outer-spin-button,
                    input[type="number"] {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    input[type="number"] {
                        -moz-appearance: textfield;
                    }
                    input[type="number"]:focus,
                    input[type="checkbox"]:focus,
                    input[type="email"]:focus {
                        outline: none;
                        border-color: #92794e;
                        box-shadow: 0 0 5px rgba(193, 162, 100, 0.7);
                    }
                    select {
                        padding: 8px;
                        font-size: 14px;
                        border: 1px solid #c1a264;
                        border-radius: 3px;
                        width: 165px;
                    }
                    select:hover {
                        border-color: #92794e; 
                    }
                    
                    select:focus {
                        outline: none;
                        border-color: #92794e; 
                        box-shadow: 0 0 5px rgba(193, 162, 100, 0.7);
                    }

                    .buttonClicked {
                        background-color: grey;
                    }
                    #resetInput {
                        padding: 8px;
                        font-size: 12px;
                        color: white;
                        font-weight: bold;
                        background: #af281d;
                        background: linear-gradient(to bottom, #af281d 0%,#801006 100%);
                        border: 1px solid;
                        border-color: #006712;
                        border-radius: 3px;
                        cursor: pointer;
                        
                    }
                    #resetInput:hover {
                        background: #c92722;
                        background: linear-gradient(to bottom, #c92722 0%,#a00d08 100%);
                    }
            `;

            return css;
        }
        /*
        * th1: origin village id
        * th2: origin player 
        * th3: target village id
        * th4: target player
        * th5: slowest unit
        * th6: type
        * th7: send time
        * th8: arrival time
        * th9: remaining time
        * th10: send button
        * th11: delete button
        */
        function renderPlan(plan, id) {
            // Create a HTML string for the table headings.
            tbodyContent = renderPlanRows(plan, id);

            let html = `
        <table class="sbPlan">
            <thead>
                <tr>
                    <th>Origin Village ID</th>
                    <th>Origin Player</th>
                    <th>Target Village ID</th>
                    <th>Target Player</th>
                    <th>Slowest Unit</th>
                    <th>Type</th>
                    <th>Send Time</th>
                    <th>Arrival Time</th>
                    <th>Remaining Time</th>
                    <th>Send Button</th>
                    <th>Delete Button</th>
                </tr>
            </thead>
            ${tbodyContent}
        </table>
    `;

            return html;
        }

        function renderPlanRows(plan, id) {
            plan.sort((a, b) => {
                let distanceA = getDistanceFromIDs(parseInt(a.originVillageId), parseInt(a.targetVillageId));
                let unitSpeedA = parseInt(worldUnitInfo.config[a.slowestUnit].speed);
                let sendTimestampA = parseInt(parseInt(a.arrivalTimestamp) - (twSDK.getTravelTimeInSecond(distanceA, unitSpeedA) * 1000));
                let remainingTimestampA = parseInt(sendTimestampA - Date.now());

                let distanceB = getDistanceFromIDs(parseInt(b.originVillageId), parseInt(b.targetVillageId));
                let unitSpeedB = parseInt(worldUnitInfo.config[b.slowestUnit].speed);
                let sendTimestampB = parseInt(parseInt(b.arrivalTimestamp) - (twSDK.getTravelTimeInSecond(distanceB, unitSpeedB) * 1000));
                let remainingTimestampB = parseInt(sendTimestampB - Date.now());

                return remainingTimestampA - remainingTimestampB;
            });
            let tbodyContent = '';
            for (let i = 0; i < plan.length; i++) {
                let row = plan[i];
                let attackId = row.attackId;
                timeStampId = `${id}-remainingTimestamp-${attackId}`;
                buttonSendId = `${id}-buttonsend-${attackId}`;
                buttonDeleteId = `${id}-buttondelete-${attackId}`;
                sbButtonIDsAPM.push(buttonDeleteId);
                sbButtonIDsAPM.push(buttonSendId);

                let distance = getDistanceFromIDs(parseInt(row.originVillageId), parseInt(row.targetVillageId));
                let unitSpeed = parseInt(worldUnitInfo.config[row.slowestUnit].speed);
                let sendTimestamp = parseInt(parseInt(row.arrivalTimestamp) - (twSDK.getTravelTimeInSecond(distance, unitSpeed) * 1000));
                let remainingTimestamp = parseInt(sendTimestamp - Date.now());
                let remainingTime = convertTimestampToDHMS(remainingTimestamp);

                let sendTime = convertTimestampToDateString(sendTimestamp);
                let arrivalTime = convertTimestampToDateString(parseInt(row.arrivalTimestamp));
                tbodyContent += `
            <tr>
                <td><a href="/game.php?village=${row.originVillageId}&screen=overview"><span class="quickedit-label">${villageMap.get(parseInt(row.originVillageId))[2]}|${villageMap.get(parseInt(row.originVillageId))[3]}</span></a></td>
                <td><a href="/game.php?village=${game_data.village.id}&screen=info_player&id=${villageMap.get(parseInt(row.originVillageId))[4]}"><span class="quickedit-label">${playersMap.get(parseInt(villageMap.get(parseInt(row.originVillageId))[4]))[1]}</span></td>
                <td><a href="/game.php?village=${game_data.village.id}&screen=info_village&id=${row.targetVillageId}"><span class="quickedit-label">${villageMap.get(parseInt(row.targetVillageId))[2]}|${villageMap.get(parseInt(row.targetVillageId))[3]}</span></td>
                <td><a href="/game.php?village=${game_data.village.id}&screen=info_player&id=${villageMap.get(parseInt(row.targetVillageId))[4]}"><span class="quickedit-label">${playersMap.get(parseInt(villageMap.get(parseInt(row.targetVillageId))[4]))[1]}</span></td></td>
                <td>${row.slowestUnit}</td>
                <td>${row.attackType}</td>
                <td>${sendTime}</td>
                <td>${arrivalTime}</td>
                <td id="${timeStampId}">${remainingTime}</td>
                <td id="${buttonSendId}"></td>
                <td id="${buttonDeleteId}"></td>
            </tr>
        `;
            }
            return tbodyContent;
        }
        function createButtons() {
            console.log("Buttons" + sbButtonIDsAPM.length);
            for (let i = 0; i < sbButtonIDsAPM.length; i++) {
                let buttonId = sbButtonIDsAPM[i];
                let isSendButton = buttonId.includes('buttonsend');
                let isDeleteButton = buttonId.includes('buttondelete');

                if (isSendButton) {
                    let sendButton = document.createElement("button");
                    sendButton.innerHTML = "Send";
                    sendButton.id = buttonId;

                    sendButton.onclick = function () {
                        // send attack
                        sendButton.classList.add("buttonClicked");
                    }

                    // Append the button to the correct element
                    let sendParent = document.getElementById(buttonId);
                    sendParent.appendChild(sendButton);
                }

                if (isDeleteButton) {
                    let deleteButton = document.createElement("button");
                    deleteButton.innerHTML = "Delete";
                    deleteButton.id = buttonId;
                    deleteButton.onclick = function () {
                        // delete attack
                        let [planId, _, attackId] = buttonId.split('-');
                        // planId gets us the plan in sbPlans and attackId is the index of the attack in the plan array
                        let row = deleteButton.parentNode.parentNode;
                        row.parentNode.removeChild(row);

                        // delete attack from plan
                        let plan = sbPlans[planId];
                        if (plan) {
                            let attackIndex = plan.findIndex(attack => attack.attackId === attackId);
                            if (attackIndex !== -1) {
                                plan.splice(attackIndex, 1);
                            }
                        }
                    }

                    // Append the button to the correct element
                    let deleteParent = document.getElementById(buttonId);
                    deleteParent.appendChild(deleteButton);
                }
            }
        }

        // TODO slowest unit to img

        // TODO attack type to img

        // TODO timestamp to date
        function convertTimestampToDateString(timestamp) {
            let date = new Date(timestamp);
            return date.toLocaleString();
        }

        function convertTimestampToDHMS(timestamp) {
            let seconds = Math.floor(timestamp / 1000);
            let days = Math.floor(seconds / 86400);
            seconds -= days * 86400;
            let hours = Math.floor(seconds / 3600) % 24;
            seconds -= hours * 3600;
            let minutes = Math.floor(seconds / 60) % 60;
            seconds -= minutes * 60;

            // Pad the minutes and seconds with leading zeros, if required
            hours = hours < 10 ? "0" + hours : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            // Format the output as "DD:hh:mm:ss"
            let timeString = `${days > 0 ? days + ":" : ""}${hours}:${minutes}:${seconds}`;

            return timeString;
        }

        // TODO remaining time to date with updates (we have ids for each row)



        function getDistanceFromIDs(originVillageId, targetVillageId) {
            let originVillage = villageMap.get(originVillageId)[2] + "|" + villageMap.get(originVillageId)[3];
            let targetVillage = villageMap.get(targetVillageId)[2] + "|" + villageMap.get(targetVillageId)[3];
            return twSDK.calculateDistance(originVillage, targetVillage);
        }


        function generateImport() {
            const html = `
                <legend>${twSDK.tt('Import attack plan:')}</legend>
                <textarea id="importInput" class="sb-input-textarea"></textarea>
                <div class="ra-mb10">
                    <button id="importPlan" class="btn">${twSDK.tt('Import')}</button>
                </div>
            `;
            return html;
        }

        function generateExport() {
            const html = `

                    <legend>${twSDK.tt('Export attack plan:')}</legend>
                    <textarea id="exportInput" class="sb-input-textarea"></textarea>
                
                <div class="ra-mb10">
                <button id="exportPlan" class="btn">${twSDK.tt('Export')}</button>
            </div>
            `;
            return html;
        }

        function generateUnitSelector() {
            const html = `
            <legend>${twSDK.tt('Select unit template plan:')}</legend>
            <table>
                <thead>
                    <tr>
                        <th>${twSDK.tt('Attack type')}</th>
                        <th>${twSDK.tt('Unit Template')}</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            `;

            return html;
        }
        function generatePlanSelector() {
            const html = `
                    <legend>${twSDK.tt('Select attack plan:')}</legend>
                    <select id="planSelector" class="sb-input-select">
                        <option value="---">---</option>
                    </select>
                
            `;
            return html;
        }
        function populatePlanSelector() {
            let planSelector = document.getElementById('planSelector');
            $("#planSelector option").each(function () {
                if ($(this).val() !== '---') {
                    $(this).remove();
                }
            });
            for (let i = 0; i < planIds.length; i++) {
                let option = document.createElement('option');
                option.value = planIds[i];
                option.text = planIds[i];
                planSelector.appendChild(option);
            }
            let localStorageSettings = getLocalStorage();
            console.log(localStorageSettings.planSelector);
            for (let planid of planIds) {
                if (planid === localStorageSettings.planSelector) {
                    $(`#${planid}`).show();
                    planSelector.value = planid; // Set the selected option
                } else {
                    $(`#${planid}`).hide();
                }
            }
        }


        function importPlan(content) {
            let plan = convertWBPlanToArray(content);

            // Save plan in indexed db
            addPlan(plan)
                .then(key => {
                    console.log("Plan added successfully");
                    console.log("Key of the added plan:", key);
                    localStorageSettings = getLocalStorage();
                    localStorageSettings.planSelector = `plan-id-${key}`;
                    saveLocalStorage(localStorageSettings);
                    renderUI();
                    addEventHandlers();
                    initializeInputFields();
                })
                .catch(error => {
                    console.error("Error adding plan", error);
                });
        }

        function convertWBPlanToArray(plan) {
            let planArray = plan.split("\n").filter(str => str.trim() !== "");
            let planObjects = [];
            /* 
            * 0: origin village id
            * 1: target village id
            * 2: slowest unit
            * 3: arrival timestamp
            * 4: attack type 
            * 5: draw in (always false)
            * 6: sent (always false)
            * 7: units
            * 8: times to send (ignore)
            */
            for (let i = 0; i < planArray.length; i++) {
                let planParts = planArray[i].split("&");
                let units = planParts[7].split("/").reduce((obj, str) => {
                    const [unit, value] = str.split("=");
                    obj[unit] = atob(value);
                    return obj;
                }, {});

                let planObject = {
                    attackId: i.toString(),
                    originVillageId: parseInt(planParts[0]),
                    targetVillageId: parseInt(planParts[1]),
                    slowestUnit: planParts[2],
                    arrivalTimestamp: parseInt(planParts[3]),
                    attackType: parseInt(planParts[4]),
                    drawIn: planParts[5] === 'false',
                    sent: planParts[6] === 'false',
                    units: units
                };

                planObjects.push(planObject);
            }


            return planObjects;
        }


        function exportWorkbench(planArray) {
            let exportWB = "";
            for (let row of planArray) {
                let {
                    attackId,
                    originVillageId,
                    targetVillageId,
                    slowestUnit,
                    arrivalTimestamp,
                    attackType,
                    drawIn,
                    sent,
                    units
                } = row;

                let arrTimestamp = (new Date(arrivalTimestamp).getTime()) + attackType;
                exportWB += originVillageId + "&" + targetVillageId + "&" + slowestUnit +
                    "&" + arrTimestamp + "&" + attackType + "&" + drawIn + "&" + sent;

                for (let unit in units) {
                    exportWB += "&" + unit + "=" + btoa(units[unit]);
                }

                exportWB += "\n";
            }

            return exportWB;
        }

        // This function opens a connection to the IndexedDB database.
        function openDatabase() {
            // This line creates a request to open the "sbAttackPlanManager" database.
            let openRequest = indexedDB.open("sbAttackPlanManager");

            // This event handler runs when the database is opened successfully.
            openRequest.onsuccess = function (event) {
                console.log("Database opened successfully");
                // The result of the request is the database.
                let db = event.target.result;

            };

            // This event handler runs when there's an error opening the database.
            openRequest.onerror = function (event) {
                console.log("Error opening database", event);
            };
            // This event handler runs when the database needs to be created or upgraded.
            // This is where you should create object stores.
            openRequest.onupgradeneeded = function (event) {
                console.log("Upgrading database");
                let db = event.target.result;

                // Check if the object store already exists before creating it.
                if (!db.objectStoreNames.contains('Plans')) {
                    // Create an object store named "Plans" with an auto-incrementing key.
                    // The createObjectStore method takes two parameters:
                    // 1. The name of the object store.
                    // 2. An options object. The autoIncrement option is set to true, which means the keys will automatically increment for each new record.
                    let objectStore = db.createObjectStore("Plans", { autoIncrement: true });
                }
            };
        }

        function addPlan(plan) {
            return new Promise((resolve, reject) => {
                let openRequest = indexedDB.open("sbAttackPlanManager");

                openRequest.onsuccess = function (event) {
                    let db = event.target.result;
                    let transaction = db.transaction(["Plans"], "readwrite");
                    let objectStore = transaction.objectStore("Plans");
                    let addRequest = objectStore.add(plan);

                    addRequest.onsuccess = function (event) {
                        console.log("Plan added successfully");
                        resolve(event.target.result); // Resolve the promise with the key of the newly saved object
                    };

                    addRequest.onerror = function (event) {
                        console.log("Error adding plan", event);
                        reject(event); // Reject the promise if there's an error
                    };
                };

                openRequest.onerror = function (event) {
                    console.log("Error opening database", event);
                    reject(event); // Reject the promise if there's an error
                };
            });
        }

        function modifyPlan(planId, plan) {
            // Open a connection to the database.
            let openRequest = indexedDB.open("sbAttackPlanManager");

            openRequest.onsuccess = function (event) {
                let db = event.target.result;

                // Start a new transaction with the "Plans" object store.
                // The "readwrite" parameter means that the transaction will allow both read and write operations.
                let transaction = db.transaction(["Plans"], "readwrite");

                // Get the "Plans" object store from the transaction.
                let objectStore = transaction.objectStore("Plans");

                // Modify the plan in the object store.
                // The put method takes two parameters:
                // 1. The record to add or update.
                // 2. The key to use for the record. This is optional when the object store has autoIncrement true.
                let putRequest = objectStore.put(plan, planId);

                putRequest.onsuccess = function (event) {
                    console.log("Plan modified successfully", event);
                };

                putRequest.onerror = function (event) {
                    console.log("Error modifying plan", event);
                };
            };

            openRequest.onerror = function (event) {
                console.log("Error opening database", event);
            };
        }
        // This function retrieves all plans from the "Plans" object store.
        function getAllPlans() {
            return new Promise((resolve, reject) => {
                let openRequest = indexedDB.open("sbAttackPlanManager");

                openRequest.onsuccess = function (event) {
                    let db = event.target.result;
                    let transaction = db.transaction(["Plans"], "readonly");
                    let objectStore = transaction.objectStore("Plans");

                    // Use openCursor instead of getAll
                    let cursorRequest = objectStore.openCursor();

                    let plans = [];

                    cursorRequest.onsuccess = function (event) {
                        let cursor = event.target.result;
                        if (cursor) {
                            // Push an object with both the key and the value to the plans array
                            plans.push({ key: cursor.key, plan: cursor.value });
                            cursor.continue();
                        } else {
                            // No more results
                            console.log("Plans retrieved successfully", plans);
                            resolve(plans);
                        }
                    };

                    cursorRequest.onerror = function (event) {
                        console.log("Error retrieving plans", event);
                        reject(event);
                    };
                };

                openRequest.onerror = function (event) {
                    console.log("Error opening database", event);
                    reject(event);
                };
            });
        }

        // This function deletes a plan from the "Plans" object store.
        function deletePlan(planId) {
            // Open a connection to the database.
            let openRequest = indexedDB.open("sbAttackPlanManager");

            openRequest.onsuccess = function (event) {
                let db = event.target.result;

                // Start a new transaction with the "Plans" object store.
                // The "readwrite" parameter means that the transaction will allow both read and write operations.
                let transaction = db.transaction(["Plans"], "readwrite");

                // Get the "Plans" object store from the transaction.
                let objectStore = transaction.objectStore("Plans");

                // Delete the plan from the object store.
                // The delete method takes one parameter: the key of the record to delete.
                let deleteRequest = objectStore.delete(planId);

                deleteRequest.onsuccess = function (event) {
                    console.log("Plan deleted successfully", event);
                };

                deleteRequest.onerror = function (event) {
                    console.log("Error deleting plan", event);
                };
            };

            openRequest.onerror = function (event) {
                console.log("Error opening database", event);
            };
        }

        // This function deletes all plans from the "Plans" object store.
        function clearObjectStore() {
            // Open a connection to the database.
            let openRequest = indexedDB.open("sbAttackPlanManager");

            openRequest.onsuccess = function (event) {
                let db = event.target.result;

                // Start a new transaction with the "Plans" object store.
                // The "readwrite" parameter means that the transaction will allow both read and write operations.
                let transaction = db.transaction(["Plans"], "readwrite");

                // Get the "Plans" object store from the transaction.
                let objectStore = transaction.objectStore("Plans");

                // Clear all plans from the object store.
                // The clear method deletes all records from the object store.
                let clearRequest = objectStore.clear();

                clearRequest.onsuccess = function (event) {
                    console.log("Object store cleared successfully");
                };

                clearRequest.onerror = function (event) {
                    console.log("Error clearing object store", event);
                };
            };

            openRequest.onerror = function (event) {
                console.log("Error opening database", event);
            };
        }

        function getCurrentURL() {
            return window.location.protocol + "//" + window.location.host + window.location.pathname;;
        }

        async function getTroopTemplates() {
            let baseUrl = getCurrentURL() + "?screen=place&mode=templates";

            let response = await fetch(baseUrl);
            let text = await response.text();

            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            let divContent = doc.querySelector('#troop_template_list');

            let hrefs = Array.from(divContent.querySelectorAll('li a'))
                .slice(1) // Skip the first li
                .map(a => a.getAttribute('href')); // Get the href of each a

            let troopTemplates = [];
            let i = 0;
            for (let href of hrefs) {
                i++;
                await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200 ms
                UI.InfoMessage(twSDK.tt('Loading') + ` ${i}/${hrefs.length}`);
                let troopTemplate = {};

                let response = await fetch(baseUrl + href);
                let text = await response.text();

                let doc = parser.parseFromString(text, 'text/html');
                let firstTrContent = doc.querySelector('#troop_template_container form table tbody tr');
                let tds = firstTrContent.querySelectorAll('td');

                for (let td of tds) {
                    let trs = td.querySelectorAll('table tbody tr');
                    for (let tr of trs) {
                        let unitName = tr.querySelector('a').getAttribute('data-unit');
                        let checkbox = tr.querySelector('input[type="checkbox"]');
                        let unitAmount = checkbox.checked ? 'all' : tr.querySelector('input[type="text"]').value;
                        troopTemplate[unitName] = unitAmount;
                    }
                }

                let secondTrContent = doc.querySelector('#troop_template_container form table tbody tr:nth-child(2)');
                troopTemplate.name = secondTrContent.querySelector('#template_name').value;

                troopTemplates.push(troopTemplate);
            }

            return troopTemplates;
        }


        function resetInput() {
            let localStorageSettings = getLocalStorage();
            localStorageSettings.planSelector = '---';
            saveLocalStorage(localStorageSettings);
            renderUI();
            addEventHandlers();
            initializeInputFields();
        }

        function handleInputChange() {
            const inputId = $(this).attr('id');
            let inputValue;

            switch (inputId) {
                case "planSelector":
                    inputValue = $(this).val();
                    for (let planId of planIds) {
                        if (planId === inputValue) {
                            $(`#${planId}`).show();
                        } else {
                            $(`#${planId}`).hide();
                        }
                    }
                    break;
                default:
                    console.error(`${scriptInfo}: Unknown id: ${inputId}`)
            }
            if (DEBUG) console.debug(`${scriptInfo}: ${inputId} changed to ${inputValue}`)
            const settingsObject = getLocalStorage();
            settingsObject[inputId] = inputValue;
            saveLocalStorage(settingsObject);
        }

        function getLocalStorage() {
            const localStorageSettings = JSON.parse(localStorage.getItem('sbAttackPlanManager'));
            // Check if all expected settings are in localStorageSettings
            const expectedSettings = [
                'planSelector',
            ];

            let missingSettings = [];
            if (localStorageSettings) {
                missingSettings = expectedSettings.filter(setting => !(setting in localStorageSettings));
                if (DEBUG && missingSettings.length > 0) console.debug(`${scriptInfo}: Missing settings in localStorage: `, missingSettings);
            }

            if (localStorageSettings && missingSettings.length === 0) {
                // If settings exist in localStorage  return the object
                return localStorageSettings;
            } else {
                const defaultSettings = {
                    planSelector: '---',
                };

                saveLocalStorage(defaultSettings);

                return defaultSettings;
            }
        }
        function saveLocalStorage(settingsObject) {
            // Stringify and save the settings object
            localStorage.setItem('sbAttackPlanManager', JSON.stringify(settingsObject));
        }

        async function fetchWorldConfigData() {
            try {
                const villages = await twSDK.worldDataAPI('village');
                const players = await twSDK.worldDataAPI('player');
                const tribes = await twSDK.worldDataAPI('ally');
                const worldUnitInfo = await twSDK.getWorldUnitInfo();
                const worldConfig = await twSDK.getWorldConfig();
                return { worldUnitInfo, worldConfig, tribes, players, villages };
            } catch (error) {
                UI.ErrorMessage(
                    twSDK.tt('There was an error while fetching the data!')
                );
                console.error(`${scriptInfo} Error:`, error);
            }
        }
    }
);