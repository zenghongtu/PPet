module.exports = () => {
  // From https://www.showdoc.cc/justapi?page_id=957586290908547

  const handleWindowBlur = () => {
    ppet.showMessage('[一言] 请求中...', 10000, 12);
    fetch('https://v1.jinrishici.com/all.json')
      .then(response => response.json())
      .then(data => {
        console.log('data.content: ', data.content);
        ppet.showMessage('[一言]' + data.content, 8000, 12);
      });
  };

  ppet.on('blur', handleWindowBlur);

  return () => {
    ppet.removeListener('blur', handleWindowBlur);
  };
};
