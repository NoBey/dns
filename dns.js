var dns = require('native-dns');
var server = dns.createServer();
var datalist ={
  'a.cn': '115.159.217.96'
}

server.on('request', function (request, response) {
  // console.log(request)
  if (datalist.hasOwnProperty(request.question[0].name)){
    response.answer.push(dns.A({
      name: request.question[0].name,
      address: datalist[request.question[0].name],
      ttl: 600,
    }));
    response.send();
  }else {
    var req = dns.Request({
      question: request.question[0],
      server: { address: '8.8.8.8', port: 53, type: 'udp' },
      timeout: 1000,
    });
    req.on('message', function (err, answer) {
      console.log(answer)
      response.answer=answer.answer
      response.send();
    });
    req.send();
  }

});

server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

server.serve(5333);
