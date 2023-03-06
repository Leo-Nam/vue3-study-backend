const axios = require('axios')
const { postApi } = require('../api.js')


const getStanReginCdList = async (pageNo) => {
  const apiKey = process.env.dataGoKr_apiKey
  let numOfRows = 1000

  const host = 'http://apis.data.go.kr/1741000/stdgSexdPpltnIrds'
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + apiKey /* Service Key*/
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent(pageNo) /* */
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent(numOfRows) /* */
  queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json') /* */

  const url = host + queryParams
  console.log({url})
  const method = 'get'
  const data = null
  console.log({data})
  // const response = await this.$store.dispatch('common/caller', { callee, data })
  const response = await axios.get(url)
  return response
}

module.exports = {
  getStanReginCdList
}