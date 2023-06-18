document.addEventListener('DOMContentLoaded', function() {
  var progressBar = document.getElementById('progress');
  var message = document.getElementById('message');
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
  var selectedFiles = [];

  function updateProgress() {
    uploadAmount += uploadSpeed * networkSpeed;
    if (uploadAmount >= 100) {
      uploadAmount = 100;
      clearInterval(progressInterval);
      message.textContent = 'Upload complete!';
      uploadBtn.disabled = false;
      credits += 10; // Credits earned per upload completion
      creditsDisplay.textContent = credits;
    }
    progressBar.style.width = uploadAmount + '%';
    progressBar.textContent = uploadAmount + '%';
  }

  function uploadFiles() {
    uploadBtn.disabled = true;
    message.textContent = 'Uploading...';
    progressBar.style.width = '0';
    progressBar.textContent = '0%';
    uploadAmount = 0;

    if (selectedFiles.length > 0) {
      var fileNames = selectedFiles.map(function(file) {
        return file.name;
      });

      // Update message with file names
      message.textContent = 'Uploading: ' + fileNames.join(', ');

      // Calculate upload time based on network speed
      var uploadTime = 100 / (uploadSpeed * networkSpeed);

      // Simulate upload progress
      var progressInterval = setInterval(function() {
        updateProgress();
      }, uploadTime * 1000);
    } else {
      message.textContent = 'No files selected.';
      uploadBtn.disabled = false;
    }
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
    bitcoinDriverUpgradeInterval = setInterval(function() {
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

  function createFakeFileText() {
    var fakeFileText = document.getElementById('fake-file-text');

    uploadBtn.addEventListener('click', function() {
      if (selectedFiles.length > 0) {
        var fileNames = selectedFiles.map(function(file) {
          return file.name;
        });
        fakeFileText.textContent = fileNames.join(', ');
      } else {
        fakeFileText.textContent = 'No files selected.';
      }
    });
  }

  uploadBtn.addEventListener('click', uploadFiles);
  bitcoinDriverUpgradeBtn.addEventListener('click', upgradeBitcoinDriver);
  routerSpeedUpgradeBtn.addEventListener('click', upgradeRouterSpeed);
  saveBtn.addEventListener('click', saveGameData);
  loadBtn.addEventListener('click', loadGameData);

  // Initialize
  createFakeFileText();
  automateCredits();
});
