const axios = require('axios')
const { postApi } = require('../api.js')


const get_bcode_list = async () => {
  let pageNo = 1
  let sidoIndex = 0
  const timerInterval = 5000
  const getStanReginCdList = async (pageNo) => {
    const apiKey = 'jTGICRNHia7RIWOWFRjAIELkyJfmF6i3hHlzfCq%2FqGWquHopc8rQ8yPZd98HA%2FUKO%2Fvib8FJXAwRoAny5%2FMxyA%3D%3D'
    let numOfRows = 1000
  
    const host = 'http://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList'
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

  const timer1 = setInterval(async () => {
    let response = await getStanReginCdList(pageNo++)
    if (response.data.StanReginCd == undefined){
      console.log('모든 자료 검색이 완료되었습니다.')
      clearInterval(timer1)
    } else {
      try {
        callee = 'sp_update_BCODE'
        const data = {
          callee,
          req: response.data.StanReginCd[1].row
        }
        console.log({data}, callee)
        postApi('caller', JSON.stringify(data), function(response){
          console.log('postApi 호출이 발생했습니다. 입력 데이타는 다음과 같습니다.', {data})
          console.log('postApi 호출결과는 다음과 같습니다.', {response})
          console.log(response.data.data, callee)
        })
      } catch(e) {
        console.log({e})
        clearInterval(timer1)
      }
    }
  }, timerInterval);
}

module.exports = {
  get_bcode_list
}