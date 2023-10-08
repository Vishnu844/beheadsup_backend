const express = require('express');



module.exports= function(app){
    
    //initialising api routes
    const apiRoutes = express.Router();
      
    app.use('/v1/api',apiRoutes);
    app.use((req, res) => {
        res.status(404).send("Invalid request");
    });
    
}