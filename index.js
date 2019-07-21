var http = require("http");
var fs = require("fs");
var url=require("url");
var replace = require("./replace.js");
var data = JSON.parse(fs.readFileSync("./dev-data/data.json"));
var tp = fs.readFileSync("./templates/template-product.html").toString();
var tc = fs.readFileSync("./templates/template-card.html").toString();
var to = fs.readFileSync("./templates/template-overview.html").toString();

var server = http.createServer(async function (req, res) {
    res.writeHead(200);
    var makeCards = function (tc, data) {
        return replace(tc,data);
    }
    var path=req.url;
    var id=url.parse(path,true).query.id;
    // console.log(id);
    var path=url.parse(path,true).pathname;
    if (path == "/" || path == "/overview") {
        var cards = "";
        for (var i = 0; i < data.length; i++) {
            cards += makeCards(tc, data[i]);
        }
        var overviewHtml=to.replace("%PRODUCT_CARDS%",cards);
        res.writeHead(200, { "content-type": "text/html" });
        res.end(overviewHtml);
    }
    else if(path=="/product"){
          var productHTML = replace(tp, data[id]);
        res.writeHead(200, { "content-type": "text/html" });
        res.end(productHTML);
    }
    else if (path == "/card") {
        res.end("CARD PAGE");
    }
    else if (path == "/api") {
        await fs.readFile("./data.json", function (err, data) {
            res.end(data);
        });
    }
    else {
        res.end("ERROR 404! PAGE NOT FOUND");
    }
});
var port=process.env.PORT||80;
server.listen(port);
console.log("Server listening at port "+port);