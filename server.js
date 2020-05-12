const express = require('express')
const mongodb = require('mongodb')
const sanitizeHTML = require('sanitize-html')

const app = express()
let db

let port = process.env.PORT
if(port == null || port == ''){
  port = 3000
}

app.use(express.static('public')) //contents of this folder are available from root of our folder

const connectionString = 'mongodb+srv://dbSourish:iPhone6s@cluster0-d5btr.mongodb.net/TodoApp?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err,client)=>{
    db = client.db()
    app.listen(port, ()=>{
        console.log('server is up')
    })
})

app.use(express.json()) // Instead of submitted forms this is on Asynch requests  
app.use(express.urlencoded({extended: false})) // configures the express framework, to incluse the BODY object that getes added to the REQ object
                                            // It tells express to automatically take submitted form data and ADD it to the body object which is on the req obj 

//function within the toArray is called whenever this DB action is complete, as we dont know its gonna take 2 milisces or 20000 milisecs

const passwordProtected = (req, res, next) =>{
  res.set('www-Authenticate', 'Basic realm="Simple To Do app"')
  //console.log(req.headers.authorization)
  if(req.headers.authorization == 'Basic YWRtaW46YWRtaW4=') {
    next()
  }else{
    res.status(401).send('Authentication required')
  }
  
}

app.use(passwordProtected)

app.get('/', (req,res)=>{
        db.collection('items').find().toArray((err, items)=>{
        res.send(`<!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Simple To-Do App</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
          <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
            
            <div class="jumbotron p-3 shadow-sm">
              <form id="create-form" action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                  <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                  <button class="btn btn-primary">Add New Item</button>
                </div>
              </form>
            </div>
            
            <ul id="item-list" class="list-group pb-5">
            
            </ul>
          </div>
          
          <script>
          const items = ${JSON.stringify(items)}
          </script>

          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="/browser.js"></script>
        </body>
        </html>`)
    }) 
  
})

app.post('/create-item', (req,res)=>{
    const safeText = sanitizeHTML(req.body.text, {allwedTags: [], allowedAttributes: {}})
    db.collection('items').insertOne({text: req.body.text}, (err, info)=>{
        res.json(info.ops[0])
    })

//COMMUNICATE WITH DB to UPDATING THE VALUES    
app.post('/update-item', (req,res)=>{
   db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, ()=>{
     res.send('Success')
   })
})
})

app.post('/delete-item', (req,res)=>{
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, ()=>{
    res.send('Success')
  })
})