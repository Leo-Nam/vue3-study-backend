const axios = require('axios')
var convert = require('xml-js')
const { postApi } = require('./api.js')

let pageNo = 1
let officeList = []
let officeLength = 0
let officeIndex = 0
const timerInterval = 2000
const getRTMSDataSvcAptTradeDev = async () => {
  const apiKey = 'jTGICRNHia7RIWOWFRjAIELkyJfmF6i3hHlzfCq%2FqGWquHopc8rQ8yPZd98HA%2FUKO%2Fvib8FJXAwRoAny5%2FMxyA%3D%3D'
  const pageSize = 100
  const host = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev?_wadl&type=xml'
  var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + apiKey /* Service Key*/
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1') /* */
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1') /* */
  queryParams += '&' + encodeURIComponent('LAWD_CD') + '=' + encodeURIComponent('11110') /* */
  queryParams += '&' + encodeURIComponent('DEAL_YMD') + '=' + encodeURIComponent('202001'); /* */

  const url = host + queryParams
  console.log({url})
  const response = await axios.get(url)
  // console.log(response.data, '123')
  var xmlData = convert.xml2json(response.data, {
      compact: true,
      space: 4
  });
  const jsonData = JSON.parse(xmlData)
  // console.log({jsonData}, '789');
  // console.log({jsonData}, '789');
  // return response.data.acaInsTiInfo
}

getRTMSDataSvcAptTradeDev()