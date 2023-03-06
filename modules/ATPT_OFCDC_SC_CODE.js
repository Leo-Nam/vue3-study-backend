const axios = require('axios')
const { postApi } = require('../api.js')

let pageNo = 1
let officeList = []
let officeLength = 0
let officeIndex = 0
let timerInterval = 30000
let searchedArray = []
const get_ATPT_OFCDC_SC_CODE = async (code, pageNo) => {
  // console.log('get_ATPT_OFCDC_SC_CODE')
  const apiKey = 'fd0b9953e0d44d3f8739719f9a3d25dc'
  const pageSize = 1000
  const url = 'https://open.neis.go.kr/hub/acaInsTiInfo?ATPT_OFCDC_SC_CODE=' + code +'&KEY=' + apiKey + '&Type=json&pIndex=' + pageNo + '&pSize=' + pageSize   
  // console.log({url})
  const method = 'get'
  // const data = null
  // console.log({data})
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
      console.log('전체 시도교육청', response.data.data.length, '개소에 대한 사교육 등록자료 분석작업을 시작합니다.')
      officeList = response.data.data
      officeLength = officeList.length
    })
  } catch(e) {
    console.log({e})
  }
}

const update_ATPT_OFCDC_SC_CODE = async () => {
  await sp_get_education_office()
  // 교육청 리스트를 배열(officeList)에 담는다.
  const timer1 = setInterval(async () => {
    const arrayIdx = officeIndex + '-' + pageNo 
    const currLocaleDateTime = new Date().toLocaleString()
    console.log({arrayIdx, currLocaleDateTime})
    // 서버로부터 검색할 데이타의 인덱스를 작성한다.
    // 이것을 작성하는 이유는 한번 호출한 쿼리는 2~3중으로 호출하는 것을 방지하기 위해서이다.
    // 호출이 완료되어 데이타베이스 처리중인 것은 데이타베이스 처리가 완료될때까지 기다려야 하기때문이다.
    if (officeIndex < officeLength) {
      // 전체 교육청에 대한 검색이 완료되지 않은 경우에는 작업을 진행한다.
      if (!searchedArray.includes(arrayIdx)) { 
        // 현재 검색하려는 데이타의 인덱스가 이미 검색되지 않은 경우에만 서버호출=>데이타베이스 처리 작업을 진행한다.
        // 그렇지 않은 경우에는 그냥 어떠한 작업 없이 넘어간다.
        let response = await get_ATPT_OFCDC_SC_CODE(officeList[officeIndex].code, pageNo)
        // 서버로부터 데이타를 쿼리한다.
        const searchResult = response.data.acaInsTiInfo
        // 쿼리한 데이타에서 처리할 데이타 부분을 잘라서 searchResult에 복사한다.
        if (searchResult == undefined){ 
          // searchResult에 어떠한 값도 없는 경우에는 검색한 모든 페이지의 마지막이라고 간주한다.
          // 다음 교육청으로 교육청 인덱스를 옮기고 페이지 번호는 1페이지로 리셋한다.
          console.log(officeList[officeIndex].name, '에 대하여 모든 자료 검색이 완료되었습니다.')
          console.log(officeList[officeIndex + 1].name, '에 대한 자료 검색을 준비합니다.')
          officeIndex = officeIndex + 1
          pageNo = 1
        } else {
          searchedArray.push(arrayIdx) 
          // 데이타베이스 처리를 기다리는 단계이므로 검색데이타 인덱스를 완료된 인덱스가 저장되는 배열(searchedArray)에 푸시한다.
          try {
            // console.log(searchResult[1].row)
            callee = 'sp_insert_ATPT_OFCDC_SC_CODE'
            const data = {
              callee,
              req: searchResult[1].row
            }
            console.log(officeList[officeIndex].name, ':', pageNo, '페이지에 대한 자료 검색량은', searchResult[1].row.length, '개입니다.')
            const start = new Date()
            postApi('caller', JSON.stringify(data), await function(res){
              // 데이타베이스 저장 및 업데이트 처리를 위한 작업을 진행한다.
              // 교육청 서버로부터 받은 데이타를 로컬 서버에 이전하는 단계이다.
              // console.log('postApi 호출이 발생했습니다. 입력 데이타는 다음과 같습니다.', {data})
              const resData = res.data.data
              // console.log({resData})
              const end = new Date()
              const lapTime = end - start
              console.log('timerInterval이', timerInterval, '에서', lapTime, '으로 변경 적용됩니다.')
              timerInterval = lapTime // 이전에 소요된 시간을 기준으로 타이머의 간격을 조정한다.
              console.log(officeList[officeIndex].name, ':', pageNo, '페이지에 대한 데이타베이스 처리가 완료되었습니다.[', res.state, ']', res.message, ', 소요시간:', parseInt(lapTime/1000), '초', lapTime % 1000, ', 처리결과:', {resData})
              pageNo = pageNo + 1
            })
          } catch(e) {
            console.log({e})
          }
        }
      }
    } else {
      // 전체 교육청에 대한 작업이 완료된 경우에는 타이머를 삭제한다.
      clearInterval(timer1)
      console.log('전체 시도교육청', officeList.length, '개소에 대한 사교육 등록자료 분석작업을 완료하였습니다.')
    }
  }, timerInterval);
}

module.exports = {
  update_ATPT_OFCDC_SC_CODE
}