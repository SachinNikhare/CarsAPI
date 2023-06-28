let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
const port = process.env.PORT||2410;
app.listen(port, ()=> console.log(`Node app listening on port ${port}`));
let {carsData, carMaster} = require("./carsData.js");


app.get("/cars",function(req,res){
    let minprice = req.query.minprice;
    let maxprice = req.query.maxprice;
    let fuel = req.query.fuel;
    let type = req.query.type;
    let sort = req.query.sort;
    let arr1 = carsData;
    if(minprice)
        arr1 = arr1.filter(a=>a.price>=minprice);
    if(maxprice)
        arr1 = arr1.filter(a=>a.price<=maxprice);
    if(fuel)
        arr1 = arr1.filter(a=>carMaster.find(cm=>cm.model===a.model).fuel===fuel);//this line first match/find the model in carMaster array and then check its fuel is equal to the query fuel or not...
    if(type)
        arr1 = arr1.filter(a=>carMaster.find(cm=>cm.model===a.model).type===type);//this line first match/find the model in carMaster array and then check its type is equal to the query type or not...
    if(sort==="kms")
        arr1.sort((a1,a2)=>a1.kms-a2.kms);
    if(sort==="price")
        arr1.sort((a1,a2)=>a1.price-a2.price);
    if(sort==="year")
        arr1.sort((a1,a2)=>a1.year-a2.year);
    res.send(arr1);
})

app.get("/cars/:id",function(req,res){
    const id = req.params.id;
    let car = carsData.find(c=>c.id===id);
    res.send({car:car,carMaster:carMaster});
})

app.post("/cars",function(req,res){
    let body = req.body;
    carsData.push(body);
    res.send(body);
})

app.put("/cars/:id",function(req,res){
    let id = req.params.id;
    let body = req.body;
    let index = carsData.findIndex(c=>c.id===id);
    if(index>=0){
        carsData[index]=body;
        res.send(body);
    }
    else{
        res.status(404).send("Car not found");
    }
})

app.delete("/cars/:id",function(req,res){
    let id = req.params.id;
    let index = carsData.findIndex(c=>c.id===id);
    if(index>=0){
        let deleteCar = carsData.splice(index,1);
        res.send(deleteCar);
    }
    else{
        res.status(404).send("Car not found");
    }
})
