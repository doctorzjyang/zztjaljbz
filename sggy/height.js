// 获取身高数据
let boyData = null;
let girlData = null;
let growthChartInstance = null; // 存储图表实例

async function loadData() {
    try {
        const boyResponse = await fetch('boy.json');
        const girlResponse = await fetch('girl.json');
        boyData = await boyResponse.json();
        girlData = await girlResponse.json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// 保留一位小数，不四舍五入
function formatDecimal(num) {
    const str = num.toString();
    const index = str.indexOf('.');
    if (index === -1) {
        return str + '.0';
    }
    return str.slice(0, index + 2);
}

// 计算遗传身高
function calculateGeneticHeight(fatherHeight, motherHeight, gender) {
    if (gender === 'male') {
        return formatDecimal((parseFloat(fatherHeight) + parseFloat(motherHeight) + 13) / 2);
    } else {
        return formatDecimal((parseFloat(fatherHeight) + parseFloat(motherHeight) - 13) / 2);
    }
}

// 计算年龄
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // 直接将月份转换为年的小数部分，不进行四舍五入
    const monthsAsYears = (months / 12).toString().slice(0, 4);  // 取小数点后1位
    return formatDecimal(years + parseFloat(monthsAsYears));
}

// 获取最接近的年龄数据和索引
function getClosestAgeData(age, gender) {
    const data = gender === 'male' ? boyData : girlData;
    let closestAge = data[0];
    let closestIndex = 0;
    
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const ageStr = item.年龄;
        if (ageStr.includes('岁')) {
            const years = parseFloat(ageStr);
            if (Math.abs(years - age.years) < Math.abs(parseFloat(closestAge.年龄) - age.years)) {
                closestAge = item;
                closestIndex = i;
            }
        }
    }
    
    return { data: closestAge, index: closestIndex };
}

