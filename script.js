document.addEventListener('DOMContentLoaded', function () {
  var progressBar = document.getElementById('progress');
  var message = document.getElementById('message');
  var fileSizeDisplay = document.getElementById('file-size'); // Added file size display element
  var uploadBtn = document.getElementById('upload-btn');
  var creditsDisplay = document.getElementById('credits');
  var bitcoinDriverUpgradeBtn = document.getElementById('bitcoin-driver-upgrade');
  var routerSpeedUpgradeBtn = document.getElementById('router-speed-upgrade');
  var networkSpeedDisplay = document.getElementById('network-speed');
  var saveBtn = document.getElementById('save-btn');
  var loadBtn = document.getElementById('load-btn');
  var downloadLink = document.getElementById('download-link');

  var uploadSpeed = 10; // Base upload speed in percentage per second
  var networkSpeed = 1; // Base network speed in Mbps
  var credits = 0;
  var bitcoinDriverUpgradeCost = 50;
  var routerSpeedUpgradeCost = 100;
  var bitcoinDriverLevel = 1;
  var bitcoinDriverUpgradeInterval;
  var uploadAmount = 0;
  var fileCount = 0;
  var fileSize = 0; // Initialize file size
  var autoUploadInterval; // Interval for automatic file uploading

  function updateProgress() {
    uploadAmount += uploadSpeed * networkSpeed;
    if (uploadAmount >= 100) {
      uploadAmount = 0; // Reset upload amount for the next file
      clearInterval(progressInterval);
      message.textContent = 'Upload complete!';
      uploadBtn.disabled = false;
      credits += 10; // Credits earned per upload completion
      creditsDisplay.textContent = credits;
      autoUpload(); // Start uploading the next file automatically
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

    // Generate AI-generated file names
    var fileNames = generateFileNames(1); // Upload one file at a time

    // Update message with file names
    message.textContent = 'Uploading: ' + fileNames.join(', ');

    // Display initial file size
    fileSizeDisplay.textContent = 'File Size: 0 MB';

    // Calculate upload time based on network speed
    var uploadTime = 100 / (uploadSpeed * networkSpeed);

    // Simulate upload progress
    var progressInterval = setInterval(function () {
      updateProgress();
      // Update file size during upload
      fileSize += (uploadSpeed * networkSpeed) / 100; // Assuming 1 MB file for simplicity
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
    autoUploadInterval = setInterval(autoUpload, 5000); // Auto-upload every 5 seconds
  }

  function stopAutoUpload() {
    clearInterval(autoUploadInterval);
    message.textContent = 'Auto-upload stopped.';
    uploadBtn.disabled = false;
  }

  function uploadFiles() {
    // Set a random file count (for example, between 1 and 5)
    fileCount = Math.floor(Math.random() * 5) + 1;
    startAutoUpload(); // Start automatic file uploading
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
      automateCredits(); // Start the upgraded bitcoin driver
    }
  }

  function automateCredits() {
    var automatedCredits = 1 * bitcoinDriverLevel; // Credits earned per second based on bitcoin driver level
    bitcoinDriverUpgradeInterval = setInterval(function () {
      credits += automatedCredits;
      creditsDisplay.textContent = credits;
    }, 1000);
  }

  function upgradeRouterSpeed() {
    if (credits >= routerSpeedUpgradeCost) {
      credits -= routerSpeedUpgradeCost;
      routerSpeedUpgradeCost *= 2;
      networkSpeed += 1; // Increase network speed by 1 Mbps
      creditsDisplay.textContent = credits;
      routerSpeedUpgradeBtn.textContent = 'Upgrade Router Speed (' + routerSpeedUpgradeCost + ' Credits)';
      networkSpeedDisplay.textContent = 'Network Speed: ' + networkSpeed + ' Mbps';
    }
  }

  function saveGameData() {
    var gameData = {
      uploadSpeed: uploadSpeed,
      networkSpeed: networkSpeed,
      credits: credits,
      bitcoinDriverUpgradeCost: bitcoinDriverUpgradeCost,
      routerSpeedUpgradeCost: routerSpeedUpgradeCost,
      bitcoinDriverLevel: bitcoinDriverLevel
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
    alert('Game data saved successfully!');
  }

  function loadGameData() {
    var savedGameData = localStorage.getItem('gameData');
    if (savedGameData) {
      var gameData = JSON.parse(savedGameData);
      uploadSpeed = gameData.uploadSpeed;
      networkSpeed = gameData.networkSpeed;
      credits = gameData.credits;
      bitcoinDriverUpgradeCost = gameData.bitcoinDriverUpgradeCost;
      routerSpeedUpgradeCost = gameData.routerSpeedUpgradeCost;
      bitcoinDriverLevel = gameData.bitcoinDriverLevel;

      // Update display with loaded data
      creditsDisplay.textContent = credits;
      bitcoinDriverUpgradeBtn.textContent = 'Upgrade Bitcoin Driver (' + bitcoinDriverUpgradeCost + ' Credits)';
      routerSpeedUpgradeBtn.textContent = 'Upgrade Router Speed (' + routerSpeedUpgradeCost + ' Credits)';
      networkSpeedDisplay.textContent = 'Network Speed: ' + networkSpeed + ' Mbps';
    }
  }

  uploadBtn.addEventListener('click', uploadFiles);
  bitcoinDriverUpgradeBtn.addEventListener('click', upgradeBitcoinDriver);
  routerSpeedUpgradeBtn.addEventListener('click', upgradeRouterSpeed);
  saveBtn.addEventListener('click', saveGameData);
  loadBtn.addEventListener('click', loadGameData);

  // Initialize
  automateCredits();
});
