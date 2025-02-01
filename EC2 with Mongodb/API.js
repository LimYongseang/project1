
// INSERT
const e1 = require('express');
var app = e1();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./server.js');
const EmpModel = require('./emp_schema.js');


// UPDATE API
app.put('/update', async (req, res) => {
  try {
      const { email, name, password, salary } = req.body;

      // Find the user by email and update the fields
      const updatedUser = await EmpModel.findOneAndUpdate(
          { emailid: email },  // Find user by email
          { 
              name, 
              pass: password, 
              salary 
          },  // Update fields
          { new: true }  // Return updated document
      );

      if (!updatedUser) {
          return res.status(404).send({ message: 'User not found' });
      }

      res.status(200).send({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
      res.status(500).send({ message: err.message || 'Error updating user' });
  }
});

/*
In the postman use the following URL
localhost:5000/reg

{
  "employeeid":500,
  "firstname":"Joe",
  "email":"a@gmail.com",
  "password":"abc",
  "sal":3000
}

*/

//REG API
app.post('/reg', (req, res) => {
  
  const empobj = new EmpModel({
    empid: req.body.employeeid,
    name: req.body.firstname,
    emailid: req.body.email,
    pass: req.body.password,
    salary: req.body.sal,
  });//CLOSE EmpModel
  
  //INSERT/SAVE THE RECORD/DOCUMENT
  empobj.save()
    .then(inserteddocument => {
      res.status(200).send('DOCUMENT INSERED IN MONGODB DATABASE');
    })//CLOSE THEN
    .catch(err => {
      res.status(500).send({ message: err.message || 'Error in Employee Save ' })
    });//CLOSE CATCH
}//CLOSE CALLBACK FUNCTION BODY
);//CLOSE POST METHOD


// LOGIN POST
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await EmpModel.findOne({ emailid: email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Compare the entered password with the stored password
    const isMatch = password === user.pass; // Direct comparison (if passwords are stored as plain text)

    // If passwords are hashed, use bcrypt instead:
    // const isMatch = await bcrypt.compare(password, user.pass);

    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    res.status(200).send({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error in login process' });
  }
});

//VIEW ALL API GET
app.get('/view', (req, res) => {
  EmpModel.find()
    .then(getalldocumentsfrommongodb => {
      res.status(200).send(getalldocumentsfrommongodb);
    }) //CLOSE THEN
    .catch(err => {
      res.status(500).send({ message: err.message || 'Error in Fetch Employee ' })
    });//CLOSE CATCH
});//CLOSE GET



//Search Emp by empid API GET
app.get('/search/:empid', (req, res) => {
  EmpModel.find({ "empid": parseInt(req.params.empid)})
    .then(getsearchdocument => {
      if (getsearchdocument.length > 0) {
        res.send(getsearchdocument);
      }
      else {
        return res.status(404).send({ message: "Not found with id " + req.params.empid });
      }
    }) //CLOSE THEN
    .catch(err => {
      return res.status(500).send({ message: "DB Problem..Error in Retriving with id " });
    })//CLOSE CATCH
}//CLOSE CALLBACK FUNCTION BODY
);//CLOSE GET METHOD

//Delete API
app.delete('/del/:empid', (req, res) => {
    EmpModel.findOneAndDelete({ "empid": parseInt(req.params.empid) })
    .then(deleteddocument => {
      if (deleteddocument != null) {
        res.status(200).send('DOCUMENT DELETED successfully!' + deleteddocument);
      }
      else {
        res.status(404).send('INVALID EMP ID ' + req.params.empid);
      }
    }) //CLOSE THEN
    .catch(err => {
      return res.status(500).send({ message: "DB Problem..Error in Delete with id " + req.params.empid });
    })//CLOSE CATCH
}//CLOSE CALLBACK FUNCTION BODY
); //CLOSE Delete METHOD


// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5000, () => console.log('EXPRESS Server Started at Port No: 5000'));
