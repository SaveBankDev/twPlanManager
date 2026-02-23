/*
* Script Name: Plan Manager
* Version: v1.2.2
* Last Updated: 2026-02-23
* Author: SaveBank
* Author Contact: Discord: savebank 
* Approved: Yes
* Approved Date: 2024-05-02
* Mod: RedAlert
*/

/*
    NAME: Tribal Wars Scripts Library
    VERSION: 1.1.8 (beta version)
    LAST UPDATED AT: 2024-05-15
    AUTHOR: RedAlert (redalert_tw)
    AUTHOR URL: https://twscripts.dev/
    CONTRIBUTORS: Shinko to Kuma; Sass, SaveBankDev, DSsecundum, suilenroc
    HELP: https://github.com/RedAlertTW/Tribal-Wars-Scripts-SDK
    STATUS: Work in progress. Not finished 100%.

    This software is provided 'as-is', without any express or implied warranty.
    In no event will the author/s be held liable for any damages arising from the use of this software.
    It is allowed to clone, rehost, re-distribute and all other forms of copying this code without permission from the author/s, for as long as it is not used on commercial products.
    This notice may not be removed or altered from any source distribution.
 */

scriptUrl = document.currentScript.src;

window.twSDK = {
    // variables
    scriptData: {},
    translations: {},
    allowedMarkets: [],
    allowedScreens: [],
    allowedModes: [],
    enableCountApi: true,
    isDebug: false,
    isMobile: jQuery('#mobileHeader').length > 0,
    delayBetweenRequests: 200,
    // helper variables
    market: game_data.market,
    units: game_data.units,
    village: game_data.village,
    buildings: game_data.village.buildings,
    sitterId: game_data.player.sitter > 0 ? `&t=${game_data.player.id}` : '',
    coordsRegex: /\d{1,3}\|\d{1,3}/g,
    dateTimeMatch:
        /(?:[A-Z][a-z]{2}\s+\d{1,2},\s*\d{0,4}\s+|today\s+at\s+|tomorrow\s+at\s+)\d{1,2}:\d{2}:\d{2}:?\.?\d{0,3}/,
    worldInfoInterface: '/interface.php?func=get_config',
    unitInfoInterface: '/interface.php?func=get_unit_info',
    buildingInfoInterface: '/interface.php?func=get_building_info',
    worldDataVillages: '/map/village.txt',
    worldDataPlayers: '/map/player.txt',
    worldDataTribes: '/map/ally.txt',
    worldDataConquests: '/map/conquer_extended.txt',
    // game constants
    // https://help.tribalwars.net/wiki/Points
    buildingPoints: {
        main: [
            10, 2, 2, 3, 4, 4, 5, 6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 44,
            53, 64, 77, 92, 110, 133, 159, 191, 229, 274, 330,
        ],
        barracks: [
            16, 3, 4, 5, 5, 7, 8, 9, 12, 14, 16, 20, 24, 28, 34, 42, 49, 59, 71,
            85, 102, 123, 147, 177, 212,
        ],
        stable: [
            20, 4, 5, 6, 6, 9, 10, 12, 14, 17, 21, 25, 29, 36, 43, 51, 62, 74,
            88, 107,
        ],
        garage: [24, 5, 6, 6, 9, 10, 12, 14, 17, 21, 25, 29, 36, 43, 51],
        chuch: [10, 2, 2],
        church_f: [10],
        watchtower: [
            42, 8, 10, 13, 14, 18, 20, 25, 31, 36, 43, 52, 62, 75, 90, 108, 130,
            155, 186, 224,
        ],
        snob: [512],
        smith: [
            19, 4, 4, 6, 6, 8, 10, 11, 14, 16, 20, 23, 28, 34, 41, 49, 58, 71,
            84, 101,
        ],
        place: [0],
        statue: [24],
        market: [
            10, 2, 2, 3, 4, 4, 5, 6, 7, 9, 10, 12, 15, 18, 21, 26, 31, 37, 44,
            53, 64, 77, 92, 110, 133,
        ],
        wood: [
            6, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27, 32,
            38, 46, 55, 66, 80, 95, 115, 137, 165, 198,
        ],
        stone: [
            6, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27, 32,
            38, 46, 55, 66, 80, 95, 115, 137, 165, 198,
        ],
        iron: [
            6, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27, 32,
            38, 46, 55, 66, 80, 95, 115, 137, 165, 198,
        ],
        farm: [
            5, 1, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27,
            32, 38, 46, 55, 66, 80, 95, 115, 137, 165,
        ],
        storage: [
            6, 1, 2, 1, 2, 3, 3, 3, 5, 5, 6, 8, 8, 11, 13, 15, 19, 22, 27, 32,
            38, 46, 55, 66, 80, 95, 115, 137, 165, 198,
        ],
        hide: [5, 1, 1, 2, 1, 2, 3, 3, 3, 5],
        wall: [
            8, 2, 2, 2, 3, 3, 4, 5, 5, 7, 9, 9, 12, 15, 17, 20, 25, 29, 36, 43,
        ],
    },
    unitsFarmSpace: {
        spear: 1,
        sword: 1,
        axe: 1,
        archer: 1,
        spy: 2,
        light: 4,
        marcher: 5,
        heavy: 6,
        ram: 5,
        catapult: 8,
        knight: 10,
        snob: 100,
    },
    // https://help.tribalwars.net/wiki/Timber_camp
    // https://help.tribalwars.net/wiki/Clay_pit
    // https://help.tribalwars.net/wiki/Iron_mine
    resPerHour: {
        0: 2,
        1: 30,
        2: 35,
        3: 41,
        4: 47,
        5: 55,
        6: 64,
        7: 74,
        8: 86,
        9: 100,
        10: 117,
        11: 136,
        12: 158,
        13: 184,
        14: 214,
        15: 249,
        16: 289,
        17: 337,
        18: 391,
        19: 455,
        20: 530,
        21: 616,
        22: 717,
        23: 833,
        24: 969,
        25: 1127,
        26: 1311,
        27: 1525,
        28: 1774,
        29: 2063,
        30: 2400,
    },
    watchtowerLevels: [
        1.1, 1.3, 1.5, 1.7, 2, 2.3, 2.6, 3, 3.4, 3.9, 4.4, 5.1, 5.8, 6.7, 7.6,
        8.7, 10, 11.5, 13.1, 15,
    ],

    // internal methods
    _initDebug: function () {
        const scriptInfo = this.scriptInfo();
        console.debug(`${scriptInfo} It works 🚀!`);
        console.debug(`${scriptInfo} HELP:`, this.scriptData.helpLink);
        if (this.isDebug) {
            console.debug(`${scriptInfo} Market:`, game_data.market);
            console.debug(`${scriptInfo} World:`, game_data.world);
            console.debug(`${scriptInfo} Screen:`, game_data.screen);
            console.debug(
                `${scriptInfo} Game Version:`,
                game_data.majorVersion
            );
            console.debug(`${scriptInfo} Game Build:`, game_data.version);
            console.debug(`${scriptInfo} Locale:`, game_data.locale);
            console.debug(
                `${scriptInfo} PA:`,
                game_data.features.Premium.active
            );
            console.debug(
                `${scriptInfo} LA:`,
                game_data.features.FarmAssistent.active
            );
            console.debug(
                `${scriptInfo} AM:`,
                game_data.features.AccountManager.active
            );
        }
    },

    // public methods
    addGlobalStyle: function () {
        return `
            /* Table Styling */
            .ra-table-container { overflow-y: auto; overflow-x: hidden; height: auto; max-height: 400px; }
            .ra-table th { font-size: 14px; }
            .ra-table th label { margin: 0; padding: 0; }
            .ra-table th,
            .ra-table td { padding: 5px; text-align: center; }
            .ra-table td a { word-break: break-all; }
            .ra-table a:focus { color: blue; }
            .ra-table a.btn:focus { color: #fff; }
            .ra-table tr:nth-of-type(2n) td { background-color: #f0e2be }
            .ra-table tr:nth-of-type(2n+1) td { background-color: #fff5da; }

            .ra-table-v2 th,
            .ra-table-v2 td { text-align: left; }

            .ra-table-v3 { border: 2px solid #bd9c5a; }
            .ra-table-v3 th,
            .ra-table-v3 td { border-collapse: separate; border: 1px solid #bd9c5a; text-align: left; }

            /* Inputs */
            .ra-textarea { width: 100%; height: 80px; resize: none; }

            /* Popup */
            .ra-popup-content { width: 360px; }
            .ra-popup-content * { box-sizing: border-box; }
            .ra-popup-content input[type="text"] { padding: 3px; width: 100%; }
            .ra-popup-content .btn-confirm-yes { padding: 3px !important; }
            .ra-popup-content label { display: block; margin-bottom: 5px; font-weight: 600; }
            .ra-popup-content > div { margin-bottom: 15px; }
            .ra-popup-content > div:last-child { margin-bottom: 0 !important; }
            .ra-popup-content textarea { width: 100%; height: 100px; resize: none; }

            /* Elements */
            .ra-details { display: block; margin-bottom: 8px; border: 1px solid #603000; padding: 8px; border-radius: 4px; }
            .ra-details summary { font-weight: 600; cursor: pointer; }
            .ra-details p { margin: 10px 0 0 0; padding: 0; }

            /* Helpers */
            .ra-pa5 { padding: 5px !important; }
            .ra-mt15 { margin-top: 15px !important; }
            .ra-mb10 { margin-bottom: 10px !important; }
            .ra-mb15 { margin-bottom: 15px !important; }
            .ra-tal { text-align: left !important; }
            .ra-tac { text-align: center !important; }
            .ra-tar { text-align: right !important; }

            /* RESPONSIVE */
            @media (max-width: 480px) {
                .ra-fixed-widget {
                    position: relative !important;
                    top: 0;
                    left: 0;
                    display: block;
                    width: auto;
                    height: auto;
                    z-index: 1;
                }

                .ra-box-widget {
                    position: relative;
                    display: block;
                    box-sizing: border-box;
                    width: 97%;
                    height: auto;
                    margin: 10px auto;
                }

                .ra-table {
                    border-collapse: collapse !important;
                }

                .custom-close-button { display: none; }
                .ra-fixed-widget h3 { margin-bottom: 15px; }
                .ra-popup-content { width: 100%; }
            }
        `;
    },
    arraysIntersection: function () {
        var result = [];
        var lists;

        if (arguments.length === 1) {
            lists = arguments[0];
        } else {
            lists = arguments;
        }

        for (var i = 0; i < lists.length; i++) {
            var currentList = lists[i];
            for (var y = 0; y < currentList.length; y++) {
                var currentValue = currentList[y];
                if (result.indexOf(currentValue) === -1) {
                    var existsInAll = true;
                    for (var x = 0; x < lists.length; x++) {
                        if (lists[x].indexOf(currentValue) === -1) {
                            existsInAll = false;
                            break;
                        }
                    }
                    if (existsInAll) {
                        result.push(currentValue);
                    }
                }
            }
        }
        return result;
    },
    buildUnitsPicker: function (
        selectedUnits = [],
        unitsToIgnore,
        type = 'checkbox'
    ) {
        let unitsTable = ``;

        let thUnits = ``;
        let tableRow = ``;

        game_data.units.forEach((unit) => {
            if (!unitsToIgnore.includes(unit)) {
                let checked = '';
                if (selectedUnits.includes(unit)) {
                    checked = `checked`;
                }

                thUnits += `
                    <th class="ra-tac">
                        <label for="unit_${unit}">
                            <img src="/graphic/unit/unit_${unit}.png">
                        </label>
                    </th>
                `;

                tableRow += `
                    <td class="ra-tac">
                        <input name="ra_chosen_units" type="${type}" ${checked} id="unit_${unit}" class="ra-unit-selector" value="${unit}" />
                    </td>
                `;
            }
        });

        unitsTable = `
            <table class="ra-table ra-table-v2" width="100%" id="raUnitSelector">
                <thead>
                    <tr>
                        ${thUnits}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        ${tableRow}
                    </tr>
                </tbody>
            </table>
        `;

        return unitsTable;
    },
    calculateCoinsNeededForNthNoble: function (noble) {
        return (noble * noble + noble) / 2;
    },
    calculateDistanceFromCurrentVillage: function (coord) {
        const x1 = game_data.village.x;
        const y1 = game_data.village.y;
        const [x2, y2] = coord.split('|');
        const deltaX = Math.abs(x1 - x2);
        const deltaY = Math.abs(y1 - y2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },
    calculateDistance: function (from, to) {
        const [x1, y1] = from.split('|');
        const [x2, y2] = to.split('|');
        const deltaX = Math.abs(x1 - x2);
        const deltaY = Math.abs(y1 - y2);
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    },
    calculatePercentages: function (amount, total) {
        if (amount === undefined) amount = 0;
        return parseFloat((amount / total) * 100).toFixed(2);
    },
    calculateTimesByDistance: async function (distance) {
        const _self = this;

        const times = [];
        const travelTimes = [];

        const unitInfo = await _self.getWorldUnitInfo();
        const worldConfig = await _self.getWorldConfig();

        for (let [key, value] of Object.entries(unitInfo.config)) {
            times.push(value.speed);
        }

        const { speed, unit_speed } = worldConfig.config;

        times.forEach((time) => {
            let travelTime = Math.round(
                (distance * time * 60) / speed / unit_speed
            );
            travelTime = _self.secondsToHms(travelTime);
            travelTimes.push(travelTime);
        });

        return travelTimes;
    },
    checkValidLocation: function (type) {
        switch (type) {
            case 'screen':
                return this.allowedScreens.includes(
                    this.getParameterByName('screen')
                );
            case 'mode':
                return this.allowedModes.includes(
                    this.getParameterByName('mode')
                );
            default:
                return false;
        }
    },
    checkValidMarket: function () {
        if (this.market === 'yy') return true;
        return this.allowedMarkets.includes(this.market);
    },
    cleanString: function (string) {
        try {
            return decodeURIComponent(string).replace(/\+/g, ' ');
        } catch (error) {
            console.error(error, string);
            return string;
        }
    },
    copyToClipboard: function (string) {
        navigator.clipboard.writeText(string);
    },
    createUUID: function () {
        return crypto.randomUUID();
    },
    csvToArray: function (strData, strDelimiter = ',') {
        var objPattern = new RegExp(
            '(\\' +
                strDelimiter +
                '|\\r?\\n|\\r|^)' +
                '(?:"([^"]*(?:""[^"]*)*)"|' +
                '([^"\\' +
                strDelimiter +
                '\\r\\n]*))',
            'gi'
        );
        var arrData = [[]];
        var arrMatches = null;
        while ((arrMatches = objPattern.exec(strData))) {
            var strMatchedDelimiter = arrMatches[1];
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ) {
                arrData.push([]);
            }
            var strMatchedValue;

            if (arrMatches[2]) {
                strMatchedValue = arrMatches[2].replace(
                    new RegExp('""', 'g'),
                    '"'
                );
            } else {
                strMatchedValue = arrMatches[3];
            }
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        return arrData;
    },
    decryptString: function (str) {
        const alphabet =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
        let decryptedStr = '';

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const index = alphabet.indexOf(char);

            if (index === -1) {
                // Character is not in the alphabet, leave it as-is
                decryptedStr += char;
            } else {
                // Substitue the character with its corresponding shifted character
                const shiftedIndex = (index - 3 + 94) % 94;
                decryptedStr += alphabet[shiftedIndex];
            }
        }

        return decryptedStr;
    },
    encryptString: function (str) {
        const alphabet =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
        let encryptedStr = '';

        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const index = alphabet.indexOf(char);

            if (index === -1) {
                // Character is not in the alphabet, leave it as-is
                encryptedStr += char;
            } else {
                // Substitue the character with its corresponding shifted character
                const shiftedIndex = (index + 3) % 94;
                encryptedStr += alphabet[shiftedIndex];
            }
        }

        return encryptedStr;
    },
    filterVillagesByPlayerIds: function (playerIds, villages) {
        const playerVillages = [];
        villages.forEach((village) => {
            if (playerIds.includes(parseInt(village[4]))) {
                const coordinate = village[2] + '|' + village[3];
                playerVillages.push(coordinate);
            }
        });
        return playerVillages;
    },
    formatAsNumber: function (number) {
        return parseInt(number).toLocaleString('de');
    },
    formatDateTime: function (dateTime) {
        dateTime = new Date(dateTime);
        return (
            this.zeroPad(dateTime.getDate(), 2) +
            '/' +
            this.zeroPad(dateTime.getMonth() + 1, 2) +
            '/' +
            dateTime.getFullYear() +
            ' ' +
            this.zeroPad(dateTime.getHours(), 2) +
            ':' +
            this.zeroPad(dateTime.getMinutes(), 2) +
            ':' +
            this.zeroPad(dateTime.getSeconds(), 2)
        );
    },
    frequencyCounter: function (array) {
        return array.reduce(function (acc, curr) {
            if (typeof acc[curr] == 'undefined') {
                acc[curr] = 1;
            } else {
                acc[curr] += 1;
            }
            return acc;
        }, {});
    },
    getAll: function (
        urls, // array of URLs
        onLoad, // called when any URL is loaded, params (index, data)
        onDone, // called when all URLs successfully loaded, no params
        onError // called when a URL load fails or if onLoad throws an exception, params (error)
    ) {
        var numDone = 0;
        var lastRequestTime = 0;
        var minWaitTime = this.delayBetweenRequests; // ms between requests
        loadNext();
        function loadNext() {
            if (numDone == urls.length) {
                onDone();
                return;
            }

            let now = Date.now();
            let timeElapsed = now - lastRequestTime;
            if (timeElapsed < minWaitTime) {
                let timeRemaining = minWaitTime - timeElapsed;
                setTimeout(loadNext, timeRemaining);
                return;
            }
            lastRequestTime = now;
            jQuery
                .get(urls[numDone])
                .done((data) => {
                    try {
                        onLoad(numDone, data);
                        ++numDone;
                        loadNext();
                    } catch (e) {
                        onError(e);
                    }
                })
                .fail((xhr) => {
                    onError(xhr);
                });
        }
    },
    getBuildingsInfo: async function () {
        const TIME_INTERVAL = 60 * 60 * 1000 * 24 * 365; // fetch config only once since they don't change
        const LAST_UPDATED_TIME =
            localStorage.getItem('buildings_info_last_updated') ?? 0;
        let buildingsInfo = [];

        if (LAST_UPDATED_TIME !== null) {
            if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
                const response = await jQuery.ajax({
                    url: this.buildingInfoInterface,
                });
                buildingsInfo = this.xml2json(jQuery(response));
                localStorage.setItem(
                    'buildings_info',
                    JSON.stringify(buildingsInfo)
                );
                localStorage.setItem(
                    'buildings_info_last_updated',
                    Date.parse(new Date())
                );
            } else {
                buildingsInfo = JSON.parse(
                    localStorage.getItem('buildings_info')
                );
            }
        } else {
            const response = await jQuery.ajax({
                url: this.buildingInfoInterface,
            });
            buildingsInfo = this.xml2json(jQuery(response));
            localStorage.setItem('buildings_info', JSON.stringify(unitInfo));
            localStorage.setItem(
                'buildings_info_last_updated',
                Date.parse(new Date())
            );
        }

        return buildingsInfo;
    },
    getContinentByCoord: function (coord) {
        let [x, y] = Array.from(coord.split('|')).map((e) => parseInt(e));
        for (let i = 0; i < 1000; i += 100) {
            //x axes
            for (let j = 0; j < 1000; j += 100) {
                //y axes
                if (i >= x && x < i + 100 && j >= y && y < j + 100) {
                    let nr_continent =
                        parseInt(y / 100) + '' + parseInt(x / 100);
                    return nr_continent;
                }
            }
        }
    },
    getContinentsFromCoordinates: function (coordinates) {
        let continents = [];

        coordinates.forEach((coord) => {
            const continent = twSDK.getContinentByCoord(coord);
            continents.push(continent);
        });

        return [...new Set(continents)];
    },
    getCoordFromString: function (string) {
        if (!string) return [];
        return string.match(this.coordsRegex)[0];
    },
    getDestinationCoordinates: function (config, tribes, players, villages) {
        const {
            playersInput,
            tribesInput,
            continents,
            minCoord,
            maxCoord,
            distCenter,
            center,
            excludedPlayers,
            enable20To1Limit,
            minPoints,
            maxPoints,
            selectiveRandomConfig,
        } = config;

        // get target coordinates
        const chosenPlayers = playersInput.split(',');
        const chosenTribes = tribesInput.split(',');

        const chosenPlayerIds = twSDK.getEntityIdsByArrayIndex(
            chosenPlayers,
            players,
            1
        );
        const chosenTribeIds = twSDK.getEntityIdsByArrayIndex(
            chosenTribes,
            tribes,
            2
        );

        const tribePlayers = twSDK.getTribeMembersById(chosenTribeIds, players);

        const mergedPlayersList = [...tribePlayers, ...chosenPlayerIds];
        let uniquePlayersList = [...new Set(mergedPlayersList)];

        const chosenExcludedPlayers = excludedPlayers.split(',');
        if (chosenExcludedPlayers.length > 0) {
            const excludedPlayersIds = twSDK.getEntityIdsByArrayIndex(
                chosenExcludedPlayers,
                players,
                1
            );
            excludedPlayersIds.forEach((item) => {
                uniquePlayersList = uniquePlayersList.filter(
                    (player) => player !== item
                );
            });
        }

        // filter by 20:1 rule
        if (enable20To1Limit) {
            let uniquePlayersListArray = [];
            uniquePlayersList.forEach((playerId) => {
                players.forEach((player) => {
                    if (parseInt(player[0]) === playerId) {
                        uniquePlayersListArray.push(player);
                    }
                });
            });

            const playersNotBiggerThen20Times = uniquePlayersListArray.filter(
                (player) => {
                    return (
                        parseInt(player[4]) <=
                        parseInt(game_data.player.points) * 20
                    );
                }
            );

            uniquePlayersList = playersNotBiggerThen20Times.map((player) =>
                parseInt(player[0])
            );
        }

        let coordinatesArray = twSDK.filterVillagesByPlayerIds(
            uniquePlayersList,
            villages
        );

        // filter by min and max village points
        if (minPoints || maxPoints) {
            let filteredCoordinatesArray = [];

            coordinatesArray.forEach((coordinate) => {
                villages.forEach((village) => {
                    const villageCoordinate = village[2] + '|' + village[3];
                    if (villageCoordinate === coordinate) {
                        filteredCoordinatesArray.push(village);
                    }
                });
            });

            filteredCoordinatesArray = filteredCoordinatesArray.filter(
                (village) => {
                    const villagePoints = parseInt(village[5]);
                    const minPointsNumber = parseInt(minPoints) || 26;
                    const maxPointsNumber = parseInt(maxPoints) || 12124;
                    if (
                        villagePoints > minPointsNumber &&
                        villagePoints < maxPointsNumber
                    ) {
                        return village;
                    }
                }
            );

            coordinatesArray = filteredCoordinatesArray.map(
                (village) => village[2] + '|' + village[3]
            );
        }

        // filter coordinates by continent
        if (continents.length) {
            let chosenContinentsArray = continents.split(',');
            chosenContinentsArray = chosenContinentsArray.map((item) =>
                item.trim()
            );

            const availableContinents =
                twSDK.getContinentsFromCoordinates(coordinatesArray);
            const filteredVillagesByContinent =
                twSDK.getFilteredVillagesByContinent(
                    coordinatesArray,
                    availableContinents
                );

            const isUserInputValid = chosenContinentsArray.every((item) =>
                availableContinents.includes(item)
            );

            if (isUserInputValid) {
                coordinatesArray = chosenContinentsArray
                    .map((continent) => {
                        if (continent.length && $.isNumeric(continent)) {
                            return [...filteredVillagesByContinent[continent]];
                        } else {
                            return;
                        }
                    })
                    .flat();
            } else {
                return [];
            }
        }

        // filter coordinates by a bounding box of coordinates
        if (minCoord.length && maxCoord.length) {
            const raMinCoordCheck = minCoord.match(twSDK.coordsRegex);
            const raMaxCoordCheck = maxCoord.match(twSDK.coordsRegex);

            if (raMinCoordCheck !== null && raMaxCoordCheck !== null) {
                const [minX, minY] = raMinCoordCheck[0].split('|');
                const [maxX, maxY] = raMaxCoordCheck[0].split('|');

                coordinatesArray = [...coordinatesArray].filter(
                    (coordinate) => {
                        const [x, y] = coordinate.split('|');
                        if (minX <= x && x <= maxX && minY <= y && y <= maxY) {
                            return coordinate;
                        }
                    }
                );
            } else {
                return [];
            }
        }

        // filter by radius
        if (distCenter.length && center.length) {
            if (!$.isNumeric(distCenter)) distCenter = 0;
            const raCenterCheck = center.match(twSDK.coordsRegex);

            if (distCenter !== 0 && raCenterCheck !== null) {
                let coordinatesArrayWithDistance = [];
                coordinatesArray.forEach((coordinate) => {
                    const distance = twSDK.calculateDistance(
                        raCenterCheck[0],
                        coordinate
                    );
                    coordinatesArrayWithDistance.push({
                        coord: coordinate,
                        distance: distance,
                    });
                });

                coordinatesArrayWithDistance =
                    coordinatesArrayWithDistance.filter((item) => {
                        return (
                            parseFloat(item.distance) <= parseFloat(distCenter)
                        );
                    });

                coordinatesArray = coordinatesArrayWithDistance.map(
                    (item) => item.coord
                );
            } else {
                return [];
            }
        }

        // apply multiplier
        if (selectiveRandomConfig) {
            const selectiveRandomizer = selectiveRandomConfig.split(';');

            const makeRepeated = (arr, repeats) =>
                Array.from({ length: repeats }, () => arr).flat();
            const multipliedCoordinatesArray = [];

            selectiveRandomizer.forEach((item) => {
                const [playerName, distribution] = item.split(':');
                if (distribution > 1) {
                    players.forEach((player) => {
                        if (
                            twSDK.cleanString(player[1]) ===
                            twSDK.cleanString(playerName)
                        ) {
                            let playerVillages =
                                twSDK.filterVillagesByPlayerIds(
                                    [parseInt(player[0])],
                                    villages
                                );
                            const flattenedPlayerVillagesArray = makeRepeated(
                                playerVillages,
                                distribution
                            );
                            multipliedCoordinatesArray.push(
                                flattenedPlayerVillagesArray
                            );
                        }
                    });
                }
            });

            coordinatesArray.push(...multipliedCoordinatesArray.flat());
        }

        return coordinatesArray;
    },
    getEntityIdsByArrayIndex: function (chosenItems, items, index) {
        const itemIds = [];
        chosenItems.forEach((chosenItem) => {
            items.forEach((item) => {
                if (
                    twSDK.cleanString(item[index]) ===
                    twSDK.cleanString(chosenItem)
                ) {
                    return itemIds.push(parseInt(item[0]));
                }
            });
        });
        return itemIds;
    },
    getFilteredVillagesByContinent: function (
        playerVillagesCoords,
        continents
    ) {
        let coords = [...playerVillagesCoords];
        let filteredVillagesByContinent = [];

        coords.forEach((coord) => {
            continents.forEach((continent) => {
                let currentVillageContinent = twSDK.getContinentByCoord(coord);
                if (currentVillageContinent === continent) {
                    filteredVillagesByContinent.push({
                        continent: continent,
                        coords: coord,
                    });
                }
            });
        });

        return twSDK.groupArrayByProperty(
            filteredVillagesByContinent,
            'continent',
            'coords'
        );
    },
    getGameFeatures: function () {
        const { Premium, FarmAssistent, AccountManager } = game_data.features;
        const isPA = Premium.active;
        const isLA = FarmAssistent.active;
        const isAM = AccountManager.active;
        return { isPA, isLA, isAM };
    },
    getKeyByValue: function (object, value) {
        return Object.keys(object).find((key) => object[key] === value);
    },
    getLandingTimeFromArrivesIn: function (arrivesIn) {
        const currentServerTime = twSDK.getServerDateTimeObject();
        const [hours, minutes, seconds] = arrivesIn.split(':');
        const totalSeconds = +hours * 3600 + +minutes * 60 + +seconds;
        const arrivalDateTime = new Date(
            currentServerTime.getTime() + totalSeconds * 1000
        );
        return arrivalDateTime;
    },
    getLastCoordFromString: function (string) {
        if (!string) return [];
        const regex = this.coordsRegex;
        let match;
        let lastMatch;
        while ((match = regex.exec(string)) !== null) {
            lastMatch = match;
        }
        return lastMatch ? lastMatch[0] : [];
    },
    getPagesToFetch: function () {
        let list_pages = [];

        const currentPage = twSDK.getParameterByName('page');
        if (currentPage == '-1') return [];

        if (
            document
                .getElementsByClassName('vis')[1]
                .getElementsByTagName('select').length > 0
        ) {
            Array.from(
                document
                    .getElementsByClassName('vis')[1]
                    .getElementsByTagName('select')[0]
            ).forEach(function (item) {
                list_pages.push(item.value);
            });
            list_pages.pop();
        } else if (
            document.getElementsByClassName('paged-nav-item').length > 0
        ) {
            let nr = 0;
            Array.from(
                document.getElementsByClassName('paged-nav-item')
            ).forEach(function (item) {
                let current = item.href;
                current = current.split('page=')[0] + 'page=' + nr;
                nr++;
                list_pages.push(current);
            });
        } else {
            let current_link = window.location.href;
            list_pages.push(current_link);
        }
        list_pages.shift();

        return list_pages;
    },
    getParameterByName: function (name, url = window.location.href) {
        return new URL(url).searchParams.get(name);
    },
    getRelativeImagePath: function (url) {
        const urlParts = url.split('/');
        return `/${urlParts[5]}/${urlParts[6]}/${urlParts[7]}`;
    },
    getServerDateTimeObject: function () {
        const formattedTime = this.getServerDateTime();
        return new Date(formattedTime);
    },
    getServerDateTime: function () {
        const serverTime = jQuery('#serverTime').text();
        const serverDate = jQuery('#serverDate').text();
        const [day, month, year] = serverDate.split('/');
        const serverTimeFormatted =
            year + '-' + month + '-' + day + ' ' + serverTime;
        return serverTimeFormatted;
    },
    getTimeFromString: function (timeLand) {
        let dateLand = '';
        let serverDate = document
            .getElementById('serverDate')
            .innerText.split('/');

        let TIME_PATTERNS = {
            today: 'today at %s',
            tomorrow: 'tomorrow at %s',
            later: 'on %1 at %2',
        };

        if (window.lang) {
            TIME_PATTERNS = {
                today: window.lang['aea2b0aa9ae1534226518faaefffdaad'],
                tomorrow: window.lang['57d28d1b211fddbb7a499ead5bf23079'],
                later: window.lang['0cb274c906d622fa8ce524bcfbb7552d'],
            };
        }

        let todayPattern = new RegExp(
            TIME_PATTERNS.today.replace('%s', '([\\d+|:]+)')
        ).exec(timeLand);
        let tomorrowPattern = new RegExp(
            TIME_PATTERNS.tomorrow.replace('%s', '([\\d+|:]+)')
        ).exec(timeLand);
        let laterDatePattern = new RegExp(
            TIME_PATTERNS.later
                .replace('%1', '([\\d+|\\.]+)')
                .replace('%2', '([\\d+|:]+)')
        ).exec(timeLand);

        if (todayPattern !== null) {
            // today
            dateLand =
                serverDate[0] +
                '/' +
                serverDate[1] +
                '/' +
                serverDate[2] +
                ' ' +
                timeLand.match(/\d+:\d+:\d+:\d+/)[0];
        } else if (tomorrowPattern !== null) {
            // tomorrow
            let tomorrowDate = new Date(
                serverDate[1] + '/' + serverDate[0] + '/' + serverDate[2]
            );
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            dateLand =
                ('0' + tomorrowDate.getDate()).slice(-2) +
                '/' +
                ('0' + (tomorrowDate.getMonth() + 1)).slice(-2) +
                '/' +
                tomorrowDate.getFullYear() +
                ' ' +
                timeLand.match(/\d+:\d+:\d+:\d+/)[0];
        } else {
            // on
            let on = timeLand.match(/\d+.\d+/)[0].split('.');
            dateLand =
                on[0] +
                '/' +
                on[1] +
                '/' +
                serverDate[2] +
                ' ' +
                timeLand.match(/\d+:\d+:\d+:\d+/)[0];
        }

        return dateLand;
    },
    getTravelTimeInSecond: function (distance, unitSpeed) {
        let travelTime = distance * unitSpeed * 60;
        if (travelTime % 1 > 0.5) {
            return (travelTime += 1);
        } else {
            return travelTime;
        }
    },
    getTribeMembersById: function (tribeIds, players) {
        const tribeMemberIds = [];
        players.forEach((player) => {
            if (tribeIds.includes(parseInt(player[2]))) {
                tribeMemberIds.push(parseInt(player[0]));
            }
        });
        return tribeMemberIds;
    },
    getTroop: function (unit) {
        return parseInt(
            document.units[unit].parentNode
                .getElementsByTagName('a')[1]
                .innerHTML.match(/\d+/),
            10
        );
    },
    getVillageBuildings: function () {
        const buildings = game_data.village.buildings;
        const villageBuildings = [];

        for (let [key, value] of Object.entries(buildings)) {
            if (value > 0) {
                villageBuildings.push({
                    building: key,
                    level: value,
                });
            }
        }

        return villageBuildings;
    },
    getWorldConfig: async function () {
        const TIME_INTERVAL = 60 * 60 * 1000 * 24 * 7;
        const LAST_UPDATED_TIME =
            localStorage.getItem('world_config_last_updated') ?? 0;
        let worldConfig = [];

        if (LAST_UPDATED_TIME !== null) {
            if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
                const response = await jQuery.ajax({
                    url: this.worldInfoInterface,
                });
                worldConfig = this.xml2json(jQuery(response));
                localStorage.setItem(
                    'world_config',
                    JSON.stringify(worldConfig)
                );
                localStorage.setItem(
                    'world_config_last_updated',
                    Date.parse(new Date())
                );
            } else {
                worldConfig = JSON.parse(localStorage.getItem('world_config'));
            }
        } else {
            const response = await jQuery.ajax({
                url: this.worldInfoInterface,
            });
            worldConfig = this.xml2json(jQuery(response));
            localStorage.setItem('world_config', JSON.stringify(unitInfo));
            localStorage.setItem(
                'world_config_last_updated',
                Date.parse(new Date())
            );
        }

        return worldConfig;
    },
    getWorldUnitInfo: async function () {
        const TIME_INTERVAL = 60 * 60 * 1000 * 24 * 7;
        const LAST_UPDATED_TIME =
            localStorage.getItem('units_info_last_updated') ?? 0;
        let unitInfo = [];

        if (LAST_UPDATED_TIME !== null) {
            if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
                const response = await jQuery.ajax({
                    url: this.unitInfoInterface,
                });
                unitInfo = this.xml2json(jQuery(response));
                localStorage.setItem('units_info', JSON.stringify(unitInfo));
                localStorage.setItem(
                    'units_info_last_updated',
                    Date.parse(new Date())
                );
            } else {
                unitInfo = JSON.parse(localStorage.getItem('units_info'));
            }
        } else {
            const response = await jQuery.ajax({
                url: this.unitInfoInterface,
            });
            unitInfo = this.xml2json(jQuery(response));
            localStorage.setItem('units_info', JSON.stringify(unitInfo));
            localStorage.setItem(
                'units_info_last_updated',
                Date.parse(new Date())
            );
        }

        return unitInfo;
    },
    groupArrayByProperty: function (array, property, filter) {
        return array.reduce(function (accumulator, object) {
            // get the value of our object(age in our case) to use for group    the array as the array key
            const key = object[property];
            // if the current value is similar to the key(age) don't accumulate the transformed array and leave it empty
            if (!accumulator[key]) {
                accumulator[key] = [];
            }
            // add the value to the array
            accumulator[key].push(object[filter]);
            // return the transformed array
            return accumulator;
            // Also we also set the initial value of reduce() to an empty object
        }, {});
    },
    isArcherWorld: function () {
        return this.units.includes('archer');
    },
    isChurchWorld: function () {
        return 'church' in this.village.buildings;
    },
    isPaladinWorld: function () {
        return this.units.includes('knight');
    },
    isWatchTowerWorld: function () {
        return 'watchtower' in this.village.buildings;
    },
    loadJS: function (url, callback) {
        let scriptTag = document.createElement('script');
        scriptTag.src = url;
        scriptTag.onload = callback;
        scriptTag.onreadystatechange = callback;
        document.body.appendChild(scriptTag);
    },
    redirectTo: function (location) {
        window.location.assign(game_data.link_base_pure + location);
    },
    removeDuplicateObjectsFromArray: function (array, prop) {
        return array.filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    },
    renderBoxWidget: function (body, id, mainClass, customStyle) {
        const globalStyle = this.addGlobalStyle();

        const content = `
            <div class="${mainClass} ra-box-widget" id="${id}">
                <div class="${mainClass}-header">
                    <h3>${this.tt(this.scriptData.name)}</h3>
                </div>
                <div class="${mainClass}-body">
                    ${body}
                </div>
                <div class="${mainClass}-footer">
                    <small>
                        <strong>
                            ${this.tt(this.scriptData.name)} ${
            this.scriptData.version
        }
                        </strong> -
                        <a href="${
                            this.scriptData.authorUrl
                        }" target="_blank" rel="noreferrer noopener">
                            ${this.scriptData.author}
                        </a> -
                        <a href="${
                            this.scriptData.helpLink
                        }" target="_blank" rel="noreferrer noopener">
                            ${this.tt('Help')}
                        </a>
                    </small>
                </div>
            </div>
            <style>
                .${mainClass} { position: relative; display: block; width: 100%; height: auto; clear: both; margin: 10px 0 15px; border: 1px solid #603000; box-sizing: border-box; background: #f4e4bc; }
                .${mainClass} * { box-sizing: border-box; }
                .${mainClass} > div { padding: 10px; }
                .${mainClass} .btn-confirm-yes { padding: 3px; }
                .${mainClass}-header { display: flex; align-items: center; justify-content: space-between; background-color: #c1a264 !important; background-image: url(/graphic/screen/tableheader_bg3.png); background-repeat: repeat-x; }
                .${mainClass}-header h3 { margin: 0; padding: 0; line-height: 1; }
                .${mainClass}-body p { font-size: 14px; }
                .${mainClass}-body label { display: block; font-weight: 600; margin-bottom: 6px; }
                
                ${globalStyle}

                /* Custom Style */
                ${customStyle}
            </style>
        `;

        if (jQuery(`#${id}`).length < 1) {
            jQuery('#contentContainer').prepend(content);
            jQuery('#mobileContent').prepend(content);
        } else {
            jQuery(`.${mainClass}-body`).html(body);
        }
    },
    renderFixedWidget: function (
        body,
        id,
        mainClass,
        customStyle,
        width,
        customName = this.scriptData.name
    ) {
        const globalStyle = this.addGlobalStyle();

        const content = `
            <div class="${mainClass} ra-fixed-widget" id="${id}">
                <div class="${mainClass}-header">
                    <h3>${this.tt(customName)}</h3>
                </div>
                <div class="${mainClass}-body">
                    ${body}
                </div>
                <div class="${mainClass}-footer">
                    <small>
                        <strong>
                            ${this.tt(customName)} ${this.scriptData.version}
                        </strong> -
                        <a href="${
                            this.scriptData.authorUrl
                        }" target="_blank" rel="noreferrer noopener">
                            ${this.scriptData.author}
                        </a> -
                        <a href="${
                            this.scriptData.helpLink
                        }" target="_blank" rel="noreferrer noopener">
                            ${this.tt('Help')}
                        </a>
                    </small>
                </div>
                <a class="popup_box_close custom-close-button" href="#">&nbsp;</a>
            </div>
            <style>
                .${mainClass} { position: fixed; top: 10vw; right: 10vw; z-index: 99999; border: 2px solid #7d510f; border-radius: 10px; padding: 10px; width: ${
            width ?? '360px'
        }; overflow-y: auto; padding: 10px; background: #e3d5b3 url('/graphic/index/main_bg.jpg') scroll right top repeat; }
                .${mainClass} * { box-sizing: border-box; }

                ${globalStyle}

                /* Custom Style */
                .custom-close-button { right: 0; top: 0; }
                ${customStyle}
            </style>
        `;

        if (jQuery(`#${id}`).length < 1) {
            if (mobiledevice) {
                jQuery('#content_value').prepend(content);
            } else {
                jQuery('#contentContainer').prepend(content);
                jQuery(`#${id}`).draggable({
                    cancel: '.ra-table, input, textarea, button, select, option',
                });

                jQuery(`#${id} .custom-close-button`).on('click', function (e) {
                    e.preventDefault();
                    jQuery(`#${id}`).remove();
                });
            }
        } else {
            jQuery(`.${mainClass}-body`).html(body);
        }
    },
    scriptInfo: function (scriptData = this.scriptData) {
        return `[${scriptData.name} ${scriptData.version}]`;
    },
    secondsToHms: function (timestamp) {
        const hours = Math.floor(timestamp / 60 / 60);
        const minutes = Math.floor(timestamp / 60) - hours * 60;
        const seconds = timestamp % 60;
        return (
            hours.toString().padStart(2, '0') +
            ':' +
            minutes.toString().padStart(2, '0') +
            ':' +
            seconds.toString().padStart(2, '0')
        );
    },
    setUpdateProgress: function (elementToUpdate, valueToSet) {
        jQuery(elementToUpdate).text(valueToSet);
    },
    sortArrayOfObjectsByKey: function (array, key) {
        return array.sort((a, b) => b[key] - a[key]);
    },
    startProgressBar: function (total) {
        const width = jQuery('#content_value')[0].clientWidth;
        const preloaderContent = `
            <div id="progressbar" class="progress-bar" style="margin-bottom:12px;">
                <span class="count label">0/${total}</span>
                <div id="progress">
                    <span class="count label" style="width: ${width}px;">
                        0/${total}
                    </span>
                </div>
            </div>
        `;

        if (this.isMobile) {
            jQuery('#content_value').eq(0).prepend(preloaderContent);
        } else {
            jQuery('#contentContainer').eq(0).prepend(preloaderContent);
        }
    },
    sumOfArrayItemValues: function (array) {
        return array.reduce((a, b) => a + b, 0);
    },
    timeAgo: function (seconds) {
        var interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' Y';

        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' M';

        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' D';

        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' H';

        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' m';

        return Math.floor(seconds) + ' s';
    },
    tt: function (string) {
        if (this.translations[game_data.locale] !== undefined) {
            return this.translations[game_data.locale][string];
        } else {
            return this.translations['en_DK'][string];
        }
    },
    updateProgress: function (elementToUpate, itemsLength, index) {
        jQuery(elementToUpate).text(`${index}/${itemsLength}`);
    },
    updateProgressBar: function (index, total) {
        jQuery('#progress').css('width', `${((index + 1) / total) * 100}%`);
        jQuery('.count').text(`${index + 1}/${total}`);
        if (index + 1 == total) {
            jQuery('#progressbar').fadeOut(1000);
        }
    },
    toggleUploadButtonStatus: function (elementToToggle) {
        jQuery(elementToToggle).attr('disabled', (i, v) => !v);
    },
    xml2json: function ($xml) {
        let data = {};
        const _self = this;
        $.each($xml.children(), function (i) {
            let $this = $(this);
            if ($this.children().length > 0) {
                data[$this.prop('tagName')] = _self.xml2json($this);
            } else {
                data[$this.prop('tagName')] = $.trim($this.text());
            }
        });
        return data;
    },
    worldDataAPI: async function (entity) {
        const TIME_INTERVAL = 60 * 60 * 1000; // fetch data every hour
        const LAST_UPDATED_TIME = localStorage.getItem(
            `${entity}_last_updated`
        );

        // check if entity is allowed and can be fetched
        const allowedEntities = ['village', 'player', 'ally', 'conquer'];
        if (!allowedEntities.includes(entity)) {
            throw new Error(`Entity ${entity} does not exist!`);
        }

        // initial world data
        const worldData = {};

        const dbConfig = {
            village: {
                dbName: 'villagesDb',
                dbTable: 'villages',
                key: 'villageId',
                url: twSDK.worldDataVillages,
            },
            player: {
                dbName: 'playersDb',
                dbTable: 'players',
                key: 'playerId',
                url: twSDK.worldDataPlayers,
            },
            ally: {
                dbName: 'tribesDb',
                dbTable: 'tribes',
                key: 'tribeId',
                url: twSDK.worldDataTribes,
            },
            conquer: {
                dbName: 'conquerDb',
                dbTable: 'conquer',
                key: '',
                url: twSDK.worldDataConquests,
            },
        };

        // Helpers: Fetch entity data and save to localStorage
        const fetchDataAndSave = async () => {
            const DATA_URL = dbConfig[entity].url;

            try {
                // fetch data
                const response = await jQuery.ajax(DATA_URL);
                const data = twSDK.csvToArray(response);
                let responseData = [];

                // prepare data to be saved in db
                switch (entity) {
                    case 'village':
                        responseData = data
                            .filter((item) => {
                                if (item[0] != '') {
                                    return item;
                                }
                            })
                            .map((item) => {
                                return {
                                    villageId: parseInt(item[0]),
                                    villageName: twSDK.cleanString(item[1]),
                                    villageX: item[2],
                                    villageY: item[3],
                                    playerId: parseInt(item[4]),
                                    villagePoints: parseInt(item[5]),
                                    villageType: parseInt(item[6]),
                                };
                            });
                        break;
                    case 'player':
                        responseData = data
                            .filter((item) => {
                                if (item[0] != '') {
                                    return item;
                                }
                            })
                            .map((item) => {
                                return {
                                    playerId: parseInt(item[0]),
                                    playerName: twSDK.cleanString(item[1]),
                                    tribeId: parseInt(item[2]),
                                    villages: parseInt(item[3]),
                                    points: parseInt(item[4]),
                                    rank: parseInt(item[5]),
                                };
                            });
                        break;
                    case 'ally':
                        responseData = data
                            .filter((item) => {
                                if (item[0] != '') {
                                    return item;
                                }
                            })
                            .map((item) => {
                                return {
                                    tribeId: parseInt(item[0]),
                                    tribeName: twSDK.cleanString(item[1]),
                                    tribeTag: twSDK.cleanString(item[2]),
                                    players: parseInt(item[3]),
                                    villages: parseInt(item[4]),
                                    points: parseInt(item[5]),
                                    allPoints: parseInt(item[6]),
                                    rank: parseInt(item[7]),
                                };
                            });
                        break;
                    case 'conquer':
                        responseData = data
                            .filter((item) => {
                                if (item[0] != '') {
                                    return item;
                                }
                            })
                            .map((item) => {
                                return {
                                    villageId: parseInt(item[0]),
                                    unixTimestamp: parseInt(item[1]),
                                    newPlayerId: parseInt(item[2]),
                                    newPlayerId: parseInt(item[3]),
                                    oldTribeId: parseInt(item[4]),
                                    newTribeId: parseInt(item[5]),
                                    villagePoints: parseInt(item[6]),
                                };
                            });
                        break;
                    default:
                        return [];
                }

                // save data in db
                saveToIndexedDbStorage(
                    dbConfig[entity].dbName,
                    dbConfig[entity].dbTable,
                    dbConfig[entity].key,
                    responseData
                );

                // update last updated localStorage item
                localStorage.setItem(
                    `${entity}_last_updated`,
                    Date.parse(new Date())
                );

                return responseData;
            } catch (error) {
                throw Error(`Error fetching ${DATA_URL}`);
            }
        };

        // Helpers: Save to IndexedDb storage
        async function saveToIndexedDbStorage(dbName, table, keyId, data) {
            const dbConnect = indexedDB.open(dbName);

            dbConnect.onupgradeneeded = function () {
                const db = dbConnect.result;
                if (keyId.length) {
                    db.createObjectStore(table, {
                        keyPath: keyId,
                    });
                } else {
                    db.createObjectStore(table, {
                        autoIncrement: true,
                    });
                }
            };

            dbConnect.onsuccess = function () {
                const db = dbConnect.result;
                const transaction = db.transaction(table, 'readwrite');
                const store = transaction.objectStore(table);
                store.clear(); // clean store from items before adding new ones

                data.forEach((item) => {
                    store.put(item);
                });

                UI.SuccessMessage('Database updated!');
            };
        }

        // Helpers: Read all villages from indexedDB
        function getAllData(dbName, table) {
            return new Promise((resolve, reject) => {
                const dbConnect = indexedDB.open(dbName);

                dbConnect.onsuccess = () => {
                    const db = dbConnect.result;

                    const dbQuery = db
                        .transaction(table, 'readwrite')
                        .objectStore(table)
                        .getAll();

                    dbQuery.onsuccess = (event) => {
                        resolve(event.target.result);
                    };

                    dbQuery.onerror = (event) => {
                        reject(event.target.error);
                    };
                };

                dbConnect.onerror = (event) => {
                    reject(event.target.error);
                };
            });
        }

        // Helpers: Transform an array of objects into an array of arrays
        function objectToArray(arrayOfObjects, entity) {
            switch (entity) {
                case 'village':
                    return arrayOfObjects.map((item) => [
                        item.villageId,
                        item.villageName,
                        item.villageX,
                        item.villageY,
                        item.playerId,
                        item.villagePoints,
                        item.villageType,
                    ]);
                case 'player':
                    return arrayOfObjects.map((item) => [
                        item.playerId,
                        item.playerName,
                        item.tribeId,
                        item.villages,
                        item.points,
                        item.rank,
                    ]);
                case 'ally':
                    return arrayOfObjects.map((item) => [
                        item.tribeId,
                        item.tribeName,
                        item.tribeTag,
                        item.players,
                        item.villages,
                        item.points,
                        item.allPoints,
                        item.rank,
                    ]);
                case 'conquer':
                    return arrayOfObjects.map((item) => [
                        item.villageId,
                        item.unixTimestamp,
                        item.newPlayerId,
                        item.newPlayerId,
                        item.oldTribeId,
                        item.newTribeId,
                        item.villagePoints,
                    ]);
                default:
                    return [];
            }
        }

        // decide what to do based on current time and last updated entity time
        if (LAST_UPDATED_TIME !== null) {
            if (
                Date.parse(new Date()) >=
                parseInt(LAST_UPDATED_TIME) + TIME_INTERVAL
            ) {
                worldData[entity] = await fetchDataAndSave();
            } else {
                worldData[entity] = await getAllData(
                    dbConfig[entity].dbName,
                    dbConfig[entity].dbTable
                );
            }
        } else {
            worldData[entity] = await fetchDataAndSave();
        }

        // transform the data so at the end an array of array is returned
        worldData[entity] = objectToArray(worldData[entity], entity);

        return worldData[entity];
    },
    zeroPad: function (num, count) {
        var numZeropad = num + '';
        while (numZeropad.length < count) {
            numZeropad = '0' + numZeropad;
        }
        return numZeropad;
    },

    // initialize library
    init: async function (scriptConfig) {
        const {
            scriptData,
            translations,
            allowedMarkets,
            allowedScreens,
            allowedModes,
            isDebug,
            enableCountApi,
        } = scriptConfig;

        this.scriptData = scriptData;
        this.translations = translations;
        this.allowedMarkets = allowedMarkets;
        this.allowedScreens = allowedScreens;
        this.allowedModes = allowedModes;
        this.enableCountApi = enableCountApi;
        this.isDebug = isDebug;

        twSDK._initDebug();
    },
};


