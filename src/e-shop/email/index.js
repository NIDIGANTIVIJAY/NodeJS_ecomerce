var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nidigantivijay@gmail.com',
      pass: 'lare sylr bqid tkpk'
    }
  });

  var mailOptions = {
    from: 'nidigantivijay@gmail.com',
    to: 'nidigantivijay@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
