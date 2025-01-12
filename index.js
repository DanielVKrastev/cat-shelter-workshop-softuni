import http from 'http';
import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';

import homePage from './views/home/index.html.js';
import addBreedPage from './views/addBreed.html.js';
import addCatPage from './views/addCat.html.js';
import catEditPage from './views/catShelter.html.js';
import siteCss from './content/styles/site.css.js';

let cats = [];
let breeds = []; //TODO

initCats();
initBreeds();

const server = http.createServer((req, res) => {
    // POST Request
    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        if(req.url === '/cats/add-cat'){
            req.on('end', () => {
                const data = new URLSearchParams(body);
                console.log(data);
                
               cats.push({
                //id: cats.length + 1, // works if there is no delete cat option
                id: uuid(),
                ...Object.fromEntries(data.entries()),
               })
    
               saveCats();
               
                res.writeHead(302, {
                    'location': '/',
                });
                res.end();
            });
        } else if(req.url === '/cats/add-breed'){
            req.on('end', () => {
                const data = new URLSearchParams(body);
                console.log(data);
                
                breeds.push({
                //id: cats.length + 1, // works if there is no delete cat option
                id: uuid(),
                ...Object.fromEntries(data.entries()),
               })
    
               saveBreeds();
               
                res.writeHead(302, {
                    'location': '/',
                });
                res.end();
            });
        }

        return;
    }

    // Load assets
    if (req.url === '/styles/site.css') {
        res.writeHead(200, {
            'Content-type': 'text/css',
        })

        res.write(siteCss);
        return res.end();
    }

    res.writeHead(200, {
        'Content-type': 'text/html',
    })

    // Routings
    switch(req.url){
        case '/': 
            res.write(homePage(cats));
            break;
        case '/cats/add-breed': 
            res.write(addBreedPage());
            break;
        case '/cats/add-cat': 
            res.write(addCatPage(breeds));
            break;
        case '/cats/edit?id=':
            res.write(catEditPage(cats));
            break;
        default:
            res.write('Page not found');
            break;
    }
    

    res.end();
    
});

async function initCats() {
    try{
        const catsJson = await fs.readFile('./cats.json', {encoding: 'utf-8'});
        cats = JSON.parse(catsJson);
    }catch(err){
        console.log(err.message);
    }
    
}

async function initBreeds() {
    try{
        const breedsJson = await fs.readFile('./breeds.json', {encoding: 'utf-8'});
        breeds = JSON.parse(breedsJson);
    }catch(err){
        console.log(err.message);
    }
}

async function saveCats() {
    const catsJson = JSON.stringify(cats, null, 2);
    
    try{
        await fs.writeFile('./cats.json', catsJson, {encoding: 'utf-8'});
    }catch(err){
        console.log(err.message);
    }
}

async function saveBreeds() {
    const breedsJson = JSON.stringify(breeds, null, 2);
    
    try{
        await fs.writeFile('./breeds.json', breedsJson, {encoding: 'utf-8'});
    }catch(err){
        console.log(err.message);
    }
}

server.listen(5000);
console.log('Server is listening on http://localhost:5000...');
