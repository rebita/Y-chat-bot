var express = require('express');
var lame = require('lame');
var Speaker = require('speaker');
var request = require('request');
var bodyParsor = require('body-parser');

var app = express();
var bodyParser = require('body-parser');
var port  = process.env.PORT || 3000;

//네이버 API ID
var client_id = 'O_NGMD1kRYWbVhvzRGBl';
//네이버 API키
var client_secret = 'RQE6dKbeoQ';

//성우 선택 : jinho 한국어 남자 mijin 한국어 여자
var voiceModel = 'jinho';
//목소리 속도 0 : default
var voiceSpeed = '0';

//목소리 만들기 네이버 API
var api_url = 'https://openapi.naver.com/v1/voice/tts.bin';

app.listen(port,function(){
    console.log("localhost "+port+" server start");
});
app.use(function(req,res,next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
})
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/keyboard', function (req, res) {
    console.log('start keyboard service');
    const menu = {
        "type":"buttons",
        "buttons":[시작]
    }

    res.set({
        'content-type':'application/json'
    }).send(JSON.stringify(menu));
});

app.post('/message',function(req,res){
    const _obj = {
        user_key: req.body.user_key,
        type: req.body.type,
        content: req.body.content
    };
    console.log(_obj.content);

    // 네이버 TTS 데이터 받기
    var options = {
        url: api_url,
        //'TEXT에 카톡에서 받은 테스트 전달'
        form: {'speaker':voiceModel,'speed':voiceSpeed,'text':_obj.content},
        headers: {'X-Naver-Client-Id':client_id,'X-Naver-Client-Secret':client_secret}
    };

    //네이버 TTS 데이터 요청
    var _req = request.post(option).on('response',function(res){
        console.log('code ' + res.statusCode) //200
    });
    //바로 스트리밍 과 연결하여 출력!
    _req.pipe(new lame.Decoder()).on('format',function(format){
        this.pipe(new Speaker(format));
    })
    //카톡으로 전송되는 메시지
    const massage = {
        "message": {
            "text": '(' + _obj.content + ')' + ' 을 따라 말했습니다.'
        },
    };

    //카톡에 메시지 전송
    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify(massage));
});
