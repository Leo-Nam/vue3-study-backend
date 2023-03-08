require('dotenv').config()
const axios = require('axios')
const { postApi } = require('../api.js')


// ldCode	
// 11110
// 법정동코드(2~5자리)

// bsnmCmpnm	
// 맑은공인
// 사업자상호

// brkrNm	
// 홍길동
// 중개업자명

// sttusSeCode	
// 1
// 상태구분코드 (1:영업중,2:휴업,3:휴업연정,4:실효 5:폐업,6:전출,7:등록취소,8:업무정지)

// format	
// xml
// 응답결과 형식(xml 또는 json)

// numOfRows	
// 10
// 페이지번호

// pageNo	
// 1
// 검색건수

const getEBOfficeInfo = async (pageNo) => {
  const apiKey = process.env.dataGoKr_apiKey
  let ldCode = '11000'
  let bsnmCmpnm = '공인'
  let brkrNm = '홍'
  let sttusSeCode = 1
  let format = 'json'

  const host = 'http://apis.data.go.kr/1611000/nsdi/EstateBrkpgService/attr/getEBOfficeInfo'
  let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + apiKey /* Service Key*/
  queryParams += '&' + encodeURIComponent('ldCode') + '=' + encodeURIComponent(ldCode) 
  queryParams += '&' + encodeURIComponent('bsnmCmpnm') + '=' + encodeURIComponent(bsnmCmpnm) 
  queryParams += '&' + encodeURIComponent('brkrNm') + '=' + encodeURIComponent(brkrNm) 
  queryParams += '&' + encodeURIComponent('sttusSeCode') + '=' + encodeURIComponent(sttusSeCode)
  queryParams += '&' + encodeURIComponent('format') + '=' + encodeURIComponent(format) 

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
  getEBOfficeInfo
}