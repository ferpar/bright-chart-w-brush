import * as d3 from 'd3'
import * as britecharts from 'britecharts'

function newContainer(className) {
  const element = document.createElement('div')
  element.className = className
  return element
}

const run = async () => {

  // process raw data
  const rawData = await d3.json('./lineData.json') 
  const lineData = rawData.dataByTopic.map( series => 
    series.dates.map( elem => ({
      ...elem,
      name: series.topic,
      topicName: series.topicName
      })
    ) 
  )
  console.log(lineData)

  // create container
  const domContainer = newContainer('line-container')
  await document.body.appendChild(domContainer)
  const containerWidth = domContainer.getBoundingClientRect().width;

  const domLegendContainer = newContainer('legend-container')
  await document.body.appendChild(domLegendContainer)

  // insert chart with tooltip and legend
  const lineChart = britecharts.line()
  const chartTooltip = britecharts.tooltip()
  const chartLegend = britecharts.legend()

  lineChart
    .margin({ bottom: 50 })
    .height(400)
    .width(containerWidth)
    .on('customMouseOver', chartTooltip.show)
    .on('customMouseMove', chartTooltip.update)
    .on('customMouseOut', chartTooltip.hide)

  const container = d3.select('.line-container')
  container.datum({data: [...lineData[0], ...lineData[1]]}).call(lineChart);
  
  // tooltip
  const tooltipContainer = d3.select('.line-container .metadata-group .hover-marker')
  tooltipContainer.call(chartTooltip)

  // legend
  const legendContainer = d3.select('.legend-container')
  const legendData = [...lineData[0], ...lineData[1]].reduce(
    (ac, item) => {
      let found = ac.find(elem => elem.id === item.name)
      if (found) { return ac }
      return [
        {
          id: item.name,
          name: item.topicName
        }, 
        ...ac
      ]
    },
    []
  )
  chartLegend
    .width(containerWidth)
    .height(60)
    .isHorizontal(true)
  legendContainer.datum(legendData).call(chartLegend)
  
  // make the chart responsive: adapt to width changes
  const redrawChart = () => {
    const newContainerWidth = container.node() 
      ? container.node().getBoundingClientRect().width
      : false

    lineChart.width(newContainerWidth)
    container.call(lineChart)
    chartLegend.width(newContainerWidth)
    legendContainer.call(chartLegend)
  } 


  window.addEventListener('resize', () => window.requestAnimationFrame(redrawChart))

}

run()
