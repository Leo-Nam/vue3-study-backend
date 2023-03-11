const fetch = require('node-fetch')
const { JSDOM } = require("jsdom")
const DOMParser = new JSDOM().window.DOMParser
const { postApi } = require('../api.js')
// const { postApi } = require('../api')
// const CryptoJS = require('crypto-js')
// const nodemailer = require('nodemailer')
// const mysql = require('mysql')
// const MySQLEvents = require('@rodrigogs/mysql-events')
// const CRYPTOJS_SECRET_KEY = require('../config/secretKey').secretKey
// const db_config = require('../db_config.json');
// const { sp_get_english_all } = require("./common")
const timerInterval = 2000

const kyoboBookCrawler = async (callback) => {
  let page = 1
  let bookList = []
  const timer1 = setInterval(async () => {
    console.log(page, '페이지에 대한 검색이 시작됩니다.')
    try {
      fetch(`https://search.kyobobook.co.kr/search?keyword=vocabulary&target=total&gbCode=TOT&page=${page}`).then(async (response) => {
        if (response.status === 200) {
          // text로 읽어온다
          await response.text().then(async (text) => {
            const parser = new DOMParser()
            // DOMParser로 변환
            const htmlDocument = parser.parseFromString(text, 'text/html')
            // console.log({htmlDocument}, 1)
            // searchbox 읽어오기
            const searchResultsAll = htmlDocument.querySelectorAll('li.prod_item')
            let i = 0
            const searchReaultLength = searchResultsAll.length
            // console.log({searchReaultLength})
            if (searchReaultLength > 0) {
              while(i < searchReaultLength)  {
                const searchResults = searchResultsAll[i]
                // console.log(searchResults, 2, searchReaultLength)
                // searchResults가 있다면 검색 결과가 있다는 뜻
                await getBookInfo(searchResults, function (response) {
                  console.log({i, response})
                  bookList.push(response)
                })
                i++;
              }
              // 여기에 db저장 api를 연결한다.
              console.log(page, '페이지에 대한 검색이 완료되었습니다.')
              console.log(bookList, '데이타베이스에 저장할 교재목록입니다.')
              callee = 'sp_insert_VOCABULARY_BOOKS'
              const data = {
                callee,
                req: bookList
              }
              postApi('caller', JSON.stringify(data), function(response){
                console.log('postApi 호출이 발생했습니다. 입력 데이타는 다음과 같습니다.', {data})
                console.log('postApi 호출결과는 다음과 같습니다.', {response})
                console.log(response.data.data, callee)
              })
              page ++
            } else {
              console.log('끝')
              clearInterval(timer1)
              return callback('vocabulary 도서정보 데이타수집완료')
            }
          })
        } else {
          console.log(response.status)
        }
      })
    } catch (error) {
      console.log({error})
    }
    // if (id >= maxId) clearInterval(timer1)
  }, timerInterval);
}

const getBookInfo = async (searchResults, callback) => {
  const bookList = []
  // console.log({searchResults})
  const searchProd = searchResults.getElementsByClassName('prod_info_box')
  // console.log({searchProd}, 3)

  // getElementsByTagName 인 Iterable 하지 않아서
  // spread operator로 iterable하게 만들어준다.
  const results1 = [...searchProd].map((prod_info_box) =>
    // numbering을 제외한 순수 검색 결과는 text_Search 안에 있다.
    // [...prod_info_box.getElementsByClassName('prod_info')]
    [...prod_info_box.querySelectorAll("[id^='cmdtName']")]
    //  <daum:word /> 류의 모든 태그를 제거
    .map((txt) => txt.innerHTML.replace(/(<([^>]+)>)/gi, ''))
    .join(''),
  )
  const uniqueResults1 = [...new Set(results1)]
  const bookName = uniqueResults1[0]
  // console.log({bookName})

  const results2 = [...searchProd].map((prod_info_box) =>
    // numbering을 제외한 순수 검색 결과는 text_Search 안에 있다.
    // [...prod_info_box.getElementsByClassName('prod_info')]
    [...prod_info_box.querySelectorAll("[class='prod_category']")]
    //  <daum:word /> 류의 모든 태그를 제거
    .map((txt) => txt.innerHTML.replace(/(<([^>]+)>)/gi, ''))
    .join(''),
  )
  const uniqueResults2 = [...new Set(results2)]
  const category = uniqueResults2[0].replace('[', '').replace(']', '')
  // console.log({category})

  const results3 = [...searchProd].map((prod_info_box) =>
    // numbering을 제외한 순수 검색 결과는 text_Search 안에 있다.
    // [...prod_info_box.getElementsByClassName('prod_info')]
    [...prod_info_box.querySelectorAll('span.val')]
    //  <daum:word /> 류의 모든 태그를 제거
    .map((txt) => txt.innerHTML.replace(/(<([^>]+)>)/gi, ''))
    .join(''),
  )
  const uniqueResults3 = [...new Set(results3)]
  const price = uniqueResults3[0].substr(0, uniqueResults3[0].length-1).replace(',', '')
  // console.log({price})

  if (bookName !== '') {
    return callback({
      bookName,
      category,
      price: price == '' ? 0 : price
    })
  }
}

module.exports = {
	kyoboBookCrawler
}