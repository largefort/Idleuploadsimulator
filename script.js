document.addEventListener('DOMContentLoaded', function () {
  var progressBar = document.getElementById('progress');
  var message = document.getElementById('message');
  var fileSizeDisplay = document.getElementById('file-size');
  var uploadBtn = document.getElementById('upload-btn');
  var creditsDisplay = document.getElementById('credits');
  var bitcoinDriverUpgradeBtn = document.getElementById('bitcoin-driver-upgrade');
  var routerSpeedUpgradeBtn = document.getElementById('router-speed-upgrade');
  var networkSpeedDisplay = document.getElementById('network-speed');
  var downloadLink = document.getElementById('download-link');  // Added this line

  var uploadSpeed = 10;
  var networkSpeed = 1;
  var credits = 0;
  var bitcoinDriverUpgradeCost = 50;
  var routerSpeedUpgradeCost = 100;
  var bitcoinDriverLevel = 1;
  var bitcoinDriverUpgradeInterval;
  var uploadAmount = 0;
  var fileCount = 0;
  var fileSize = 0;
  var autoUploadInterval;
  var progressInterval;

  // Open or create the IndexedDB database
  var dbName = 'gameDataDB';
  var request = indexedDB.open(dbName, 1);

  // Setup the database structure if it doesn't exist
  request.onupgradeneeded = function (event) {
    var db = event.target.result;

    if (!db.objectStoreNames.contains('gameData')) {
      db.createObjectStore('gameData', { keyPath: 'id' });
    }
  };

  // Handle successful database opening
  request.onsuccess = function (event) {
    var db = event.target.result;

    // Load game data from IndexedDB
    loadGameDataFromDB(db);

    // Event listener for the download link
    downloadLink.addEventListener('click', function () {
      // Save game data to IndexedDB
      saveGameDataToDB(db);
    });

    // Event listener for the upload button
    uploadBtn.addEventListener('click', uploadFiles);

    // Event listeners for the upgrade buttons
    bitcoinDriverUpgradeBtn.addEventListener('click', upgradeBitcoinDriver);
    routerSpeedUpgradeBtn.addEventListener('click', upgradeRouterSpeed);

    // Initialize other aspects of the game
    automateCredits();
  };

  // Handle errors in opening the database
  request.onerror = function (event) {
    console.error('Error opening IndexedDB:', event.target.errorCode);
  };

  function updateProgress() {
    uploadAmount += uploadSpeed * networkSpeed;
    if (uploadAmount >= 100) {
      uploadAmount = 0;
      clearInterval(progressInterval);
      message.textContent = 'Upload complete!';
      uploadBtn.disabled = false;
      credits += 10;
      creditsDisplay.textContent = credits;
      autoUpload();
    }
    progressBar.style.width = uploadAmount + '%';
    progressBar.textContent = uploadAmount + '%';
  }

  function autoUpload() {
    if (fileCount > 0) {
      uploadFilesAutomatically();
    } else {
      message.textContent = 'All files uploaded!';
      uploadBtn.disabled = false;
      clearInterval(autoUploadInterval);
    }
  }

  function uploadFilesAutomatically() {
    uploadBtn.disabled = true;
    message.textContent = 'Uploading...';
    progressBar.style.width = '0';
    progressBar.textContent = '0%';

    var fileNames = generateFileNames(1);

    message.textContent = 'Uploading: ' + fileNames.join(', ');

    fileSizeDisplay.textContent = 'File Size: 0 MB';

    var uploadTime = 100 / (uploadSpeed * networkSpeed);

    progressInterval = setInterval(function () {
      updateProgress();
      fileSize += (uploadSpeed * networkSpeed) / 100;
      updateFileSizeDisplay();
    }, uploadTime * 1000);
  }

  function updateFileSizeDisplay() {
    if (fileSize < 1) {
      fileSizeDisplay.textContent = 'File Size: ' + (fileSize * 1024).toFixed(2) + ' KB';
    } else if (fileSize < 1024) {
      fileSizeDisplay.textContent = 'File Size: ' + fileSize.toFixed(2) + ' MB';
    } else if (fileSize < 1024 * 1024) {
      fileSizeDisplay.textContent = 'File Size: ' + (fileSize / 1024).toFixed(2) + ' GB';
    } else {
      fileSizeDisplay.textContent = 'File Size: ' + (fileSize / (1024 * 1024)).toFixed(2) + ' TB';
    }
  }

  function startAutoUpload() {
    autoUploadInterval = setInterval(autoUpload, 5000);
  }

  function stopAutoUpload() {
    clearInterval(autoUploadInterval);
    message.textContent = 'Auto-upload stopped.';
    uploadBtn.disabled = false;
  }

  function uploadFiles() {
    fileCount = Math.floor(Math.random() * 5) + 1;
    startAutoUpload();
  }

  function generateFileNames(count) {
    var fileNames = [];
    for (var i = 0; i < count; i++) {
      var fileName = generateRandomFileName();
      fileNames.push(fileName);
    }
    return fileNames;
  }

  function generateRandomFileName() {
    var adjectives = ['Awesome', 'Fantastic', 'Incredible', 'Amazing', 'Super'];
    var nouns = ['File', 'Document', 'Report', 'Data'];
    var extensions = ['.txt', '.pdf', '.doc', '.xlsx'];

    var randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    var randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    var randomExtension = extensions[Math.floor(Math.random() * extensions.length)];

    return randomAdjective + ' ' + randomNoun + randomExtension;
  }

  function upgradeBitcoinDriver() {
    if (credits >= bitcoinDriverUpgradeCost) {
      credits -= bitcoinDriverUpgradeCost;
      bitcoinDriverUpgradeCost *= 2;
      bitcoinDriverLevel++;
      creditsDisplay.textContent = credits;
      bitcoinDriverUpgradeBtn.textContent = 'Upgrade Bitcoin Driver (' + bitcoinDriverUpgradeCost + ' Credits)';
      clearInterval(bitcoinDriverUpgradeInterval);
      automateCredits();
    }
  }

  function automateCredits() {
    var automatedCredits = 1 * bitcoinDriverLevel;
    bitcoinDriverUpgradeInterval = setInterval(function () {
      credits += automatedCredits;
      creditsDisplay.textContent = credits;
    }, 1000);
  }

  function upgradeRouterSpeed() {
    if (credits >= routerSpeedUpgradeCost) {
      credits -= routerSpeedUpgradeCost;
      routerSpeedUpgradeCost *= 2;
      networkSpeed += 1;
      creditsDisplay.textContent = credits;
      routerSpeedUpgradeBtn.textContent = 'Upgrade Router Speed (' + routerSpeedUpgradeCost + ' Credits)';
      networkSpeedDisplay.textContent = 'Network Speed: ' + networkSpeed + ' Mbps';
    }
  }

  function saveGameDataToDB(db) {
    var transaction = db.transaction(['gameData'], 'readwrite');
    var objectStore = transaction.objectStore('gameData');

    // Clear existing data
    objectStore.clear();

    // Save new data
    var gameData = {
      id: 1,
      uploadSpeed: uploadSpeed,
      networkSpeed: networkSpeed,
      credits: credits,
      bitcoinDriverUpgradeCost: bitcoinDriverUpgradeCost,
      routerSpeedUpgradeCost: routerSpeedUpgradeCost,
      bitcoinDriverLevel: bitcoinDriverLevel
    };

    objectStore.add(gameData);

    alert('Game data saved successfully!');
  }

  function loadGameDataFromDB(db) {
    var transaction = db.transaction(['gameData'], 'readonly');
    var objectStore = transaction.objectStore('gameData');

    var request = objectStore.get(1);

    request.onsuccess = function (event) {
      var gameData = event.target.result;

      if (gameData) {
        uploadSpeed = gameData.uploadSpeed;
        networkSpeed = gameData.networkSpeed;
        credits = gameData.credits;
        bitcoinDriverUpgradeCost = gameData.bitcoinDriverUpgradeCost;
        routerSpeedUpgradeCost = gameData.routerSpeedUpgradeCost;
        bitcoinDriverLevel = gameData.bitcoinDriverLevel;

        creditsDisplay.textContent = credits;
        bitcoinDriverUpgradeBtn.textContent = 'Upgrade Bitcoin Driver (' + bitcoinDriverUpgradeCost + ' Credits)';
        routerSpeedUpgradeBtn.textContent = 'Upgrade Router Speed (' + routerSpeedUpgradeCost + ' Credits)';
        networkSpeedDisplay.textContent = 'Network Speed: ' + networkSpeed + ' Mbps';
      }
    };
  }
});

