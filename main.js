var eText = require("./core/eText");

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function yesNo(title){
    return new Promise(async function(re){
        rl.question("Do you want to download \""+ title + "\"  (y/n)[default: n]> ", function(yesNo) {
            yesNo = yesNo.toLowerCase();
            re((yesNo == "y"));
        });
    })
}

(async function () {
    var aa = new eText("USERNAME","PASSWORD");
	console.log("Doing login...");
    var lg = await aa.login();
	if(lg){
		console.log("Login done, scraping books");
		var books = await aa.books();
		console.log("You have " + books.length +" book(s) to download");
		for (var i =0;i<books.length;i++){
			if(await yesNo(books[i].title)){
				await aa.download(books[i],__dirname /* Set this to the directory for the output of the file*/);
			}
		}
		console.log("Nothing more to do, exiting");
	}else{
		console.log("Login failed, wrong credentials or you have not accepted the privacy policy (more info on the readme)");
	}
    
    process.exit();
})()
