/*
Licensed under the Apache License, Version 2.0 (the "License");
http://www.apache.org/licenses/LICENSE-2.0
See the License for the specific language governing permissions and
limitations under the License.
*/

var axios = require("axios");
var fs = require("fs");
var qs = require("qs");

class EText {
    u;p;
    constructor(u,p) {
        this.u = u;
        this.p = p;
    }
    tokens={};
    async login(){
        var body = {
            "password":this.p,
            "isMobile":"true",
            "grant_type":"password",
            "client_id":"2oVGB3Juhj2EURhIREn5GPYgijBm7634",
            "username":this.u
        }
        var tt = this;
        var bk = {};
        return new Promise(async function(re){
            axios({
                method: "POST",
                timeout: 6000,
                url:"https://pi.pearsoned.com/v1/piapi/login/webcredentials",
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data:qs.stringify(body)
            }).then(function(d){
                bk.login = d.data;
                axios({
                    method: "GET",
                    timeout: 6000,
                    url:"https://etext.pearson.com/api/nextext-api/v1/api/nextext/eps/authtoken",
                    headers:{
                        "X-Authorization":d.data.data.access_token
                    }

                }).then(function(d){
                    bk.cookie = d.data;
                    tt.tokens = bk;
                    re(true);
                }).catch(function(d){
                    re(false);
                });
            }).catch(function(d){
                re(false);
            });
        })
    }
    async books(){
        var tt = this;
        return new Promise(async function(re){
            axios({
                method: "get",
                timeout: 6000,
                url:"https://stpaperapi.prd-prsn.com/etext/v2/courseboot/convergedreader/compositeBookShelf/",
                headers:{
                    'x-authorization': tt.tokens.login.data.access_token
                },
            }).then(function(d){
                re(d.data.entries)
            }).catch(function(d){
                console.log("There was an error on /etext/v2/courseboot/convergedreader/compositeBookShelf. Please open an issue on github");
                re([]);
            });
        })
    }
    async download(book, dir = __dirname){
        var tt = this;
        var cookie = {
            "name":this.tokens.cookie.name,
            "value":this.tokens.cookie.value,
        }
        var he = {};
        he[cookie.name] = cookie.value;
        console.log("DOWNLOADING");
        return new Promise(async function(re){
            axios({
                method: "get",
                url:book.uPdfUrl,
                headers:he,
                responseType: 'stream'
            }).then(function(d){
                const writer = fs.createWriteStream(dir + "/" + book.title + ".pdf");
                writer.on('finish', ()=>{
                    console.log("\nDONE\n");
                    re(true);
                })
                writer.on('error', (e)=>{
                    console.log("\nERROR\n",e);
                    re(false);
                })
                d.data.pipe(writer)
            }).catch(function(d){
                console.log("There was an error on trying to download the book. Please open an issue on github");
                re(false);

            });
        })
    }

}
module.exports = EText;
