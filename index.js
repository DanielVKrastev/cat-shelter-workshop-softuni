import http from 'http';

import homePage from './views/home/index.html.js';
import addBreed from './views/addBreed.html.js';
import addCat from './views/addCat.html.js';
import siteCss from './content/styles/site.css.js';

const server = http.createServer((req, res) => {
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
            res.write(homePage);
            break;
        case '/cats/add-breed': 
            res.write(addBreed);
            break;
        case '/cats/add-cat': 
            res.write(addCat);
            break;
        default:
            res.write('Page not found');
            break;
    }
    

    res.end();
    
});

server.listen(5000);
console.log('Server is listening on http://localhost:5000...');
