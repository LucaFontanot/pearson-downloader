var eText = require("./core/eText");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function yesNo(title){
    return new Promise(async function(re){
        rl.question("Proseguire con il download di "+ title + "  (y/n) default: n > ", function(yesNo) {
            yesNo = yesNo.toLowerCase();
            re((yesNo == "y"));
        });
    })
}

(async function () {
    var aa = new eText("USERNAME","PASSWORD");
    await aa.login();
    var books = await aa.books();
    for (var i =0;i<books.length;i++){
        if(await yesNo(books[i].title)){
            console.log(await aa.download(books[i],__dirname))
        }
    }
    process.exit();
})()
