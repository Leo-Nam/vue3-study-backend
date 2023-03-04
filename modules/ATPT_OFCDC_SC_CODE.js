const axios = require('axios')
const { postApi } = require('../api.js')

let pageNo = 1
let officeList = []
let officeLength = 0
let officeIndex = 0
const timerInterval = 10000
const get_ATPT_OFCDC_SC_CODE = async (code, pageNo) => {
  console.log('get_ATPT_OFCDC_SC_CODE')
  const apiKey = 'fd0b9953e0d44d3f8739719f9a3d25dc'
  const pageSize = 100
  const url = 'https://open.neis.go.kr/hub/acaInsTiInfo?ATPT_OFCDC_SC_CODE=' + code +'&KEY=' + apiKey + '&Type=json&pIndex=' + pageNo + '&pSize=' + pageSize   
  console.log({url})
  const method = 'get'
  const data = null
  console.log({data})
  // const response = await this.$store.dispatch('common/caller', { callee, data })
  const response = await axios.get(url)
  return response
}

const sp_get_education_office = async () => {
  callee = 'sp_get_education_office'
  const data = {
    callee,
    req: null
  }
  try {
    console.log({data}, callee)
    await postApi('caller', JSON.stringify(data), function(response){
      console.log('postApi 호출이 발생했습니다. 입력 데이타는 다음과 같습니다.', {data})
      console.log('postApi 호출결과는 다음과 같습니다.', {response})
      console.log(response.data.data, callee)
      officeList = response.data.data
      officeLength = officeList.length
    })
  } catch(e) {
    console.log({e})
  }
}

const update_ATPT_OFCDC_SC_CODE = async () => {
  await sp_get_education_office()
  const timer1 = setInterval(async () => {
    let response = await get_ATPT_OFCDC_SC_CODE(officeList[officeIndex].code, pageNo++)
    if (response.data.acaInsTiInfo == undefined){
      if (officeIndex < officeLength) {
        officeIndex ++
        pageNo = 1
      } else {
        clearInterval(timer1)
      }
      console.log('모든 자료 검색이 완료되었습니다.')
    } else {
      try {
        console.log(response.data.acaInsTiInfo[1].row)
        callee = 'sp_insert_ATPT_OFCDC_SC_CODE'
        const data = {
          callee,
          req: response.data.acaInsTiInfo[1].row
        }
        console.log({data}, callee)
        postApi('caller', JSON.stringify(data), function(response){
          console.log('postApi 호출이 발생했습니다. 입력 데이타는 다음과 같습니다.', {data})
          console.log('postApi 호출결과는 다음과 같습니다.', {response})
          console.log(response.data.data, callee)
        })
      } catch(e) {
        console.log({e})
      }
    }
  }, timerInterval);
}

module.exports = {
  update_ATPT_OFCDC_SC_CODE
}