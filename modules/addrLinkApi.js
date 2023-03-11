require('dotenv').config()
const axios = require('axios')
const { postApi } = require('../api.js')
const finishedArray = []

const addrLinkApi = async () => {
  let id = 1
  let maxId = 10
  let nextId = 2
  const timerInterval = 1000
  const addrLinkApiKey = process.env.addrLinkApiKey
  const timer1 = setInterval(async () => {
    try {
      callee = 'sp_get_school_FA_RDNMA_by_id'
      const data = {
        callee,
        req: {
          id
        }
      }
      console.log({id})
      console.log('교습소', id, '번에 대한 도로명주소 상세 정보수정을 시작합니다.')
      await postApi('caller', JSON.stringify(data), async (res) => {
        const resData = res.data.data
        const faRdnma = resData.FA_RDNMA
        maxId = resData.MAX_ID
        // console.log('교습소', id, '번에 대한 도로명주소입니다.', {faRdnma})
        if (faRdnma !== null) {
          await getRoadAddrDetails(id, faRdnma, function(res){
            console.log({maxId, res})
          })
        } else {
          console.log('교습소', id, '번은 도로명주소가 등록되어 있지 않습니다.')
        }
        console.log({maxId})
        finishedArray.push(id)
        id = resData.NEXT_ID
      })
    } catch(e) {
      console.log({e})
    }
    if (id >= maxId) clearInterval(timer1)
  }, timerInterval);

  const getRoadAddrDetails = async (id, keyword, callback) => {
    const currentPage = 1
    const countPerPage = 10
    // const keyword = '서울특별시 강남구 도곡로 405'
    // const addrLinkApiKey = 'devU01TX0FVVEgyMDIzMDMwNjIzMDQzMTExMzU2ODc='
  
    const host = 'https://business.juso.go.kr/addrlink/addrLinkApi.do'
    let queryParams = '?confmKey=' + addrLinkApiKey /* Service Key*/
    queryParams += '&currentPage=' + encodeURIComponent(currentPage) /* */
    queryParams += '&countPerPage=' + encodeURIComponent(countPerPage) /* */
    queryParams += '&keyword=' + encodeURIComponent(keyword) /* */
    queryParams += '&resultType=json' /* */
  
    const url = host + queryParams
    // console.log({url})
    const response = await axios.get(url)
    let roadAddrDetails = null
    if (Array.isArray(response.data.results.juso)) {
      roadAddrDetails = response.data.results.juso[0]
    } else {
      roadAddrDetails = response.data.results.juso
    }
    // console.log(response.data.results.juso)    
    if (roadAddrDetails !== null) {
      try {
        callee = 'sp_insert_BUILDING'
        const data = {
          callee,
          req: {
            id,
            roadAddrDetails
          }
        }
        console.log(keyword, '에 대한 도로상세주소 정리를 시작합니다.', {roadAddrDetails})
        postApi('caller', JSON.stringify(data), await function(res){
          // 데이타베이스 저장 및 업데이트 처리를 위한 작업을 진행한다.
          // 교육청 서버로부터 받은 데이타를 로컬 서버에 이전하는 단계이다.
          // console.log('postApi 호출이 발생했습니다. 입력 데이타는 다음과 같습니다.', {data})
          const resData = res.data.data
          // console.log({resData}, '5555')
          let message = ''
          if (res.state == 0) {
            message = '교습소 등록번호' + id + '에 대한 도로상세주소 정리가 완료되었습니다.'
          } else {
            message = '교습소 등록번호' + id + '에 대한 도로상세주소 정리중 오류가 발생했습니다.([' + res.state + ']' + res.message + ')'
          }
          return callback(message)
        })
      } catch(e) {
        console.log({e})
        return callback(e)
      }
    } else {
      console.log(keyword, '에 대한 도로상세주소 정보가 존재하지 않습니다.', {roadAddrDetails})
    }
  }
}

module.exports = {
  addrLinkApi
}