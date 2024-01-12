document.addEventListener('DOMContentLoaded', function () {
  var progressBar = document.getElementById('progress');
  var message = document.getElementById('message');
  var fileSizeDisplay = document.getElementById('file-size');
  var uploadBtn = document.getElementById('upload-btn');
  var creditsDisplay = document.getElementById('credits');
  var bitcoinDriverUpgradeBtn = document.getElementById('bitcoin-driver-upgrade');
  var routerSpeedUpgradeBtn = document.getElementById('router-speed-upgrade');
  var networkSpeedDisplay = document.getElementById('network-speed');
  var downloadLink = document.getElementById('download-link');

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

  // Event listener for the download link
  if (downloadLink) {
    downloadLink.addEventListener('click', saveGameData);
  } else {
    console.error("downloadLink element not found");
  }

  uploadBtn.addEventListener('click', uploadFiles);
  bitcoinDriverUpgradeBtn.addEventListener('click', upgradeBitcoinDriver);
  routerSpeedUpgradeBtn.addEventListener('click', upgradeRouterSpeed);

  // Function to save game data every 5 seconds
  setInterval(saveGameData, 5000);

  // Function to load game data on page load
  loadGameData();

  // Initialize
  automateCredits();
});