// 绘制生长曲线
function drawGrowthChart(gender, currentHeight, birthDate, geneticHeight) {
    const data = gender === 'male' ? boyData : girlData;
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    // 销毁旧图表
    if (growthChartInstance) {
        growthChartInstance.destroy();
        growthChartInstance = null;
    }
    
    // 定义颜色常量
    const COLORS = {
        CURRENT: '#FF6B00',     // 橙色 - 当前身高
        GENETIC: '#4B0082',     // 靛紫色 - 遗传身高
        GRID: '#F0F0F0',        // 网格线颜色
        CURVES: {
            '3rd': '#FF0000',   // 红色
            '10th': '#FF7F00',  // 橙色
            '25th': '#FFFF00',  // 黄色
            '50th': '#00FF00',  // 绿色
            '75th': '#0000FF',  // 蓝色
            '90th': '#8B00FF',  // 紫色
            '97th': '#FF1493'   // 深粉色
        }
    };
    
    const ages = data.map(item => {
        const ageStr = item.年龄;
        if (ageStr.includes('岁')) {
            return formatDecimal(parseFloat(ageStr));
        }
        return ageStr;
    });
    
    const percentileData = {
        '3rd': { data: data.map(item => formatDecimal(parseFloat(item['3rd']))), color: COLORS.CURVES['3rd'] },
        '10 th': { data: data.map(item => formatDecimal(parseFloat(item['10 th']))), color: COLORS.CURVES['10th'] },
        '25th': { data: data.map(item => formatDecimal(parseFloat(item['25th']))), color: COLORS.CURVES['25th'] },
        '50th': { data: data.map(item => formatDecimal(parseFloat(item['50th']))), color: COLORS.CURVES['50th'] },
        '75th': { data: data.map(item => formatDecimal(parseFloat(item['75th']))), color: COLORS.CURVES['75th'] },
        '90th': { data: data.map(item => formatDecimal(parseFloat(item['90th']))), color: COLORS.CURVES['90th'] },
        '97 th': { data: data.map(item => formatDecimal(parseFloat(item['97 th']))), color: COLORS.CURVES['97th'] }
    };
    
    const currentAge = calculateAge(birthDate);
    const { index: currentAgeIndex } = getClosestAgeData({ years: parseInt(currentAge), months: (parseFloat(currentAge) % 1) * 12 }, gender);
    
    const datasets = Object.entries(percentileData).map(([label, { data: values, color }]) => ({
        label: `${label} 百分位`,
        data: values,
        borderColor: color,
        fill: false,
        pointRadius: 0,
        borderWidth: label === '50th' ? 2 : 1
    }));
    
    // 添加当前身高点位
    const currentHeightData = new Array(ages.length).fill(null);
    const currentHeightValue = formatDecimal(parseFloat(currentHeight));
    currentHeightData[currentAgeIndex] = currentHeightValue;
    
    datasets.push({
        label: '当前身高',
        data: currentHeightData,
        pointBackgroundColor: COLORS.CURRENT,
        pointRadius: 4,
        showLine: false,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: COLORS.CURRENT,
        pointStyle: 'circle'
    });
    
    // 添加遗传身高点位
    const geneticHeightData = new Array(ages.length).fill(null);
    const adultIndex = data.findIndex(item => item.年龄 === '18岁');
    if (adultIndex !== -1) {
        geneticHeightData[adultIndex] = formatDecimal(parseFloat(geneticHeight));
    }
    
    datasets.push({
        label: '遗传身高',
        data: geneticHeightData,
        pointBackgroundColor: COLORS.GENETIC,
        pointRadius: 4,
        showLine: false,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: COLORS.GENETIC,
        pointStyle: 'circle'
    });

    // 创建图表
    growthChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ages,
            datasets: datasets
        },
        options: {
            responsive: true,
            aspectRatio: 1/1.3,
            title: {
                display: true,
                text: '生长曲线图',
                fontSize: 16,
                fontColor: '#000000'
            },
            tooltips: {
                mode: 'nearest',
                intersect: true,
                callbacks: {
                    label: function(tooltipItem, data) {
                        const label = data.datasets[tooltipItem.datasetIndex].label;
                        const value = tooltipItem.yLabel;
                        const age = tooltipItem.xLabel;
                        return `${label}: ${formatDecimal(value)}cm (${age}岁)`;
                    }
                }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: '年龄（岁）',
                        fontColor: '#000000'
                    },
                    gridLines: {
                        display: true,
                        color: COLORS.GRID,
                        drawBorder: true,
                        drawOnChartArea: true,
                        drawTicks: true
                    },
                    ticks: {
                        fontColor: '#000000',
                        callback: function(value) {
                            return formatDecimal(parseFloat(value));
                        }
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: '身高（cm）',
                        fontColor: '#000000'
                    },
                    gridLines: {
                        display: true,
                        color: COLORS.GRID,
                        drawBorder: true,
                        drawOnChartArea: true,
                        drawTicks: true
                    },
                    ticks: {
                        fontColor: '#000000',
                        callback: function(value) {
                            return formatDecimal(parseFloat(value));
                        }
                    },
                    // 增加y轴范围，让曲线之间有更多空间
                    suggestedMin: Math.min(...data.map(item => parseFloat(item['3rd']))) - 60,
                    suggestedMax: Math.max(...data.map(item => parseFloat(item['97 th']))) + 60
                }]
            },
            legend: {
                display: false
            },
            annotation: {
                annotations: [
                    // 当前身高点的垂直线
                    {
                        type: 'line',
                        mode: 'vertical',
                        scaleID: 'x-axis-0',
                        value: ages[currentAgeIndex],
                        borderColor: `rgba(${hexToRgb(COLORS.CURRENT)},0.3)`,
                        borderWidth: 1,
                        label: {
                            enabled: false
                        }
                    },
                    // 当前身高点的水平线
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: currentHeightValue,
                        borderColor: `rgba(${hexToRgb(COLORS.CURRENT)},0.3)`,
                        borderWidth: 1,
                        label: {
                            enabled: false
                        }
                    },
                    // 遗传身高点的垂直线
                    {
                        type: 'line',
                        mode: 'vertical',
                        scaleID: 'x-axis-0',
                        value: ages[adultIndex],
                        borderColor: `rgba(${hexToRgb(COLORS.GENETIC)},0.3)`,
                        borderWidth: 1,
                        label: {
                            enabled: false
                        }
                    },
                    // 遗传身高点的水平线
                    {
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y-axis-0',
                        value: geneticHeight,
                        borderColor: `rgba(${hexToRgb(COLORS.GENETIC)},0.3)`,
                        borderWidth: 1,
                        label: {
                            enabled: false
                        }
                    },
                    // 当前身高点标注
                    {
                        type: 'label',
                        xValue: ages[currentAgeIndex],
                        yValue: currentHeightValue,
                        content: `(${formatDecimal(currentAge)}岁, ${currentHeightValue}cm)`, // 精确到小数点后一位
                        backgroundColor: COLORS.CURRENT,
                        fontColor: 'white',
                        cornerRadius: 6,
                        position: 'center',
                        xAdjust: 70,
                        yAdjust: 0
                    },
                    // 遗传身高点标注
                    {
                        type: 'label',
                        xValue: ages[adultIndex],
                        yValue: geneticHeight,
                        content: `(18.0岁, ${formatDecimal(parseFloat(geneticHeight))}cm)`, // 精确到小数点后一位
                        backgroundColor: COLORS.GENETIC,
                        fontColor: 'white',
                        cornerRadius: 6,
                        position: 'center',
                        xAdjust: 70,
                        yAdjust: 0
                    }
                ]
            }
        }
    });
}

// 将16进制颜色转换为RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : 
        '0,0,0';
}

