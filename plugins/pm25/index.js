module.exports = () => {
  // From https://api.isoyu.com/#/?id=_5-%e5%a4%a9%e6%b0%94%e9%a2%84%e6%8a%a5
  (() => {
    ppet.showMessage('[pm25] 查询中...', 10000, 12);
    fetch(
      `https://api.isoyu.com/api/Weather/get_weather?city=${encodeURIComponent(
        '上海市'
      )}`
    )
      .then(response => response.json())
      .then(data => {
        ppet.showMessage(
          `city: ${data.data.results[0].currentCity}, pm25: ${data.data.results[0].pm25}`,
          8000,
          12
        );
      });
  })();

  return () => {
    //
  };
};
