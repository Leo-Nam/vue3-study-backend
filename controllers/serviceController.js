const { postApi } = require('../api.js')

const caller = async (req, res, next) => {
  const caller = 'caller'
  const data = req.body
  try {
    postApi(caller, JSON.stringify(data), function(response){
      console.log('postApi 호출이 발생했습니다. 입력 데이타는 다음과 같습니다.', {data})
      console.log('postApi 호출결과는 다음과 같습니다.', {response})
      // console.log(response.data.data)
      res.send(response)
    })
  } catch(e) {
    console.log({e})
  }
}

module.exports = {
  caller
}