/*
By uploading a user-generated mod (script) for use with Tribal Wars, the creator grants InnoGames a perpetual, irrevocable, worldwide, royalty-free, non-exclusive license to use, reproduce, distribute, publicly display, modify, and create derivative works of the mod. This license permits InnoGames to incorporate the mod into any aspect of the game and its related services, including promotional and commercial endeavors, without any requirement for compensation or attribution to the uploader. The uploader represents and warrants that they have the legal right to grant this license and that the mod does not infringe upon any third-party rights.
*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// CONSTANTS
var sbAllIdsAPM = [
    'planSelector',
    'sendByTime',
    'sendByNumber',
    'useTemplates',
];
var planIds = [];
var sbButtonIDsAPM = [];
var sbPlans = {};

var LAST_REQUEST = 0;


var scriptConfig = {
    scriptData: {
        prefix: 'sbAPM',
        name: 'Plan Manager',
        version: 'v1.2.2',
        author: 'SaveBank',
        authorUrl: 'https://forum.tribalwars.net/index.php?members/savebank.131111/',
        helpLink: 'https://forum.tribalwars.net/index.php?threads/attack-plan-manager.292267/',
    },
    translations: {
        en_DK: {
            'Redirecting...': 'Redirecting...',
            Help: 'Help',
            'Plan Manager': 'Plan Manager',
            'There was an error!': 'There was an error!',
            'Import plan:': 'Import plan:',
            'Import': 'Import',
            'Export plan:': 'Export plan:',
            'Select plan:': 'Select plan:',
            'Export': 'Export',
            'Reset Input': 'Reset Input',
            'Save Plan': 'Save Plan',
            'Delete Plan': 'Delete Plan',
            'Type': 'Type',
            'Unit Template': 'Unit Template',
            'Loading': 'Loading',
            'Select unit template:': 'Select unit template:',
            'Manage Commands': 'Manage Commands',
            'Send by Time (min)': 'Send by Time (min)',
            'Send': 'Send',
            'Send by Number': 'Send by Number',
            'Delete selected commands': 'Delete selected commands',
            'Delete sent commands': 'Delete sent commands',
            'Delete expired commands': 'Delete expired commands',
            'Delete all commands': 'Delete all commands',
            'Load Troop Templates': 'Load Troop Templates',
            'Rename Plan': 'Rename Plan',
            'Unit Preview': 'Unit Preview',
            'Template Preview': 'Template Preview',
            'Use Troop Templates': 'Use Troop Templates',
            'Too many requests! Please wait a moment before trying again.': 'Too many requests! Please wait a moment before trying again.',
            'Delete Commands': 'Delete Commands',
            'Plan Actions': 'Plan Actions',
            'Template Settings': 'Template Settings',
            'Barbarian': 'Barbarian',
            'Exported and copied to clipboard': 'Exported and copied to clipboard',
            'Combine Plan': 'Combine Plan',
            'Please select more plans to combine': 'Please select more plans to combine',
            'Saved': 'Saved',
            'Fetching troop data...': 'Fetching troop data...',
            'Fetching troop data for a large account. This may take a while...': 'Fetching troop data for a large account. This may take a while...',
            'Troop data fetched successfully!': 'Troop data fetched successfully!',
        },
        de_DE: {
            'Redirecting...': 'Weiterleiten...',
            Help: 'Hilfe',
            'Plan Manager': 'Plan Manager',
            'There was an error!': 'Es gab einen Fehler!',
            'Import plan:': 'Plan importieren:',
            'Import': 'Importieren',
            'Export plan:': 'Plan exportieren:',
            'Select plan:': 'Plan auswählen:',
            'Export': 'Exportieren',
            'Reset Input': 'Eingaben zurücksetzen',
            'Delete Plan': 'Löschen',
            'Save Plan': 'Speichern',
            'Type': 'Typ',
            'Unit Template': 'Truppenvorlage',
            'Loading': 'Lade',
            'Select unit template:': 'Truppenvorlage auswählen:',
            'Manage Commands': 'Befehle verwalten',
            'Send by Time (min)': 'Senden nach Zeit (min)',
            'Send': 'Senden',
            'Send by Number': 'Senden nach Anzahl',
            'Delete selected commands': 'Ausgewählte löschen',
            'Delete sent commands': 'Gesendete löschen',
            'Delete expired commands': 'Abgelaufene löschen',
            'Delete all commands': 'Alle löschen',
            'Load Troop Templates': 'Truppenvorlagen laden',
            'Rename Plan': 'Umbenennen',
            'Unit Preview': 'Truppenvorschau',
            'Template Preview': 'Vorlagenvorschau',
            'Use Troop Templates': 'Truppenvorlagen verwenden',
            'Too many requests! Please wait a moment before trying again.': 'Zu viele Anfragen! Bitte warten Sie einen Moment, bevor Sie es erneut versuchen.',
            'Delete Commands': 'Befehle löschen',
            'Plan Actions': 'Aktionen für den Plan',
            'Template Settings': 'Vorlageneinstellungen',
            'Barbarian': 'Barbaren',
            'Exported and copied to clipboard': 'Exportiert und in die Zwischenablage kopiert',
            'Combine Plan': 'Kombinieren',
            'Please select more plans to combine': 'Bitte wählen Sie mehr Pläne aus, um sie zu kombinieren',
            'Saved': 'Gespeichert',
            'Troop data fetched successfully!': 'Truppendaten erfolgreich geladen!',
            'Fetching troop data for a large account. This may take a while...': 'Truppendaten für einen großen Account werden geladen. Dies kann eine Weile dauern...',
            'Troop data fetched successfully!': 'Truppendaten wurden erfolgreich geladen!',
        }
    }
    ,
    allowedMarkets: [],
    allowedScreens: ['overview_villages'],
    allowedModes: ['combined'],
    isDebug: DEBUG,
    enableCountApi: false
};





(async function () {
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
    const unitObject = await fetchTroopsForAllVillages();
    const endTime = performance.now();
    if (DEBUG) console.debug(`${scriptInfo}: Units: `, unitObject);
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
            await getTroopTemplates();
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
                <fieldset class="ra-mb10 sb-grid sb-grid-20-60-40-20">
                    <div>
                        ${planSelectorContent}
                    </div>
                    <fieldset class="ra-mb10 sb-grid sb-grid-4">
                        <legend>${twSDK.tt('Plan Actions')}</legend>
                        <div>
                            <button id="savePlan" class="btn ">${twSDK.tt('Save Plan')}</button>
                        </div>
                        <div>
                            <button id="renamePlan" class="btn ">${twSDK.tt('Rename Plan')}</button>
                        </div>
                        <div>
                            <button id="deletePlan" class="btn ">${twSDK.tt('Delete Plan')}</button>
                        </div>
                        <div>
                            <button id="combinePlan" class="btn ">${twSDK.tt('Combine Plan')}</button>
                        </div>
                    </fieldset>
                    <fieldset class="ra-mb10 sb-grid sb-grid-2">
                        <legend>${twSDK.tt('Template Settings')}</legend>
                        <div>
                            <label for="useTemplates">${twSDK.tt('Use Troop Templates')}</label>
                            <input type="checkbox" id="useTemplates" name="useTemplates">
                        </div>
                        <div>
                            <button id="buttonLoadTemplates" class="btn ">${twSDK.tt('Load Troop Templates')}</button>
                        </div>
                    </fieldset>
                    <div class="ra-tac">
                        <button id="resetInput" class="btn " >${twSDK.tt('Reset Input')}</button>
                    </div>
                </fieldset>
            </div>
            <div id="templateDiv" style="display: none;">
                <fieldset class="ra-mb10">
                    ${unitSelectorContent}
                </fieldset>
            </div>
            <div id="manageCommandsDiv" style="display: none;">
                <fieldset class="ra-mb10 sb-grid sb-grid-17-17-67">
                    <legend>${twSDK.tt('Manage Commands')}</legend>
                    <div>
                        <label for="sendByTime">${twSDK.tt('Send by Time (min)')}</label>
                        <input type="number" id="sendByTime">
                        <button id="buttonByTime" class="btn">${twSDK.tt('Send')}</button>
                    </div>
                    <div>
                        <label for="sendByNumber">${twSDK.tt('Send by Number')}</label>
                        <input type="number" id="sendByNumber">
                        <button id="buttonByNumber" class="btn">${twSDK.tt('Send')}</button>
                    </div>
                    <fieldset class="ra-mb10 sb-grid sb-grid-4">
                        <legend>${twSDK.tt('Delete Commands')}</legend>
                        <div>
                            <button id="buttonDeleteSelected" class="btn ">${twSDK.tt('Delete selected commands')}</button>
                        </div>
                        <div>
                            <button id="buttonDeleteSent" class="btn ">${twSDK.tt('Delete sent commands')}</button>
                        </div>
                        <div>
                            <button id="buttonDeleteExpired" class="btn ">${twSDK.tt('Delete expired commands')}</button>
                        </div>
                        <div>
                            <button id="buttonDeleteAll" class="btn ">${twSDK.tt('Delete all commands')}</button>
                        </div>
                    </fieldset>
                </fieldset>
            </div>
            <div id="sbPlansDiv" class="ra-mb10">
            </div>
        `
        twSDK.renderBoxWidget(
            content,
            'sbPlanManager',
            'sb-plan-manager',
            style
        );

    }

    function addEventHandlers() {
        $('#importPlan').click(function () {
            var importContent = $('#importInput').val();
            importPlan(importContent);
        });
        $('#exportPlan').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let exportContent = sbPlans[parseInt(planId.substring(planId.lastIndexOf('-') + 1))];
            let content = exportWorkbench(exportContent);
            $('#exportInput').val(content);
            twSDK.copyToClipboard(content);
            UI.InfoMessage(twSDK.tt('Exported and copied to clipboard'));
        });
        $('#resetInput').click(function () {
            resetInput();
        });
        $('#savePlan').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let lastDashIndex = planId.lastIndexOf('-');
            let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
            if (DEBUG) {
                console.debug(`${scriptInfo} Saving plan with ID: ${actualPlanId}`);
                console.debug(`${scriptInfo} Details of the plan being saved: `, sbPlans[actualPlanId]);
            }
            modifyPlan(parseInt(actualPlanId), sbPlans[actualPlanId]);
            UI.InfoMessage(twSDK.tt('Saved'));
        });
        $('#deletePlan').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let lastDashIndex = planId.lastIndexOf('-');
            let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
            if (DEBUG) console.debug(`${scriptInfo} Deleting plan with ID: ${actualPlanId}`);

            deletePlan(actualPlanId);
            if (actualPlanId in sbPlans) {
                if (DEBUG) {
                    console.debug(`${scriptInfo} Plan with ID: ${actualPlanId} exists in sbPlans`);
                    console.debug(`${scriptInfo} Current state of sbPlans: `, sbPlans);
                }
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
        $('#renamePlan').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let planNames = localStorageSettings.planNames;
            let newPlanName = planId;
            if (planNames[planId]) {
                let savedPlanName = planNames[planId];
                newPlanName = prompt("Please enter the new name for the plan", savedPlanName);
                if (DEBUG) console.debug(`${scriptInfo} Renaming plan with ID: ${planId} from ${savedPlanName} to ${newPlanName}`);
            } else {
                newPlanName = prompt("Please enter the new name for the plan", planId);
                if (DEBUG) console.debug(`${scriptInfo} Naming new plan with ID: ${planId} as ${newPlanName}`);
            }

            planNames[planId] = newPlanName;
            localStorageSettings.planNames = planNames;
            saveLocalStorage(localStorageSettings);
            populatePlanSelector();
        });
        $('#combinePlan').click(function () {
            if ($('#sbPlanSelectorPopup').length > 0) {
                $('#sbPlanSelectorPopup').remove();
            }
            const style = generateCSS();
            const localStorageSettings = getLocalStorage();
            const planNames = localStorageSettings.planNames;
            let body = '<div class="ra-table-container"><table class="ra-mb10 ra-table" width="100%">';
            for (let i = 0; i < planIds.length; i++) {
                let optionValue = planIds[i];
                let optionText = planNames && planNames[planIds[i]] ? planNames[planIds[i]] : planIds[i];
                body += `<tr width="100%"><td><input type="checkbox" id="${optionValue}" class="plan-checkbox"></td><td><label for="${optionValue}" style="font-weight: bold;">${optionText}</label></td></tr>`;
            }
            body += '</table></div>';
            body += '<button id="combineButton" class="btn ra-mb10">Combine</button>';

            twSDK.renderFixedWidget(
                body,
                'sbPlanSelectorPopup',
                'sbPlanSelectorPopupClass',
                style,
            );

            $('#combineButton').click(function () {
                const localStorageSettings = getLocalStorage();
                let selectedPlanIds = $('.plan-checkbox:checked').map(function () {
                    return this.id;
                }).get();

                if (selectedPlanIds.length < 1) {
                    UI.ErrorMessage('Please select more plans to combine');
                    return;
                }

                if (DEBUG) console.debug(`${scriptInfo} Selected plan IDs: ${selectedPlanIds.join(', ')}`);

                let targetPlanId = selectedPlanIds.includes(localStorageSettings.planSelector) ? localStorageSettings.planSelector : selectedPlanIds[0];

                if (DEBUG) console.debug(`${scriptInfo} Target plan ID: ${targetPlanId}`);

                let actualTargetPlanId = parseInt(targetPlanId.substring(targetPlanId.lastIndexOf('-') + 1));

                // Combine the plans into the target plan
                selectedPlanIds.forEach(planId => {
                    if (planId !== targetPlanId) {
                        let actualPlanIdToCombine = parseInt(planId.substring(planId.lastIndexOf('-') + 1));

                        // Combine the commands into the target plan
                        sbPlans[actualTargetPlanId] = sbPlans[actualTargetPlanId].concat(sbPlans[actualPlanIdToCombine]);
                        deletePlan(actualPlanIdToCombine);
                        delete sbPlans[actualPlanIdToCombine];

                        // Remove the plan ID from the planIds array
                        let index = planIds.indexOf(planId);
                        if (index !== -1) planIds.splice(index, 1);

                        if (DEBUG) console.debug(`${scriptInfo} Combined plan ${planId} into ${targetPlanId}`);
                    }
                });

                // Redo the command IDs
                sbPlans[actualTargetPlanId].forEach((command, index) => {
                    command.commandId = index + 1;
                });

                modifyPlan(actualTargetPlanId, sbPlans[actualTargetPlanId]);
                if ($('#sbPlanSelectorPopup').length > 0) {
                    $('#sbPlanSelectorPopup').remove();
                }
                renderUI();
                addEventHandlers();
                initializeInputFields();
                updateCommandCount();
            });
        });
        $('#buttonDeleteAll').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let lastDashIndex = planId.lastIndexOf('-');
            let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
            if (DEBUG) console.debug(`${scriptInfo} Deleting all commands for plan with ID: ${actualPlanId}`);

            // Remove all corresponding rows from the table
            for (let command of sbPlans[actualPlanId]) {
                $(`#${command.trCommandId}`).remove();
                if (DEBUG) console.debug(`${scriptInfo} Removed command with ID: ${command.trCommandId} from the table`);
            }

            // Clear all commands for the plan
            sbPlans[actualPlanId] = [];
            modifyPlan(parseInt(actualPlanId), sbPlans[actualPlanId]);
            updateCommandCount();
        });

        $('#buttonDeleteExpired').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let lastDashIndex = planId.lastIndexOf('-');
            let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
            if (DEBUG) console.debug(`${scriptInfo} Deleting expired commands for plan with ID: ${actualPlanId}`);

            let now = Date.now();

            let rowsToRemove = [];
            sbPlans[actualPlanId] = sbPlans[actualPlanId].filter(command => {
                if (command.sendTimestamp > now) return true;
                rowsToRemove.push(command.trCommandId);
                return false;
            });

            for (let rowId of rowsToRemove) {
                $(`#${rowId}`).remove();
                if (DEBUG) console.debug(`${scriptInfo} Removed command with ID: ${rowId} from the table`);
            }

            modifyPlan(parseInt(actualPlanId), sbPlans[actualPlanId]);
            updateCommandCount();
        });

        $('#buttonDeleteSent').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let lastDashIndex = planId.lastIndexOf('-');
            let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
            if (DEBUG) console.debug(`${scriptInfo} Deleting sent commands for plan with ID: ${actualPlanId}`);

            let rowsToDelete = [];

            sbPlans[actualPlanId] = sbPlans[actualPlanId].filter(command => {
                if (command.sent === false) return true;
                rowsToDelete.push(command.trCommandId);
                return false;
            });

            for (let rowId of rowsToDelete) {
                $(`#${rowId}`).remove();
                if (DEBUG) console.debug(`${scriptInfo} Removed command with ID: ${rowId} from the table`);
            }

            modifyPlan(parseInt(actualPlanId), sbPlans[actualPlanId]);
            updateCommandCount();
        });

        $('#buttonDeleteSelected').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let lastDashIndex = planId.lastIndexOf('-');
            let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));

            let rowsToDelete = [];
            let commandsToDelete = [];

            for (let command of sbPlans[actualPlanId]) {
                if (command.checkboxId && $(`#${command.checkboxId}`).is(':checked')) {
                    if (DEBUG) console.debug(`${scriptInfo} Checkbox with ID: ${command.checkboxId} is checked for deletion`);

                    rowsToDelete.push($(`#${command.trCommandId}`));
                    commandsToDelete.push(command);
                }
            }

            for (let row of rowsToDelete) {
                row.remove();
                if (DEBUG) console.debug(`${scriptInfo} Removed row with ID: ${row.attr('id')} from the table`);
            }

            sbPlans[actualPlanId] = sbPlans[actualPlanId].filter(command => !commandsToDelete.includes(command));
            if (DEBUG) console.debug(`${scriptInfo} Updated plan with ID: ${actualPlanId} after deleting selected commands`);

            modifyPlan(parseInt(actualPlanId), sbPlans[actualPlanId]);
            updateCommandCount();
        });
        $('#buttonByNumber').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let number = localStorageSettings.sendByNumber;
            let lastDashIndex = planId.lastIndexOf('-');
            let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
            let plan = sbPlans[actualPlanId];
            if (DEBUG) console.debug(`${scriptInfo} Sorting commands for plan with ID: ${actualPlanId} by number: ${number}`);
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
            let commandsToSend = [];
            for (let command of plan) {
                commandsToSend.push(generateLink(parseInt(command.originVillageId), parseInt(command.targetVillageId), command.units, command.trCommandId, command.type));
                command.sent = true;
                $('#' + command.buttonSendId + ' button').addClass('btn-confirm-yes');
                if (commandsToSend.length >= number) break;
            }
            modifyPlan(parseInt(actualPlanId), plan);
            if (DEBUG) console.debug(`${scriptInfo} Generated ${commandsToSend.length} commands to send`);
            let delay = 200;
            for (let link of commandsToSend) {
                setTimeout(() => {
                    window.open(link, '_blank');
                }, delay);
                delay += 200;
            }
            updateCommandCount();
        });
        $('#buttonByTime').click(function () {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let time = parseInt(localStorageSettings.sendByTime) * 60000;
            let lastDashIndex = planId.lastIndexOf('-');
            let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
            let plan = sbPlans[actualPlanId];

            let timeNow = Date.now();
            let commandsToSend = [];

            for (let command of plan) {
                let sendTimestamp = parseInt(command.sendTimestamp);
                let remainingTimestamp = parseInt(sendTimestamp - timeNow);
                if (remainingTimestamp > time) continue;
                commandsToSend.push(generateLink(parseInt(command.originVillageId), parseInt(command.targetVillageId), command.units, command.trCommandId, command.type));
                command.sent = true;
                $('#' + command.buttonSendId + ' button').addClass('btn-confirm-yes');
            }
            if (DEBUG) console.debug(`${scriptInfo} Generated ${commandsToSend.length} commands to send`);
            modifyPlan(parseInt(actualPlanId), plan);
            let delay = 0;
            for (let link of commandsToSend) {
                setTimeout(() => {
                    window.open(link, '_blank');
                }, delay);
                delay += 200;
            }
            updateCommandCount();
        });
        $('#buttonLoadTemplates').click(async function () {
            if (DEBUG) console.debug(`${scriptInfo} Loading troop templates`);
            await getTroopTemplates();
            if (DEBUG) console.debug(`${scriptInfo} Troop templates loaded`);
        });

        $(document).ready(function () {
            var sbStandardButtonIds = [
                "savePlan",
                "renamePlan",
                "deletePlan",
                "combinePlan",
                "buttonLoadTemplates",
                "resetInput",
                "buttonByTime",
                "buttonByNumber",
                "buttonDeleteSelected",
                "buttonDeleteSent",
                "buttonDeleteExpired",
                "buttonDeleteAll"
            ];

            $.each(sbStandardButtonIds, function (index, id) {
                $('#' + id).keydown(function (event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                    }
                });
            });

            if (DEBUG) console.debug(`${scriptInfo} Document is ready, attaching change handlers to IDs`);
            $.each(sbAllIdsAPM, function (index, id) {
                $('#' + id).on('change', handleInputChange);
                if (DEBUG) console.debug(`${scriptInfo} Attached change handler to ID: ${id}`);
            });
        });
    }

    function initializeInputFields() {
        planIds = [];
        sbButtonIDsAPM = [];
        sbPlans = {};
        getAllPlans().then(plans => {
            if (DEBUG) console.debug(`${scriptInfo} Retrieved ${plans.length} plans`);
            if (plans.length > 0) {
                for (let i = 0; i < plans.length; i++) {
                    sbPlans[plans[i].key] = plans[i].plan;
                    $('#sbPlansDiv').append(`<div id="plan-id-${plans[i].key}" class="ra-mb10">${renderPlan(plans[i].plan, plans[i].key)}</div>`);
                    planIds.push(`plan-id-${parseInt(plans[i].key)}`);
                    $('#plan-id-' + plans[i].key).hide();
                    if (DEBUG) console.debug(`${scriptInfo} Processed plan with key: ${plans[i].key}`);
                }
            }
            populatePlanSelector();
            createButtons();
            fillTemplateTable();
            let localStorageSettings = getLocalStorage();
            let sendByTime = localStorageSettings.sendByTime;
            let sendByNumber = localStorageSettings.sendByNumber;
            let planSelector = localStorageSettings.planSelector;
            let useTemplates = parseBool(localStorageSettings.useTemplates);
            if (useTemplates) $('#useTemplates').prop('checked', true);
            if (sendByTime) $('#sendByTime').val(sendByTime);
            if (sendByNumber) $('#sendByNumber').val(sendByNumber);
            if (planSelector === '---') $('#manageCommandsDiv').hide();
            else $('#manageCommandsDiv').show();
            Timing.tickHandlers.timers.init();
            if (DEBUG) console.debug(`${scriptInfo} Initialized input fields`);
            updateCommandCount();
        }).catch(error => {
            console.error("Error retrieving plans", error);
        });
    }

    function generateCSS() {

        let css = `
                .sb-grid-7 {
                    grid-template-columns: repeat(7, 1fr);
                }
                .sb-grid-6 {
                    grid-template-columns: repeat(6, 1fr);
                }
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
                .sb-grid-20-60-40-20 {
                    grid-template-columns: calc(15% - 10px) calc(43% - 30px) calc(30% - 20px) calc(12% - 10px);
                }
                .sb-grid-17-17-67 {
                    grid-template-columns: calc(17% - 20px) calc(17% - 20px) calc(66% - 40px);
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
                .sbPlan tr {
                    white-space: nowrap;
                }
                .btn-bottom {
                    vertical-align: bottom;
                }
                #templateTable {
                    width: 100%;
                }
                #templateTable td{
                    height: 100%;
                }

                #templateTable td {
                    flex: 1;
                }

                .templateContainer {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }

                .templateContainer div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                    border-left: 1px solid #ccc;
                    padding-left: 10px;
                }

                .templateContainer div:first-child {
                    border-left: none;
                }
                #sbPlanManager {
                    min-width: 1200px;
                }
                .sbPlan {
                    width: 100%;
                }
        `;

        return css;
    }
    function renderPlan(plan, id) {
        if (DEBUG) console.debug(`${scriptInfo} Rendering plan with ID: ${id}`);
        tbodyContent = renderPlanRows(plan, id);
        commandCount = updateCommandCount(id);

        let html = `
    <table class="sbPlan ra-table">
        <thead>
            <tr id="planTableHeader">
                <th id="count${id}">${commandCount}</th>
                <th class="ra-tac">Origin Village</th>
                <th class="ra-tac">Attacker</th>
                <th class="ra-tac">Target Village</th>
                <th class="ra-tac">Defender</th>
                <th class="ra-tac">Unit</th>
                <th class="ra-tac">Type</th>
                <th class="ra-tac">Send Time</th>
                <th class="ra-tac">Arrival Time</th>
                <th class="ra-tac">Remaining Time</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        ${tbodyContent}
    </table>
`;

        if (DEBUG) console.debug(`${scriptInfo} Rendered plan with ID: ${id}`);
        return html;
    }

    function updateCommandCount(planId) {
        let commandCount;
        let actualPlanId;
        if (planId) {
            if (!sbPlans || !sbPlans[planId]) {
                if (DEBUG) console.warn(`${scriptInfo} Plan with ID: ${planId} does not exist`);
                return;
            }
            commandCount = sbPlans[planId].length;
            actualPlanId = planId;
        } else {
            let localStorageSettings = getLocalStorage();
            let planId = localStorageSettings.planSelector;
            let lastDashIndex = planId.lastIndexOf('-');
            actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
            if (!sbPlans || !sbPlans[actualPlanId]) {
                if (DEBUG) console.warn(`${scriptInfo} Plan with ID: ${actualPlanId} does not exist`);
                return;
            }
            commandCount = sbPlans[actualPlanId].length;
            document.getElementById(`count${actualPlanId}`).textContent = commandCount;
        }
        if (DEBUG) console.debug(`${scriptInfo} Updated command count for plan with ID: ${actualPlanId}`);
        return commandCount;
    }

    function renderPlanRows(plan, id) {
        if (DEBUG) console.debug(`${scriptInfo} Rendering plan rows for plan with ID: ${id}`);
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
            let commandId = row.commandId;
            row.commandId = parseInt(row.commandId);
            let timeStampId = `${id}-remainingTimestamp-${commandId}`;
            let buttonSendId = `${id}-buttonsend-${commandId}`;
            let buttonDeleteId = `${id}-buttondelete-${commandId}`;
            let checkboxId = `${id}-checkbox-${commandId}`;
            let trCommandId = `${id}-commandId-${commandId}`;
            sbButtonIDsAPM.push(buttonDeleteId);
            sbButtonIDsAPM.push(buttonSendId);

            let distance = getDistanceFromIDs(parseInt(row.originVillageId), parseInt(row.targetVillageId));
            let unitSpeed = parseInt(worldUnitInfo.config[row.slowestUnit].speed);
            let getTravelTimeInMS = twSDK.getTravelTimeInSecond(distance, unitSpeed) * 1000;
            let sendTimestamp = parseInt(parseInt(row.arrivalTimestamp) - getTravelTimeInMS);
            let remainingTimestamp = parseInt(sendTimestamp - Date.now());
            let commandTypeImageLink = commandTypeToImageLink(parseInt(row.type));


            let sendTime = convertTimestampToDateString(sendTimestamp);
            let arrivalTime = convertTimestampToDateString(parseInt(row.arrivalTimestamp));
            row.sendTimestamp = sendTimestamp;
            row.checkboxId = checkboxId;
            row.buttonSendId = buttonSendId;
            row.trCommandId = trCommandId;
            row.remainingTimestamp = remainingTimestamp;

            if (DEBUG) console.debug(`${scriptInfo} Processed row with command ID: ${commandId} for plan with ID: ${id}`);

            tbodyContent += `
        <tr id="${trCommandId}">
            <td class="ra-tac"><input type="checkbox" id="${checkboxId}"></td>
            <td class="ra-tac"><a href="/game.php?village=${game_data.village.id}&screen=info_village&id=${row.originVillageId}"><span class="quickedit-label">${villageMap.get(parseInt(row.originVillageId))[2]}|${villageMap.get(parseInt(row.originVillageId))[3]}</span></a></td>
            <td class="ra-tac">${villageMap.get(parseInt(row.originVillageId))[4] !== 0 ? `<a href="/game.php?village=${game_data.village.id}&screen=info_player&id=${villageMap.get(parseInt(row.originVillageId))[4]}"><span class="quickedit-label">${playersMap.get(parseInt(villageMap.get(parseInt(row.originVillageId))[4]))[1]}</span></a>` : `<span class="quickedit-label">${twSDK.tt('Barbarian')}</span>`}</td>
            <td class="ra-tac"><a href="/game.php?village=${game_data.village.id}&screen=info_village&id=${row.targetVillageId}"><span class="quickedit-label">${villageMap.get(parseInt(row.targetVillageId))[2]}|${villageMap.get(parseInt(row.targetVillageId))[3]}</span></td>
            <td class="ra-tac">${villageMap.get(parseInt(row.targetVillageId))[4] !== 0 ? `<a href="/game.php?village=${game_data.village.id}&screen=info_player&id=${villageMap.get(parseInt(row.targetVillageId))[4]}"><span class="quickedit-label">${playersMap.get(parseInt(villageMap.get(parseInt(row.targetVillageId))[4]))[1]}</span></a>` : `<span class="quickedit-label">${twSDK.tt('Barbarian')}</span>`}</td>
            <td class="ra-tac"><img src="https://dsde.innogamescdn.com/asset/9f9563bf/graphic/unit/unit_${row.slowestUnit}.webp"></td>
            <td class="ra-tac"><img src="${commandTypeImageLink}"></td>
            <td class="ra-tac">${sendTime}</td>
            <td class="ra-tac">${arrivalTime}</td>
            <td id="${timeStampId}" class="ra-tac"><span class="timer" data-endtime>${twSDK.secondsToHms(parseInt(remainingTimestamp / 1000))}</span></td>
            <td id="${buttonSendId}" class="ra-tac"></td>
            <td id="${buttonDeleteId}" class="ra-tac"></td>
        </tr>
    `;
        }
        if (DEBUG) console.debug(`${scriptInfo} Rendered plan rows for plan with ID: ${id}`);
        return tbodyContent;
    }

    function generateLink(villageId1, villageId2, unitInfo, idInfo, commandType) {
        if (DEBUG) console.debug(`${scriptInfo} Generating link for command from village ${villageId1} to village ${villageId2}`);
        let completeLink = getCurrentURL();
        completeLink += twSDK.sitterId.length > 0 ? `?${twSDK.sitterId}&village=${villageId1}&screen=place&target=${villageId2}` : `?village=${villageId1}&screen=place&target=${villageId2}`;

        let villageUnits = unitObject[villageId1];
        let [planId, _, commandId] = idInfo.split('-').map((x, i) => i === 0 ? parseInt(x) : x);
        let templateId = planId + "-templateSelector-" + commandType;
        const localStorageSettings = getLocalStorage();
        let useTemplates = parseBool(localStorageSettings.useTemplates);
        const templateName = localStorageSettings.templateSelections[templateId];

        let template = localStorageSettings.troopTemplates.find(templateObj => templateObj.name === templateName)?.units;

        let unitsToSend = {};
        if (useTemplates) {
            for (let unit of game_data.units) {
                let templateUnit = parseInt(template[unit]);

                if (template[unit] == "all") unitsToSend[unit] = villageUnits[unit];
                else if (templateUnit >= 0) unitsToSend[unit] = Math.min(templateUnit, villageUnits[unit]);
                else if (templateUnit < 0) {
                    let unitAmount = villageUnits[unit] - Math.abs(templateUnit);
                    if (unitAmount > 0) unitsToSend[unit] = unitAmount;
                }
            }
        } else {
            for (let unit of game_data.units) {
                let unitAmount = unitInfo[unit];
                unitsToSend[unit] = unitAmount;
            }
        }

        for (let [unit, amount] of Object.entries(unitsToSend)) {
            completeLink += `&${unit}=${amount}`;
        }

        if (DEBUG) console.debug(`${scriptInfo} Generated link for command from village ${villageId1} to village ${villageId2}`);
        return completeLink;
    }

    function createButtons() {
        if (DEBUG) console.debug(`${scriptInfo} Creating buttons`);
        for (let i = 0; i < sbButtonIDsAPM.length; i++) {
            let buttonId = sbButtonIDsAPM[i];
            let parentElement = document.getElementById(buttonId);
            if (parentElement) parentElement.innerHTML = '';
        }
        for (let i = 0; i < sbButtonIDsAPM.length; i++) {
            let buttonId = sbButtonIDsAPM[i];
            let isSendButton = buttonId.includes('buttonsend');
            let isDeleteButton = buttonId.includes('buttondelete');

            if (isSendButton) {
                let sendButton = document.createElement("button");
                sendButton.innerHTML = "Send";
                sendButton.id = buttonId + "Send";
                sendButton.classList.add("btn");
                sendButton.onclick = function () {
                    let [planId, _, commandId] = buttonId.split('-').map((x, i) => i !== 1 ? parseInt(x) : x);
                    let key;
                    for (key in sbPlans[planId]) {
                        if (sbPlans[planId][key].commandId === commandId) {
                            sbPlans[planId][key].sent = true;
                            break;
                        }
                    }
                    sendButton.classList.add("btn-confirm-yes");
                    let originVillageId = parseInt(sbPlans[planId][key].originVillageId);
                    let targetVillageId = parseInt(sbPlans[planId][key].targetVillageId);
                    let trCommandId = sbPlans[planId][key].trCommandId;
                    let type = sbPlans[planId][key].type;
                    let units = sbPlans[planId][key].units;
                    modifyPlan(parseInt(planId), sbPlans[planId]);
                    if (DEBUG) console.debug(`${scriptInfo} Sending command from village ${originVillageId} to village ${targetVillageId}`);
                    let sendLink = generateLink(originVillageId, targetVillageId, units, trCommandId, type);
                    window.open(sendLink, '_blank');
                }
                sendButton.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                    }
                });
                let [planId, _, commandId] = buttonId.split('-').map((x, i) => i !== 1 ? parseInt(x) : x);
                let key;
                for (key in sbPlans[planId]) {
                    if (parseInt(sbPlans[planId][key].commandId) === commandId) {
                        if (parseBool(sbPlans[planId][key].sent)) {
                            sendButton.classList.add("btn-confirm-yes");
                        }
                        break;
                    }
                }
                let sendParent = document.getElementById(buttonId);
                sendParent.appendChild(sendButton);
            }
            if (isDeleteButton) {
                let deleteButton = document.createElement("button");
                deleteButton.innerHTML = "Delete";
                deleteButton.id = buttonId + "Delete";
                deleteButton.classList.add("btn");
                deleteButton.onclick = function () {
                    let [planId, _, commandId] = buttonId.split('-').map((x, i) => i !== 1 ? parseInt(x) : x);
                    let row = deleteButton.parentNode.parentNode;
                    row.parentNode.removeChild(row);
                    let plan = sbPlans[planId];
                    if (plan) {
                        let commandIndex = plan.findIndex(command => command.commandId === commandId);
                        if (commandIndex !== -1) plan.splice(commandIndex, 1);
                    }
                    modifyPlan(parseInt(planId), plan);
                    if (DEBUG) console.debug(`${scriptInfo} Deleted command with ID ${commandId} from plan ${planId}`);
                    updateCommandCount();
                }
                deleteButton.addEventListener('keydown', function (event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                    }
                });
                let deleteParent = document.getElementById(buttonId);
                deleteParent.appendChild(deleteButton);
            }
        }
        if (DEBUG) console.debug(`${scriptInfo} Finished creating buttons`);
    }
    function parseBool(input) {
        if (typeof input === 'string') {
            return input.toLowerCase() === 'true';
        } else if (typeof input === 'boolean') {
            return input;
        } else {
            console.error(`${scriptInfo}: Invalid input: needs to be a string or boolean.`);
            return false;
        }
    }
    function commandTypeToImageLink(type) {
        const baseURL = 'https://ds-ultimate.de/images/ds_images/';
        const imageMap = {
            0: 'unit/spear.png',
            1: 'unit/sword.png',
            2: 'unit/axe.png',
            3: 'unit/archer.png',
            4: 'unit/spy.png',
            5: 'unit/light.png',
            6: 'unit/marcher.png',
            7: 'unit/heavy.png',
            8: 'unit/ram.png',
            9: 'unit/catapult.png',
            10: 'unit/knight.png',
            11: 'unit/snob.png',
            12: 'wb/def_cav.png',
            13: 'wb/def_archer.png',
            14: 'wb/fake.png',
            15: 'wb/ally.png',
            16: 'wb/move_out.png',
            17: 'wb/move_in.png',
            18: 'wb/bullet_ball_blue.png',
            19: 'wb/bullet_ball_green.png',
            20: 'wb/bullet_ball_yellow.png',
            21: 'wb/bullet_ball_red.png',
            22: 'wb/bullet_ball_grey.png',
            23: 'wb/warning.png',
            24: 'wb/die.png',
            25: 'wb/add.png',
            26: 'wb/remove.png',
            27: 'wb/checkbox.png',
            28: 'wb/eye.png',
            29: 'wb/eye_forbidden.png',
            30: 'buildings/small/main.png',
            31: 'buildings/small/barracks.png',
            32: 'buildings/small/stable.png',
            33: 'buildings/small/garage.png',
            34: 'buildings/small/church.png',
            35: 'buildings/small/snob.png',
            36: 'buildings/small/smith.png',
            37: 'buildings/small/place.png',
            38: 'buildings/small/statue.png',
            39: 'buildings/small/market.png',
            40: 'buildings/small/wood.png',
            41: 'buildings/small/stone.png',
            42: 'buildings/small/iron.png',
            43: 'buildings/small/farm.png',
            44: 'buildings/small/storage.png',
            45: 'buildings/small/wall.png',
            46: 'wb/def_fake.png',
        };

        return baseURL + (imageMap[type] || imageMap[8]);
    }

    function convertTimestampToDateString(timestamp) {
        let date = new Date(timestamp);
        let options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return `${date.toLocaleDateString(undefined, options)}`;
    }

    function getDistanceFromIDs(originVillageId, targetVillageId) {
        let originVillage = villageMap.get(originVillageId)[2] + "|" + villageMap.get(originVillageId)[3];
        let targetVillage = villageMap.get(targetVillageId)[2] + "|" + villageMap.get(targetVillageId)[3];
        return twSDK.calculateDistance(originVillage, targetVillage);
    }


    function generateImport() {
        const html = `
            <legend>${twSDK.tt('Import plan:')}</legend>
            <textarea id="importInput" class="sb-input-textarea"></textarea>
            <div class="ra-mb10">
                <button id="importPlan" class="btn">${twSDK.tt('Import')}</button>
            </div>
        `;
        return html;
    }

    function generateExport() {
        const html = `

                <legend>${twSDK.tt('Export plan:')}</legend>
                <textarea id="exportInput" class="sb-input-textarea"></textarea>
            
            <div class="ra-mb10">
            <button id="exportPlan" class="btn">${twSDK.tt('Export')}</button>
        </div>
        `;
        return html;
    }

    function generateUnitSelector() {
        const html = `
        <legend>${twSDK.tt('Select unit template:')}</legend>
        <table id="templateTable" class="ra-mb10 ra-table">
            <thead>
                <tr>
                    <th>${twSDK.tt('Type')}</th>
                    <th>${twSDK.tt('Unit Template')}</th>
                    <th>${twSDK.tt('Template Preview')}</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        `;

        return html;
    }

    function fillTemplateTable() {
        let table = $('#templateTable');
        let templateDiv = $('#templateDiv');
        let localStorageSettings = getLocalStorage();
        let troopTemplates = localStorageSettings.troopTemplates;
        let planId = localStorageSettings.planSelector;
        let lastDashIndex = planId.lastIndexOf('-');
        let actualPlanId = parseInt(planId.substring(lastDashIndex + 1));
        let plan = sbPlans[actualPlanId];
        let commandTypes = [];

        if (DEBUG) console.debug(`${scriptInfo} Unit templates:`, troopTemplates);

        if (planId === "---") {
            templateDiv.hide();
            return;
        } else {
            templateDiv.show();
        }

        for (let command of plan) {
            if (!commandTypes.includes(command.type)) {
                commandTypes.push(command.type);
            }
        }

        if (DEBUG) console.debug(`${scriptInfo} Command types:`, commandTypes);

        table.find('tbody').empty();

        if (commandTypes.length === 0) {
            templateDiv.hide();
            return;
        } else {
            templateDiv.show();
        }

        for (let commandType of commandTypes) {
            let row = $('<tr></tr>');
            let commandTypeImageLink = commandTypeToImageLink(commandType);
            let commandTypeCell = $('<td></td>').html(`<img src="${commandTypeImageLink}">`);
            row.append(commandTypeCell);
            let templateCell = $('<td></td>');
            let id = `${actualPlanId}-templateSelector-${commandType}`;
            let select = $('<select></select>').attr('id', id);
            for (let template of troopTemplates) {
                let option = $('<option></option>').val(template.name).text(template.name);
                select.append(option);
            }
            let savedOption = localStorageSettings.templateSelections[id];
            if (savedOption) {
                select.val(savedOption);
            } else {
                select.val(troopTemplates[0].name);
                localStorageSettings.templateSelections[id] = troopTemplates[0].name;
                saveLocalStorage(localStorageSettings);
            }
            select.on('change', function () {
                let selectedOption = $(this).val();
                let localStorageSettings = getLocalStorage();
                localStorageSettings.templateSelections[id] = selectedOption;
                saveLocalStorage(localStorageSettings);
                fillTemplateTable();
                if (DEBUG) console.debug(`${scriptInfo} Selected option:`, selectedOption);
            });
            templateCell.append(select);
            let previewCell = $('<td class="templateContainer"></td>');
            let selectedTemplate = troopTemplates.find(template => template.name === localStorageSettings.templateSelections[id]) || troopTemplates[0];
            if (selectedTemplate) {
                for (let unit in selectedTemplate.units) {
                    if (unit === "militia") continue;
                    let unitAmount = selectedTemplate.units[unit];
                    let unitImage = $(`<img class="unitImage" src="/graphic/unit/unit_${unit}.webp" alt="${unit}"> `);
                    let unitPreview = $(`
            <div>
                ${unitImage.prop('outerHTML')}
                <span>${unitAmount}</span>
            </div>
        `);
                    previewCell.append(unitPreview);
                }
            }
            row.append(templateCell);
            row.append(previewCell);
            table.find('tbody').append(row);
        }
        if (DEBUG) console.debug(`${scriptInfo} Filled template table`);
    }

    function generatePlanSelector() {
        const html = `
                <legend>${twSDK.tt('Select plan:')}</legend>
                <select id="planSelector" class="sb-input-select">
                    <option value="---">---</option>
                </select>
            
        `;
        return html;
    }
    function populatePlanSelector() {
        if ($('#sbPlanSelectorPopup').length > 0) {
            $('#sbPlanSelectorPopup').remove();
        }
        let localStorageSettings = getLocalStorage();
        let planNames = localStorageSettings.planNames;
        let planSelector = document.getElementById('planSelector');
        $("#planSelector option").each(function () {
            if ($(this).val() !== '---') $(this).remove();
        });
        for (let i = 0; i < planIds.length; i++) {
            let option = document.createElement('option');
            option.value = planIds[i];
            option.text = planNames && planNames[planIds[i]] ? planNames[planIds[i]] : planIds[i];
            planSelector.appendChild(option);
            if (DEBUG) console.debug(`${scriptInfo} Added plan with ID ${planIds[i]} to the plan selector`);
        }
        for (let planid of planIds) {
            if (planid === localStorageSettings.planSelector) {
                $(`#${planid}`).show();
                planSelector.value = planid;
                if (DEBUG) console.debug(`${scriptInfo} Selected plan with ID ${planid}`);
            } else {
                $(`#${planid}`).hide();
            }
        }
    }


    function importPlan(content) {
        let plan = convertWBPlanToArray(content);
        addPlan(plan)
            .then(key => {
                if (DEBUG) console.debug(`${scriptInfo} Plan added successfully with key: ${key}`);
                let localStorageSettings = getLocalStorage();
                localStorageSettings.planSelector = `plan-id-${key}`;
                saveLocalStorage(localStorageSettings);
                if ($('#sbPlanSelectorPopup').length > 0) {
                    $('#sbPlanSelectorPopup').remove();
                }
                renderUI();
                addEventHandlers();
                initializeInputFields();
            })
            .catch(error => {
                if (DEBUG) console.debug(`${scriptInfo} Error adding plan: ${error}`);
            });
    }

    function convertWBPlanToArray(plan) {
        let planArray = plan.split("\n").filter(str => str.trim() !== "");
        let planObjects = [];

        for (let i = 0; i < planArray.length; i++) {
            let planParts = planArray[i].split("&");
            let units = planParts[7].split("/").reduce((obj, str) => {
                if (!str) {
                    return obj;
                }
                const [unit, value] = str.split("=");
                if (unit === undefined || value === undefined) {
                    return obj;
                }
                obj[unit] = parseInt(atob(value));
                return obj;
            }, {});

            let planObject = {
                commandId: i.toString(),
                originVillageId: parseInt(planParts[0]),
                targetVillageId: parseInt(planParts[1]),
                slowestUnit: planParts[2],
                arrivalTimestamp: parseInt(planParts[3]),
                type: parseInt(planParts[4]),
                drawIn: parseBool(planParts[5]),
                sent: parseBool(planParts[6]),
                units: units
            };

            planObjects.push(planObject);
            if (DEBUG) console.debug(`${scriptInfo}: Plan object ${i} created: `, planObject);
        }

        if (DEBUG) console.debug(`${scriptInfo}: Plan objects created: `, planObjects);
        return planObjects;
    }

    // origin, target, slowest, arrival, type, drawIn=true, sent=false, units
    function exportWorkbench(planArray) {
        let exportWB = "";
        for (let row of planArray) {
            let {
                commandId,
                originVillageId,
                targetVillageId,
                slowestUnit,
                arrivalTimestamp,
                type,
                drawIn,
                sent,
                units
            } = row;

            let arrTimestamp = (new Date(arrivalTimestamp).getTime()) + type;
            exportWB += originVillageId + "&" + targetVillageId + "&" + slowestUnit +
                "&" + arrTimestamp + "&" + type + "&" + drawIn + "&" + sent + "&";

            let unitsArray = [];
            for (let unit in units) {
                unitsArray.push(unit + "=" + btoa(units[unit]));
            }
            exportWB += unitsArray.join('/') + "\n";
        }

        return exportWB;
    }

    function openDatabase() {
        let openRequest = indexedDB.open("sbPlanManager");

        openRequest.onsuccess = function (event) {
            if (DEBUG) console.debug(`${scriptInfo} Database opened successfully`);
            let db = event.target.result;
        };

        openRequest.onerror = function (event) {
            console.error(`${scriptInfo} Error opening database`, event);
        };

        openRequest.onupgradeneeded = function (event) {
            if (DEBUG) console.debug(`${scriptInfo} Upgrading database`);
            let db = event.target.result;

            if (!db.objectStoreNames.contains('Plans')) {
                let objectStore = db.createObjectStore("Plans", { autoIncrement: true });
                if (DEBUG) console.debug(`${scriptInfo} Created new object store 'Plans'`);
            }
        };
    }

    function addPlan(plan) {
        return new Promise((resolve, reject) => {
            let openRequest = indexedDB.open("sbPlanManager");

            openRequest.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction(["Plans"], "readwrite");
                let objectStore = transaction.objectStore("Plans");
                let addRequest = objectStore.add(plan);

                addRequest.onsuccess = function (event) {
                    if (DEBUG) console.debug(`${scriptInfo} Plan added successfully with ID: ${event.target.result}`);
                    resolve(event.target.result);
                };

                addRequest.onerror = function (event) {
                    console.error(`${scriptInfo} Error adding plan:`, event);
                    reject(event);
                };
            };

            openRequest.onerror = function (event) {
                console.error(`${scriptInfo} Error opening database:`, event);
                reject(event);
            };
        });
    }

    function modifyPlan(planId, plan) {
        let openRequest = indexedDB.open("sbPlanManager");

        openRequest.onsuccess = function (event) {
            let db = event.target.result;
            let transaction = db.transaction(["Plans"], "readwrite");
            let objectStore = transaction.objectStore("Plans");
            let putRequest = objectStore.put(plan, planId);

            putRequest.onsuccess = function (event) {
                if (DEBUG) console.debug(`${scriptInfo} Plan modified successfully with ID: ${planId}`);
            };

            putRequest.onerror = function (event) {
                console.error(`${scriptInfo} Error modifying plan with ID: ${planId}`, event);
            };
        };

        openRequest.onerror = function (event) {
            console.error(`${scriptInfo} Error opening database:`, event);
        };
    }

    function getAllPlans() {
        return new Promise((resolve, reject) => {
            let openRequest = indexedDB.open("sbPlanManager");

            openRequest.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction(["Plans"], "readonly");
                let objectStore = transaction.objectStore("Plans");

                let cursorRequest = objectStore.openCursor();

                let plans = [];

                cursorRequest.onsuccess = function (event) {
                    let cursor = event.target.result;
                    if (cursor) {
                        plans.push({ key: cursor.key, plan: cursor.value });
                        cursor.continue();
                    } else {
                        if (DEBUG) console.debug(`${scriptInfo} Plans retrieved successfully:`, plans);
                        resolve(plans);
                    }
                };

                cursorRequest.onerror = function (event) {
                    console.error(`${scriptInfo} Error retrieving plans:`, event);
                    reject(event);
                };
            };

            openRequest.onerror = function (event) {
                console.error(`${scriptInfo} Error opening database:`, event);
                reject(event);
            };
        });
    }

    function deletePlan(planId) {
        let openRequest = indexedDB.open("sbPlanManager");

        openRequest.onsuccess = function (event) {
            let db = event.target.result;
            let transaction = db.transaction(["Plans"], "readwrite");
            let objectStore = transaction.objectStore("Plans");
            let deleteRequest = objectStore.delete(planId);

            deleteRequest.onsuccess = function (event) {
                if (DEBUG) console.debug(`${scriptInfo} Plan deleted successfully with ID: ${planId}`);
            };

            deleteRequest.onerror = function (event) {
                console.error(`${scriptInfo} Error deleting plan with ID: ${planId}`, event);
            };
        };

        openRequest.onerror = function (event) {
            onsole.error(`${scriptInfo} Error opening database:`, event);
        };
    }

    function getCurrentURL() {
        return window.location.protocol + "//" + window.location.host + window.location.pathname;
    }

    async function getTroopTemplates() {
        if (Date.now() - LAST_REQUEST < 200) {
            if (DEBUG) console.debug(`${scriptInfo} Too many requests!`);
            UI.ErrorMessage(twSDK.tt('Too many requests! Please wait a moment before trying again.'));
            return;
        }
        LAST_REQUEST = Date.now();
        let baseUrl
        if (game_data.player.sitter > 0) {
            baseUrl = getCurrentURL() + `?village=${game_data.village.id}&screen=place&mode=templates&t=${game_data.player.id}`;
        } else {
            baseUrl = getCurrentURL() + `?village=${game_data.village.id}&screen=place&mode=templates`;
        }


        let response = await fetch(baseUrl);
        let text = await response.text();

        let templateText = text.split('TroopTemplates.current = ')[1].split(';\n\tTroopTemplates.deleteLink =')[0]
        let troopTemplatesRaw = JSON.parse(templateText) ?? {};

        if (DEBUG) console.debug(`${scriptInfo}: Troop templates: `, troopTemplatesRaw);
        if (troopTemplatesRaw.length === 0) {
            console.warn(`${scriptInfo}: No troop templates found!`);
            return;
        }
        let troopTemplates = [];
        const units = game_data.units;
        if (DEBUG) console.debug(`${scriptInfo}: Units: `, units);
        for (let templateKey in troopTemplatesRaw) {
            let template = troopTemplatesRaw[templateKey];
            let templateUnits = {};
            for (let unit of units) {
                templateUnits[unit] = template[unit] ?? 0;
            }
            for (let unitAll of template.use_all) {
                templateUnits[unitAll] = 'all';
            }
            troopTemplates.push({ name: template.name, units: templateUnits });
            if (DEBUG) console.debug(`${scriptInfo}: Troop template ${template.name}: `, templateUnits);
        }
        if (DEBUG) console.debug(`${scriptInfo}: Troop templates: `, troopTemplates);
        let localStorageSettings = getLocalStorage();
        localStorageSettings.troopTemplates = troopTemplates;
        saveLocalStorage(localStorageSettings);
    }


    function resetInput() {
        let localStorageSettings = getLocalStorage();
        localStorageSettings.planSelector = '---';
        localStorageSettings.sendByTime = 0;
        localStorageSettings.sendByNumber = 0;
        localStorageSettings.useTemplates = true;
        saveLocalStorage(localStorageSettings);
        if (DEBUG) console.debug(`${scriptInfo} Input reset successfully, new settings:`, localStorageSettings);
        if ($('#sbPlanSelectorPopup').length > 0) {
            $('#sbPlanSelectorPopup').remove();
        }
        renderUI();
        addEventHandlers();
        initializeInputFields();
        if (DEBUG) console.debug(`${scriptInfo} UI re-rendered after input reset`);
    }

    function handleInputChange() {
        const inputId = $(this).attr('id');
        let inputValue;

        switch (inputId) {
            case "planSelector":
                if ($('#sbPlanSelectorPopup').length > 0) {
                    $('#sbPlanSelectorPopup').remove();
                }
                inputValue = $(this).val();
                for (let planId of planIds) {
                    planId === inputValue ? $(`#${planId}`).show() : $(`#${planId}`).hide();
                }
                inputValue === '---' ? $('#manageCommandsDiv').hide() : $('#manageCommandsDiv').show();
                break;
            case "sendByTime":
            case "sendByNumber":
                inputValue = parseInt($(this).val());
                inputValue = inputValue < 0 ? 0 : inputValue;
                $(this).val(inputValue);
                break;
            case "useTemplates":
                inputValue = $(this).is(':checked');
                break;
            default:
                if (DEBUG) console.debug(`${scriptInfo}: Unknown id: ${inputId}`);
        }
        if (DEBUG) console.debug(`${scriptInfo}: ${inputId} changed to ${inputValue}`);
        const settingsObject = getLocalStorage();
        settingsObject[inputId] = inputValue;
        saveLocalStorage(settingsObject);
        if (inputId === 'planSelector') fillTemplateTable();
    }

    function getLocalStorage() {
        const localStorageSettings = JSON.parse(localStorage.getItem('sbPlanManager'));
        const expectedSettings = [
            'planSelector',
            'sendByTime',
            'sendByNumber',
            'troopTemplates',
            'templateSelections',
            'planNames',
            'useTemplates'
        ];

        let missingSettings = [];
        if (localStorageSettings) {
            missingSettings = expectedSettings.filter(setting => !(setting in localStorageSettings));
            if (DEBUG && missingSettings.length > 0) console.debug(`${scriptInfo}: Missing settings in localStorage: `, missingSettings);
        }

        if (localStorageSettings && missingSettings.length === 0) {
            if (DEBUG) console.debug(`${scriptInfo}: Local storage settings retrieved successfully:`, localStorageSettings);
            return localStorageSettings;
        } else {
            const defaultSettings = {
                planSelector: '---',
                sendByTime: 0,
                sendByNumber: 0,
                troopTemplates: [],
                templateSelections: {},
                planNames: {},
                useTemplates: true,
            };

            saveLocalStorage(defaultSettings);
            if (DEBUG) console.debug(`${scriptInfo}: Default settings saved to local storage:`, defaultSettings);

            return defaultSettings;
        }
    }
    function saveLocalStorage(settingsObject) {
        localStorage.setItem('sbPlanManager', JSON.stringify(settingsObject));
        if (DEBUG) console.debug(`${scriptInfo}: Settings saved to local storage:`, settingsObject);
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

    async function fetchTroopsForAllVillages() {
        const mobileCheck = jQuery('#mobileHeader').length > 0;
        const totalVillages = parseInt(game_data.player.villages);
        const troopsForGroup = {}; // Changed from array to object
        let pageSize = 0;

        // Function to fetch and process data for a single page
        async function fetchPageData(page) {
            const response = await jQuery.get(
                game_data.link_base_pure +
                `overview_villages&mode=combined&group=0&page=${page}`
            );

            const htmlDoc = jQuery.parseHTML(response);
            const homeTroops = [];

            if (pageSize === 0) {
                pageSize = parseInt(jQuery(htmlDoc).find("input[name='page_size']").val(), 10);
            }

            if (mobileCheck) {
                let table = jQuery(htmlDoc).find('#combined_table tr.nowrap');
                for (let i = 0; i < table.length; i++) {
                    let objTroops = {};
                    let villageId = parseInt(
                        table[i]
                            .getElementsByClassName('quickedit-vn')[0]
                            .getAttribute('data-id')
                    );
                    let listTroops = Array.from(
                        table[i].getElementsByTagName('img')
                    )
                        .filter((e) => e.src.includes('unit'))
                        .map((e) => ({
                            name: e.src
                                .split('unit_')[1]
                                .replace('@2x.webp', ''),
                            value: parseInt(
                                e.parentElement.nextElementSibling.innerText
                            ),
                        }));
                    listTroops.forEach((item) => {
                        objTroops[item.name] = item.value;
                    });

                    objTroops.villageId = villageId;
                    objTroops.coord = villageMap.get(parseInt(villageId));

                    homeTroops.push(objTroops);
                }
            } else {
                const combinedTableRows = jQuery(htmlDoc).find(
                    '#combined_table tr.nowrap'
                );
                const combinedTableHead = jQuery(htmlDoc).find(
                    '#combined_table tr:eq(0) th'
                );

                const combinedTableHeader = [];

                // collect possible buildings and troop types
                jQuery(combinedTableHead).each(function () {
                    const thImage = jQuery(this).find('img').attr('src');
                    if (thImage) {
                        let thImageFilename = thImage.split('/').pop();
                        thImageFilename = thImageFilename.replace('.webp', '');
                        combinedTableHeader.push(thImageFilename);
                    } else {
                        combinedTableHeader.push(null);
                    }
                });

                // collect possible troop types
                combinedTableRows.each(function () {
                    let rowTroops = {};

                    combinedTableHeader.forEach((tableHeader, index) => {
                        if (tableHeader) {
                            if (tableHeader.includes('unit_')) {
                                const villageId = jQuery(this)
                                    .find('td:eq(1) span.quickedit-vn')
                                    .attr('data-id');
                                const unitType = tableHeader.replace(
                                    'unit_',
                                    ''
                                );
                                rowTroops = {
                                    ...rowTroops,
                                    villageId: parseInt(villageId),
                                    [unitType]: parseInt(
                                        jQuery(this)
                                            .find(`td:eq(${index})`)
                                            .text()
                                    ),
                                };
                            }
                        }
                    });
                    rowTroops.coord = villageMap.get(parseInt(rowTroops.villageId));
                    homeTroops.push(rowTroops);
                });
            }

            return homeTroops;
        }

        try {
            if (totalVillages <= 1000) {
                // If the player has less than or equal to 1000 villages, use page=-1 for efficiency
                UI.SuccessMessage(twSDK.tt('Fetching troop data...'));
                const homeTroops = await fetchPageData(-1);

                // Convert array to object with villageId as keys
                homeTroops.forEach(troops => {
                    troopsForGroup[troops.villageId] = troops;
                });
            } else {
                UI.SuccessMessage(twSDK.tt('Fetching troop data for a large account. This may take a while...'));
                let page = 0;
                let totalProcessedVillages = 0;

                // Loop through pages until all villages are processed
                while (totalProcessedVillages < totalVillages) {
                    const homeTroops = await fetchPageData(page);

                    // Convert array to object with villageId as keys
                    homeTroops.forEach(troops => {
                        troopsForGroup[troops.villageId] = troops;
                    });

                    totalProcessedVillages += homeTroops.length;

                    // If the number of processed villages is less than the page size, we have reached the last page
                    if (homeTroops.length < pageSize) {
                        break;
                    }

                    page++;
                    await new Promise(resolve => setTimeout(resolve, 200)); // Wait for 200 ms before the next request
                }
                UI.SuccessMessage(twSDK.tt('Troop data fetched successfully!'));
            }

            return troopsForGroup; // Now returning an object with village IDs as keys
        } catch (error) {
            UI.ErrorMessage(
                twSDK.tt('There was an error while fetching the data!')
            );
            console.error(`${scriptInfo} Error:`, error);
            return {};  // Return empty object instead of empty array on error
        }
    }
})();