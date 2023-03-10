require('dotenv').config()
const axios = require('axios')
const { postApi } = require('../api.js')

let pageNo = 1
let sggList = []
let sggLength = 0
let sggIndex = 0
const timerInterval = 10000

const sp_get_region_sgg = async () => {
  callee = 'sp_get_region_sgg'
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
      sggList = response.data.data
      sggLength = sggList.length
    })
  } catch(e) {
    console.log({e})
  }
}

const update_ATPT_OFCDC_SC_CODE = async () => {
  await sp_get_region_sgg()
  const timer1 = setInterval(async () => {
    let response = await get_ATPT_OFCDC_SC_CODE(sggList[sggIndex].code, pageNo++)
    if (response.data.acaInsTiInfo == undefined){
      if (sggIndex < sggLength) {
        sggIndex ++
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