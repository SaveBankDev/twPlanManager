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
var allIds = [
];
var buttonIDs = [
];



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
        },
        de_DE: {
            'Redirecting...': 'Weiterleiten...',
            Help: 'Hilfe',
            'Attack Plan Manager': 'Angriffsplan Manager',
            'There was an error!': 'Es gab einen Fehler!',
            'Import attack plan:': 'Angriffsplan importieren:',
            'Import': 'Importieren',
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
        // const { tribes, players, villages } = await fetchWorldConfigData();
        const endTime = performance.now();
        if (DEBUG) console.debug(`${scriptInfo}: Startup time: ${(endTime - startTime).toFixed(2)} milliseconds`);
        if (DEBUG) console.debug(`${scriptInfo}: `, tribes);
        if (DEBUG) console.debug(`${scriptInfo}: `, players);
        if (DEBUG) console.debug(`${scriptInfo}: `, villages);
        // Entry point
        (async function () {
            try {
                const startTime = performance.now();
                openDatabase();
                renderUI();
                // addEventHandlers();
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

            let content = `
                <div id="import" class="ra-mb10">
                    ${importContent}
                </div>
                <div id="results" class="ra-mb10">
                </div>
            `
            twSDK.renderBoxWidget(
                content,
                'AttackPlanManager',
                'attack-plan-manager',
                style
            );

        }

        $('#importPlan').click(function () {
            var importContent = $('#importInput').val();
            importPlan(importContent);
        });

        function initializeInputFields() {
            getAllPlans().then(plans => {
                if (plans.length > 0) {
                    $('#results').html(generateTable(plans[0]));
                } else {
                    console.log("No plans found");
                }
                console.log(plans);
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

            `;

            return css;
        }

        function generateTable(array) {
            let table = '<table>';

            // Generate table headings
            table += '<thead><tr>';
            for (let key in array[0]) {
                table += '<th>' + key + '</th>';
            }
            table += '</tr></thead>';

            // Generate table rows
            table += '<tbody>';
            for (let i = 0; i < array.length; i++) {
                table += '<tr>';
                for (let key in array[i]) {
                    let value = array[i][key];
                    if (typeof value === 'object' && value !== null) {
                        value = JSON.stringify(value);
                    }
                    table += '<td>' + value + '</td>';
                }
                table += '</tr>';
            }
            table += '</tbody>';

            table += '</table>';

            return table;
        }


        function generateImport() {
            const fieldset = `
                <fieldset>
                    <legend>${twSDK.tt('Import attack plan:')}</legend>
                    <textarea id="importInput" class="sb-input-textarea"></textarea>
                    <button id="importPlan" class="btn">${twSDK.tt('Import')}</button>
                </fieldset>
            `;
            return fieldset;
        }

        function importPlan(content) {
            let plan = convertWBPlanToArray(content);

            // Save plan in indexed db
            addPlan(plan);

            console.log(plan);
            $('#results').html(generateTable(plan));
        }

        function convertWBPlanToArray(plan) {
            let planArray = plan.split("\n").filter(str => str.trim() !== "");
            let planObjects = [];
            /* 
            * 0: start village id
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
                    startVillageId: planParts[0],
                    targetVillageId: planParts[1],
                    slowestUnit: planParts[2],
                    arrivalTimestamp: planParts[3],
                    attackType: planParts[4],
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
                let arrTimestamp = (new Date(row[3]).getTime()) + row[4];
                exportWB += row[0] + "&" + row[1] + "&" + row[2] +
                    "&" + arrTimestamp + "&" + row[5] + "&false&true&spear=" + btoa(row[6]) + "/sword=" + btoa(row[7]) +
                    "/axe=" + btoa(row[8]) + "/archer=" + btoa(row[9]) + "/spy=" + btoa(row[10]) +
                    "/light=" + btoa(row[11]) + "/marcher=" + btoa(row[12]) + "/heavy=" + btoa(row[13]) +
                    "/ram=" + btoa(row[14]) + "/catapult=" + btoa(row[15]) + "/knight=" + btoa(row[16]) +
                    "/snob=" + btoa(row[17]) + "/militia=MA==\n";
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

        // This function adds a plan to the "Plans" object store.
        function addPlan(plan) {
            // Open a connection to the database.
            let openRequest = indexedDB.open("sbAttackPlanManager");

            openRequest.onsuccess = function (event) {
                let db = event.target.result;

                // Start a new transaction with the "Plans" object store.
                // The "readwrite" parameter means that the transaction will allow both read and write operations.
                let transaction = db.transaction(["Plans"], "readwrite");

                // Get the "Plans" object store from the transaction.
                let objectStore = transaction.objectStore("Plans");

                // Add the plan to the object store.
                // The add method takes two parameters:
                // 1. The record to add.
                // 2. The key to use for the record. This is optional when the object store has autoIncrement true.
                let addRequest = objectStore.add(plan);

                addRequest.onsuccess = function (event) {
                    console.log("Plan added successfully");
                };

                addRequest.onerror = function (event) {
                    console.log("Error adding plan", event);
                };
            };

            openRequest.onerror = function (event) {
                console.log("Error opening database", event);
            };
        }

        // This function retrieves all plans from the "Plans" object store.
        function getAllPlans() {
            return new Promise((resolve, reject) => {
                // Open a connection to the database.
                let openRequest = indexedDB.open("sbAttackPlanManager");

                openRequest.onsuccess = function (event) {
                    let db = event.target.result;

                    // Start a new transaction with the "Plans" object store.
                    // The "readonly" parameter means that the transaction will only allow read operations.
                    let transaction = db.transaction(["Plans"], "readonly");

                    // Get the "Plans" object store from the transaction.
                    let objectStore = transaction.objectStore("Plans");

                    // Get all plans from the object store.
                    // The getAll method retrieves all records from the object store.
                    let getAllRequest = objectStore.getAll();

                    getAllRequest.onsuccess = function (event) {
                        // The result of the request is an array of records.
                        let plans = event.target.result;
                        console.log("Plans retrieved successfully", plans);
                        resolve(plans); // Resolve the promise with the plans.
                    };

                    getAllRequest.onerror = function (event) {
                        console.log("Error retrieving plans", event);
                        reject(event); // Reject the promise with the error event.
                    };
                };

                openRequest.onerror = function (event) {
                    console.log("Error opening database", event);
                    reject(event); // Reject the promise with the error event.
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
                    console.log("Plan deleted successfully");
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
    }
);