function setDropDown() {
    let path = '../../python/resources/json_datasets/locations.json'
    // Use if fecth does not work (CORS Error)
    path = 'https://raw.githubusercontent.com/MrGoots/Project_3/main/python/resources/json_datasets/locations.json'
    fetch(path).then((response) => response.json()).then(function (data) {
        let stateName = ''
        let dMenu = d3.select("#selDataset")
        let newEle = dMenu.append('option')
        newEle.text('All States')
        newEle.property('value','ALL')
        for (i=0;i<data.length;i++) {
            stateName = data[i].name
            newEle = dMenu.append('option')
            newEle.text(stateName)
            newEle.property('value',data[i].state)
        };
    });
    
};

function setPlots(dataFull,state='ALL') {


    let x
    let y
    [x,y] = getStateInfo(dataFull,state='ALL')
    color = getColor(y)
    console.log(x)
    data = [{
        x: x,
        y: Array(x.length).fill(0),

        type: 'bar'}];

    layout = {
        xaxis: {
            automargin: true,
            tickangle: -90
          },
          yaxis: {
            title: 'Count'
        },
        title: 'Top Roles (Up to 10) per State',
        height: 750,

    };
    Plotly.newPlot("stateBar", data,layout);

    data = [{
        x: x,
        y: y,
        marker:{
            color: color
          },
        type: 'bar'}];
    
    layout = {autosize: true,yaxis: {range:[0,y[0]*1.25]} }

    Plotly.animate("stateBar", { data: data,layout:layout }, { ...animationConfig });
    };


function resetPlots(dataFull,state='AK') {
    // Reset bar chart
    let x
    let y 
    [x,y] = getStateInfo(dataFull,state)
    color =getColor(y)
    console.log(x,y)
    data = [{
        x: x,
        y: Array(x.length).fill(0),
        type: 'bar'}];

    layout = {
        xaxis: {
            automargin: true,
            tickangle: -90
          },
          yaxis: {
            title: 'Count'
        },
        title: 'Top Roles (Up to 10) per State',
        height: 750,

    };
    Plotly.newPlot("stateBar", data,layout);

    trace1 = {
        x: x,
        y: y,
        marker:{
            color: color
          },
        type: "bar"
    };
    console.log(y[0])
    layout = {yaxis: {range:[0,y[0]*1.25]} }

    let finalData = [trace1];
    Plotly.animate("stateBar", { data: finalData,layout:layout }, { ...animationConfig });


};


function optionChanged() {
    let path = '../../python/resources/json_datasets/jobTitle.json'
    // Use if fecth does not work (CORS Error)
    path = 'https://raw.githubusercontent.com/MrGoots/Project_3/main/python/resources/json_datasets/jobTitle.json'
    fetch(path).then((response) => response.json()).then(function (data) {

        let dropdownMenu = d3.select("#selDataset");
        let state = dropdownMenu.property("value");
        resetPlots(data,state)


    });
};

    // Start of initializing
function init() {
    let path = '../../python/resources/json_datasets/jobTitle.json'
    // Use if fecth does not work (CORS Error)
    path = 'https://raw.githubusercontent.com/MrGoots/Project_3/main/python/resources/json_datasets/jobTitle.json'
    fetch(path).then((response) => response.json()).then(function (data) {
        // console.log(data)
        setDropDown();
        setPlots(data,'AK')
          });

};

function getStateInfo(dataFull,state) {
    let stateDict = {}

    if (state === 'ALL') {
        for (i=0;i<dataFull.length;i++) {
            if (!(dataFull[i].SOC_TITLE in stateDict)) {
                stateDict[dataFull[i].SOC_TITLE] = 0
            };
            stateDict[dataFull[i].SOC_TITLE]++
            }
    } else {

    for (i=0;i<dataFull.length;i++) {
        if (dataFull[i].EMPLOYER_STATE === state) {
            if (!(dataFull[i].SOC_TITLE in stateDict)) {
                stateDict[dataFull[i].SOC_TITLE] = 0
            };
            stateDict[dataFull[i].SOC_TITLE]++
        };};

    };

    // Create items array
    stateSort = Object.keys(stateDict).map(function(key) {
        return [key, stateDict[key]];
    });
    
    // Sort the array based on the second element
    stateSort.sort(function(first, second) {
        return second[1] - first[1];
    });

    // // Initialize Bar Chart Use 0
    let x = []
    let y = []
    let len = 10
    let remainder = 0
    
    if (stateSort.length < 10) {
        remainder = len - stateSort.length
        len = stateSort.length
        
    }
    console.log(remainder)
    for (i=0;i<len;i++){
        x.push(stateSort[i][0])
        y.push(stateSort[i][1])
    };

    // console.log(' '*5)
    // if (remainder > 0) {
    //     for (i=0;i<remainder;i++){
    //         x.push(i)
    //         y.push(0)
    //     };
    // };
    
    return [x,y]
};
  

let animationConfig = {

    frame: [
        {duration: 1000}
        // ,
        // {duration: 1500},
    ],

    transition: [
        // {duration: 800, easing: 'cubic-in-out'}
        // ,
        {duration: 800, easing: 'cubic-in'}
    ],

    mode: 'afterall'

};

function getColor(dataArr){

    let colors = ['#4e79a7','#f28e2b','#e15759','#92dce5','#59a14e','#edc949','#b07aa2','#ff9da7','#9c755f','#bab0ac']
    return colors.slice(0,dataArr.length)
    // color = []
    // for (i=0;i<dataArr.length;i++){
    //     color.push

    // }
};
init()