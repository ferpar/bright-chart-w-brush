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
  console.log(lineData[0])

  // create container
  const domContainer = newContainer('line-container')
  await document.body.appendChild(domContainer)
  const containerWidth = domContainer.getBoundingClientRect().width;

  // insert chart
  const lineChart = britecharts.line()
  lineChart
    .margin({ bottom: 50 })
    .height(400)
    .width(containerWidth)

  const container = d3.select('.line-container')
  container.datum({data: [...lineData[0], ...lineData[1]]}).call(lineChart);
  
  return
}

run()
