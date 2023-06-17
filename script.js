document.addEventListener('DOMContentLoaded', function() {

  var progressBar = document.getElementById('progress');

  var message = document.getElementById('message');

  var uploadBtn = document.getElementById('upload-btn');

  var creditsDisplay = document.getElementById('credits');

  var bitcoinDriverUpgradeBtn = document.getElementById('bitcoin-driver-upgrade');

  var routerSpeedUpgradeBtn = document.getElementById('router-speed-upgrade');

  var uploadSpeed = 10; // Base upload speed in percentage per second

  var networkSpeed = 1; // Base network speed in Mbps

  var credits = 0;

  var bitcoinDriverUpgradeCost = 50;

  var routerSpeedUpgradeCost = 100;

  function updateProgress() {

    uploadAmount += uploadSpeed;

    if (uploadAmount >= 100) {

      uploadAmount = 100;

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

    // Simulate upload progress

    var progressInterval = setInterval(function() {

      uploadAmount += uploadSpeed;

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

    }, 1000);

  }

  function upgradeBitcoinDriver() {

    if (credits >= bitcoinDriverUpgradeCost) {

      credits -= bitcoinDriverUpgradeCost;

      bitcoinDriverUpgradeCost *= 2;

      uploadSpeed += 5; // Increase upload speed by 5 percentage per second

      creditsDisplay.textContent = credits;

      bitcoinDriverUpgradeBtn.textContent = 'Upgrade Bitcoin Driver (' + bitcoinDriverUpgradeCost + ' Credits)';

    }

  }

  function upgradeRouterSpeed() {

    if (credits >= routerSpeedUpgradeCost) {

      credits -= routerSpeedUpgradeCost;

      routerSpeedUpgradeCost *= 2;

      networkSpeed += 1; // Increase network speed by 1 Mbps

      creditsDisplay.textContent = credits;

      routerSpeedUpgradeBtn.textContent = 'Upgrade Router Speed (' + routerSpeedUpgradeCost + ' Credits)';

    }

  }

  uploadBtn.addEventListener('click', uploadFiles);

  bitcoinDriverUpgradeBtn.addEventListener('click', upgradeBitcoinDriver);

  routerSpeedUpgradeBtn.addEventListener('click', upgradeRouterSpeed);

});

