var http = require('http')
var cheerio = require('cheerio')
var superagent = require('superagent')
var fs = require('fs')

var urls = ['http://www.netbian.com/youxi/index_2.htm']

function start() {
  function onRequest(req, res) {

    urls.forEach((url) => {
      console.log('开始访问')
      superagent.get(url)
      .end((err, pres) => {
        // pres.text 里面存储着请求返回的 html 内容，将它传给 cheerio.load 之后
        // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
        // 剩下就都是利用$ 使用 jquery 的语法了
        var $ = cheerio.load(pres.text)
        imageItems = $('#main .list ul li a')
        var output = []
        var newUrls = []
        console.log(typeof imageItems)
        for(var i = 0 ; i < imageItems.length ; i++){
          var articleUrl = `http://www.netbian.com${imageItems.eq(i).attr('href')}`
          //   return `${item.eq(index).attr('href')}
          // `
          newUrls.push(articleUrl);
        }
        console.log(newUrls.length)
        newUrls.forEach(newUrl => {
          console.log(newUrl)
          superagent.get(newUrl)
          .end((err, newPres) => {
            if (err) return
            var _$ = cheerio.load(newPres.text)
            var result =  _$('#main .endpage .pic p a img')
            for(var i = 0 ; i < result.length ; i++){
              var articleUrl = `${result.eq(i).attr('src')}`

              output.push(`${articleUrl}
`)
            }
            console.log('开始写入')
            // output.push(result)
            fs.writeFile('./output.txt', output,function(err){
              if(err) console.log('写文件操作失败');
              else console.log('写文件操作成功');
            });
            
          })
        })
      })
    })
  }
  onRequest()
  // http.createServer(onRequest).listen(3010);
}
start()