// 评估身高水平
function evaluateHeight(currentHeight, geneticHeight, ageData) {
    const height = parseFloat(currentHeight);
    const genetic = parseFloat(geneticHeight);
    const percentiles = [
        { value: parseFloat(ageData.data['3rd']), label: '3' },
        { value: parseFloat(ageData.data['10th']), label: '10' },
        { value: parseFloat(ageData.data['25th']), label: '25' },
        { value: parseFloat(ageData.data['50th']), label: '50' },
        { value: parseFloat(ageData.data['75th']), label: '75' },
        { value: parseFloat(ageData.data['90th']), label: '90' },
        { value: parseFloat(ageData.data['97th']), label: '97' }
    ];

    let currentPercentile = '低于3';
    let geneticPercentile = '低于3';

    // 计算当前身高百分位
    for (let i = 0; i < percentiles.length; i++) {
        if (height < percentiles[i].value) {
            if (i > 0) {
                currentPercentile = `在${percentiles[i - 1].label}和${percentiles[i].label}百分位之间`;
            }
            break;
        } else if (height === percentiles[i].value) {
            currentPercentile = `正好在${percentiles[i].label}百分位`;
            break;
        } else if (i === percentiles.length - 1) {
            currentPercentile = '高于97';
        }
    }

    // 计算遗传身高百分位
    for (let i = 0; i < percentiles.length; i++) {
        if (genetic < percentiles[i].value) {
            if (i > 0) {
                geneticPercentile = `在${percentiles[i - 1].label}和${percentiles[i].label}百分位之间`;
            }
            break;
        } else if (genetic === percentiles[i].value) {
            geneticPercentile = `正好在${percentiles[i].label}百分位`;
            break;
        } else if (i === percentiles.length - 1) {
            geneticPercentile = '高于97';
        }
    }

    return {
        currentPercentile: `当前身高${currentPercentile}`,
        geneticPercentile: `遗传身高${geneticPercentile}`
    };
}

// 开始评估
async function startEvaluation() {
    const fatherHeight = document.getElementById('fatherHeight').value;
    const motherHeight = document.getElementById('motherHeight').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const birthDate = document.getElementById('birthDate').value;
    const currentHeight = document.getElementById('currentHeight').value;
    
    if (!fatherHeight || !motherHeight || !birthDate || !currentHeight) {
        alert('请填写所有必要信息！');
        return;
    }
    
    if (!boyData || !girlData) {
        await loadData();
    }
    
    const geneticHeight = calculateGeneticHeight(fatherHeight, motherHeight, gender);
    const age = calculateAge(birthDate);
    const ageData = getClosestAgeData({ years: parseInt(age), months: (parseFloat(age) % 1) * 12 }, gender);
    const evaluation = evaluateHeight(currentHeight, geneticHeight, ageData);

    // 添加18岁时的百分位对应身高
    const eighteenHeight = gender === 'male' 
        ? {
            '3rd': '161.3cm', '10th': '164.9cm', '25th': '168.6cm',
            '50th': '172.7cm', '75th': '176.7cm', '90th': '180.4cm', '97th': '183.9cm'
        }
        : {
            '3rd': '150.4cm', '10th': '153.7cm', '25th': '157.0cm',
            '50th': '160.6cm', '75th': '164.2cm', '90th': '167.5cm', '97th': '170.7cm'
        };

    const eighteenHeightText = Object.entries(eighteenHeight)
        .map(([percentile, height]) => `${percentile}百分位: ${height}`)
        .join('<br>');

    const formula = gender === 'male' 
        ? '男孩遗传身高 = (父亲身高 + 母亲身高 + 13) ÷ 2'
        : '女孩遗传身高 = (父亲身高 + 母亲身高 - 13) ÷ 2';
    
    const calculation = gender === 'male'
        ? `遗传身高计算：(${fatherHeight} + ${motherHeight} + 13) ÷ 2 = ${formatDecimal(geneticHeight)} cm`
        : `遗传身高计算：(${fatherHeight} + ${motherHeight} - 13) ÷ 2 = ${formatDecimal(geneticHeight)} cm`;
    
    document.getElementById('resultText').innerHTML = `
        <p class="formula" style="color: #4B0082;">遗传身高公式：${formula}<br>
        <small>注：此公式基于大量统计数据，用于预测儿童可能达到的成年身高。</small></p>
        
        <p class="calculation" style="color: #4B0082;">${calculation}</p>
        
        <p class="calculation" style="color: #4B0082;">${evaluation.geneticPercentile}</p>
        <p class="calculation" style="color: #FF6B00;">${evaluation.currentPercentile}</p>
    `;
    
    drawGrowthChart(gender, currentHeight, birthDate, geneticHeight);
}

// 页面加载时加载数据
window.addEventListener('load', loadData);
