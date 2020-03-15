module.exports = () => {
  const TIME_OUT = 25 * 60 * 1e3; // 25 minutes

  let timer = null;

  const handleWindowBlur = () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      ppet.showMessage('Take a break~~', 8000, 20);
    }, TIME_OUT);
  };

  const handleWindowFocus = () => {
    timer && clearTimeout(timer);
  };

  ppet.on('blur', handleWindowBlur);
  ppet.on('focus', handleWindowFocus);

  return () => {
    ppet.removeListener('blur', handleWindowBlur);
    ppet.removeListener('focus', handleWindowFocus);
  };
};
