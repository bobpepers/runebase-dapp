const setConfigDevelopment = () => {
  window.myConfig = {};
  window.myConfig.apiUrl = 'https://localhost/api/user';
  window.myConfig.wsEndPoint = 'https://localhost';
  window.myConfig.reCaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
}

const setConfigProduction = () => {
  window.myConfig = {};
  window.myConfig.apiUrl = 'https://tip.runebase.io/api/user';
  window.myConfig.wsEndPoint = 'https://tip.runebase.io';
  window.myConfig.reCaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
}
