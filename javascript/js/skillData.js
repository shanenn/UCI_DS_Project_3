function setSkillDropDown(data) {
  // let path = '../../python/resources/json_datasets/locations.json'
  // fetch(path).then((response) => response.json()).then(function (data) {
  // Populate dropdown with json names data
  // let stateName = ''
  // console.log('here')//data)
  let dMenu = d3.select("#selPlatform")
  let newEle = dMenu.append('option')
  newEle.text('All Platforms')
  newEle.property('value', 'ALL')
  let used = []
  for (i = 0; i < data.length; i++) {
    if (!(used).includes(data[i].PLATFORM)) {
      newEle = dMenu.append('option')
      newEle.text(data[i].PLATFORM)
      newEle.property('value', data[i].PLATFORM)
      used.push(data[i].PLATFORM)
    }
  };
};
  
  
function platformChanged() {
  let path = '../../python/resources/json_datasets/gsearch.json'
  // Use if fecth does not work (CORS Error)
  path = 'https://raw.githubusercontent.com/MrGoots/Project_3/main/python/resources/json_datasets/gsearch.json'
  fetch(path).then((response) => response.json()).then(function(data) {

    let dropdownMenu = d3.select("#selPlatform");
    let platform = dropdownMenu.property("value");
    console.log(platform)
    resetSkillPlots(data, platform)


  });
};
  
// Start of initializing
function init() {
  let path = '../../python/resources/json_datasets/gsearch.json'
  // Use if fecth does not work (CORS Error)
  path = 'https://raw.githubusercontent.com/MrGoots/Project_3/main/python/resources/json_datasets/gsearch.json'
  fetch(path).then((response) => response.json()).then(function(data) {

    setSkillDropDown(data);
    // console.log('dd')
    setSkillPlots(data, 'ALL')
  });

};
  
function getSkillInfo(dataFull, platform = 'ALL') {

  let skillCnt = {}
  for (i = 0; i < dataFull.length; i++) {
    if (platform === 'ALL') {
      // console.log(dataFull.SKILLS)
      for (j = 0; j < dataFull[i].SKILLS.length; j++) {
        if (!(dataFull[i].SKILLS[j] in skillCnt)) {
          skillCnt[dataFull[i].SKILLS[j]] = 0
        };
        skillCnt[dataFull[i].SKILLS[j]]++
      };
    } else if (dataFull[i].PLATFORM === platform) {
      for (j = 0; j < dataFull[i].SKILLS.length; j++) {

        if (!(dataFull[i].SKILLS[j] in skillCnt)) {
          skillCnt[dataFull[i].SKILLS[j]] = 0
        };
        skillCnt[dataFull[i].SKILLS[j]]++
      };
    }

  };
  
  // Create items array
  skillSort = Object.keys(skillCnt).map(function(key) {
    return [key, skillCnt[key]];
  });

  // Sort the array based on the second element
  skillSort.sort(function(first, second) {
    return second[1] - first[1];
  });
  
  
  let x = []
  let y = []
  let len = 10
  if (skillSort.length < len) {
    len = skillSort.length
  }
  for (i = 0; i < len; i++) {
    x.push(skillSort[i][0])
    y.push(skillSort[i][1])
  };

  return [x, y]
};
  
function setSkillPlots(dataFull) {

  let x
  let y
  [x, y] = getSkillInfo(dataFull)

  let sum = 0;

  // iterate over each item in the array
  for (i = 0; i < 5; i++) {
    sum += y[i];
  };

  let y2 = []
  for (i = 0; i < 5; i++) {
    y2.push(Math.round((y[i] / sum) * 270));
  };
  
  
  var options = {
    title: {
      text: 'Number of Times Skill(s) Mentioned',
      align: 'center'
    },
    series: y2,
    chart: {
      height: 390,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          }
        }
      }
    },
    // colors: ['#003366', '#46769b', '#46769b', '#5e8cad', '#75a2bf'],
    labels: x.slice(0, 5),
    legend: {
      show: true,
      floating: true,
      fontSize: '16px',
      position: 'left',
      offsetX: 500,
      offsetY: 15,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0
      },
      formatter: function(seriesName, opts) {
        return seriesName + ":  " + Math.round((opts.w.globals.series[opts.seriesIndex] * sum) / 270)
      },
      itemMargin: {
        vertical: 3
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          show: false
        }
      }
    }]
  };
  
  chart = new ApexCharts(document.querySelector("#skillBar"), options);
  chart.render();
};
  
function resetSkillPlots(dataFull, platform = 'ALL') {

  // Reset bar chart
  chart.destroy();
  let x
  let y
  [x, y] = getSkillInfo(dataFull, platform)
  let sum = 0;

  // iterate over each item in the array
  for (i = 0; i < 5; i++) {
    sum += y[i];
  };

  let y2 = []
  for (i = 0; i < 5; i++) {
    y2.push(Math.round((y[i] / sum) * 270));
  };
  
  
  
  var options = {
    title: {
      text: 'Number of Times Skill(s) Mentioned',
      align: 'center'
    },
    series: y2,
    chart: {
      height: 390,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
          image: undefined,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          }
        }
      }
    },
    // colors: ['#003366', '#46769b', '#46769b', '#5e8cad', '#75a2bf'],
    labels: x.slice(0, 5),
    legend: {
      show: true,
      floating: true,
      fontSize: '16px',
      position: 'left',
      offsetX: 500,
      offsetY: 15,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0
      },
      formatter: function(seriesName, opts) {
        return seriesName + ":  " + Math.round((opts.w.globals.series[opts.seriesIndex] * sum) / 270)
      },
      itemMargin: {
        vertical: 3
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          show: false
        }
      }
    }]
  };
  
  chart = new ApexCharts(document.querySelector("#skillBar"), options);
  chart.render();

};
  
init()