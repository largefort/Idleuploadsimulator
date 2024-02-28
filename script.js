document.addEventListener('DOMContentLoaded', function() {

  var progressBar = document.getElementById('progress');
  var message = document.getElementById('message');
  var uploadBtn = document.getElementById('upload-btn');
  var creditsDisplay = document.getElementById('credits');
  var bitcoinDriverUpgradeBtn = document.getElementById('bitcoin-driver-upgrade');
  var routerSpeedUpgradeBtn = document.getElementById('router-speed-upgrade');
  var networkSpeedDisplay = document.getElementById('network-speed');
  var uploadSpeed = 10; // Base upload speed in percentage per second
  var networkSpeed = 1; // Base network speed in Mbps
  var credits = 0;
  var bitcoinDriverUpgradeCost = 50;
  var routerSpeedUpgradeCost = 100;
  var bitcoinDriverLevel = 1;
  var bitcoinDriverUpgradeInterval;
  var uploadAmount = 0;

  // Function to save game state
  function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify({
      credits: credits,
      bitcoinDriverUpgradeCost: bitcoinDriverUpgradeCost,
      routerSpeedUpgradeCost: routerSpeedUpgradeCost,
      bitcoinDriverLevel: bitcoinDriverLevel,
      uploadAmount: uploadAmount
    }));
  }

  // Function to load game state
  function loadGameState() {
    var savedState = localStorage.getItem('gameState');
    if (savedState) {
      var gameState = JSON.parse(savedState);
      credits = gameState.credits;
      bitcoinDriverUpgradeCost = gameState.bitcoinDriverUpgradeCost;
      routerSpeedUpgradeCost = gameState.routerSpeedUpgradeCost;
      bitcoinDriverLevel = gameState.bitcoinDriverLevel;
      uploadAmount = gameState.uploadAmount;
      updateCreditsDisplay();
    }
  }

  // Update credits display
  function updateCreditsDisplay() {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    });
    creditsDisplay.textContent = formatter.format(credits);
  }

  function updateProgress() {
    uploadAmount += uploadSpeed * networkSpeed;
    if (uploadAmount >= 100) {
      uploadAmount = 100;
      message.textContent = 'Upload complete!';
      uploadBtn.disabled = false;
      credits += 10; // Credits earned per upload completion
      updateCreditsDisplay();
    }
    progressBar.style.width = uploadAmount + '%';
    progressBar.textContent = uploadAmount + '%';
    saveGameState(); // Save game state on progress update
  }

  function uploadFiles() {
    uploadBtn.disabled = true;
    message.textContent = 'Uploading...';
    progressBar.style.width = '0';
    progressBar.textContent = '0%';
    uploadAmount = 0;
    var uploadTime = 100 / (uploadSpeed * networkSpeed);
    var progressInterval = setInterval(function() {
      uploadAmount += uploadSpeed * networkSpeed;
      if (uploadAmount >= 100) {
        uploadAmount = 100;
        clearInterval(progressInterval);
        message.textContent = 'Upload complete!';
        uploadBtn.disabled = false;
        credits += 10; // Credits earned per upload completion
        updateCreditsDisplay();
      }
      progressBar.style.width = uploadAmount + '%';
      progressBar.textContent = uploadAmount + '%';
      saveGameState(); // Save game state on progress update
    }, uploadTime * 1000);
  }

  function upgradeBitcoinDriver() {
    if (credits >= bitcoinDriverUpgradeCost) {
      credits -= bitcoinDriverUpgradeCost;
      bitcoinDriverUpgradeCost *= 2;
      uploadSpeed += 5; // Increase upload speed by 5 percentage per second
      updateCreditsDisplay();
      bitcoinDriverUpgradeBtn.textContent = 'Upgrade Bitcoin Driver (' + bitcoinDriverUpgradeCost + ' Credits)';
      bitcoinDriverLevel++;
      if (bitcoinDriverLevel === 2) {
        startBitcoinDriverUpgrade(2);
      } else if (bitcoinDriverLevel === 3) {
        startBitcoinDriverUpgrade(5);
      } else if (bitcoinDriverLevel === 4) {
        startBitcoinDriverUpgrade(10);
      }
      saveGameState(); // Save game state after upgrade
    }
  }

  function startBitcoinDriverUpgrade(creditAmount) {
    clearInterval(bitcoinDriverUpgradeInterval);
    bitcoinDriverUpgradeInterval = setInterval(function() {
      credits += creditAmount;
      updateCreditsDisplay();
    }, 1000);
  }

  function upgradeRouterSpeed() {
    if (credits >= routerSpeedUpgradeCost) {
      credits -= routerSpeedUpgradeCost;
      routerSpeedUpgradeCost *= 2;
      networkSpeed += 1; // Increase network speed by 1 Mbps
      updateCreditsDisplay();
      routerSpeedUpgradeBtn.textContent = 'Upgrade Router Speed (' + routerSpeedUpgradeCost + ' Credits)';
      networkSpeedDisplay.textContent = 'Network Speed: ' + networkSpeed + ' Mbps';
      saveGameState(); // Save game state after upgrade
    }
  }

  uploadBtn.addEventListener('click', uploadFiles);
  bitcoinDriverUpgradeBtn.addEventListener('click', upgradeBitcoinDriver);
  routerSpeedUpgradeBtn.addEventListener('click', upgradeRouterSpeed);

  // Load game state on page load
  loadGameState();

});

