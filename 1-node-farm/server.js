const fs = require('fs'); //za rad sa file system
const http = require('http'); //za server, za gradjenje http servera
const url = require('url'); //za routing

const replaceTemplate = require('./modules/replaceTemplate');


const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`,'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

//koristimo sync jer nije bitno sto blokira kod, ovo je top level code koji se pokrece samo jednom
//tekst se cuva u varijablu, sa kojom kasnije radimo sto ocemo


//kreiramo, pa startujemo server
//top level kod se ne stavlja u callback koji slijedi
const server = http.createServer((req, res) => {  //request,response
    const {query, pathname} = url.parse(req.url,true);

    //overview stranica
    if (pathname==='/' || pathname==='/overview'){
        res.writeHead(200,{'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');  //map loopuje kroz dataObj(parsirani Json) i zamijenjuje placeholdere
        //replaceTemplate je funkcija koju smo napravili da zamijeni tempCard sa loopovanim elementima
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);


    //product stranica
    } else if (pathname==='/product'){
        const product = dataObj[query.id]; //vraca element iz query id (uri)
        const output = replaceTemplate(tempProduct,product);
        res.end(output);

    //api stranica
    } else if (pathname==='/api'){
        res.writeHead(200,{'Content-type': 'application/json'}); //govorimo browseru da mu stize json
            res.end(data); 
        } 

        //ovo je isto sto i ./, samo sto dirname ide u home folder, dok ./ ide gdje se node terminal pokrece, dirname je bolja praksa
        //sada je cilj da posaljemo ovu datu kao response na /api
         //ocemo da parsujemo objekte iz dev-data/data.json ka serveru
         //problem sa ovim je sto server svaki put cita pa salje podatke
         //cilj je da jednom procita i da vazda ima spremne podatke
    
    
    //not found
    else {
        res.writeHead(404,{
            'Content-type': 'text/html'
        }); //ne vidi se u html, ali se vidi u inspect element
        res.end('<h1>Page not found!</h1>');
    }
}); 

//vrlo jednostavan "response" kada request dodje
//sad treba napravit da se slusaju incoming requests

server.listen(8000, '127.0.0.1', ()=>{ //port, host, trenutno je localhost
    console.log('Listening to requests on port 8000');
})  
//ctrl + c za zatvaranje servera, ili bilo kojih loopova
//sad implementiramo routing
//to se inace radi u express, ali za sada radimo od nule


