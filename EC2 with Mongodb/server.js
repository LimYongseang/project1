// STEP-1 : IMPORT MONGOOSE PACKAGE
const mongoose = require('mongoose');
const url = 'mongodb+srv://limyongseang:limyongseang23@cluster0.iawop.mongodb.net/'; 
mongoose.connect(url)
      .then( () => 
             {
               console.log('NODEJS TO MongoDB Connection ESTABLISH.....');
             })
      .catch( err => 
              {
               console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2));
               process.exit();
              }); 
    
// STEP-3 : EXPORT MODULE mongoose because we need it in other JS file
module.exports = mongoose;


