const http=require('http');
const url=require('url');
const fs=require('fs');

const laptopDatas=JSON.parse(fs.readFileSync(__dirname+'/data/data.json','utf-8'));

const server=http.createServer((req,res)=>{
    const query=url.parse(req.url,true);
    const pathName=query.pathname;
    const id=query.query.id;

    // console.log(pathName);

    // HOME
    if(pathName=='/'){
        res.writeHead(200,{'Content-Type':'text/html'});
        
        fs.readFile(__dirname+'/templates/template-overview.html','utf-8',(err,homePageTemplate)=>{
            fs.readFile(__dirname+"/templates/template-card.html",'utf-8',(err,laptopItemTemplate)=>{
                const itemsHTML=laptopDatas.map(ele=>replaceTemplate(laptopItemTemplate,ele)).join('');
                const output=homePageTemplate.replace('{%CARDS%}',itemsHTML);
                res.end(output);
            });
        });
    }
    // LAPTOP ITEM
    else if(pathName=='/laptop'&& id<laptopDatas.length && id>=0){
        res.writeHead(200,{'Content-Type':'text/html'});
        
        fs.readFile(__dirname+'/templates/template-laptop.html','utf-8',(err,data)=>{
            const output=replaceTemplate(data,laptopDatas[id]);
            res.end(output);
        });
    }
    // IMAGES
    else if(/.(jpg|jpeg|png|gif)$/.test(pathName)){
        res.writeHead(200,'Content-Type','image/jpeg');
        fs.readFile(__dirname+"/data/img"+pathName,(err,data)=>{
            res.end(data);
        });
    }    
    // INVALID URLS
    else{
        res.writeHead(404,{'Content-Type':'text/html'});
        res.end('404! Please visit correct link!');
    }
});

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}


server.listen(585,'localhost',()=>{
    console.log('Listening toh 585!');
});