const axios = require('axios')
const { postApi } = require('../api.js')


const addrLinkApi = async (pageNo) => {
  let numOfRows = 1000
  const currentPage = 1
  const countPerPage = 10
  const resultType = 'json'
  const keyword = '서울특별시 강남구 도곡로 405'
  const addrLinkApiKey = 'devU01TX0FVVEgyMDIzMDMwNjIzMDQzMTExMzU2ODc='

  const host = 'https://business.juso.go.kr/addrlink/addrLinkApi.do'
  let queryParams = '?confmKey=' + addrLinkApiKey /* Service Key*/
  queryParams += '&currentPage=' + encodeURIComponent(currentPage) /* */
  queryParams += '&countPerPage=' + encodeURIComponent(countPerPage) /* */
  queryParams += '&keyword=' + encodeURIComponent(keyword) /* */
  queryParams += '&resultType=json' /* */

  const url = host + queryParams
  console.log({url})
  const method = 'post'
  const data = null
  console.log({data})
  // const response = await this.$store.dispatch('common/caller', { callee, data })
  const response = await axios.get(url)
  console.log(response.data.results.juso)
  return response
}

module.exports = {
  addrLinkApi
}