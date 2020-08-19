/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jagr.752@gmail.com',
    pass: 'Jagr.752',
  },
});

// Sends an email confirmation when a user changes his mailing list subscription.

exports.sendEmailConfirmation = functions.https.onCall((data, context) =>{
  return new Promise((resolve, reject) => {

    const mailOptions = {
      from: '"Spammy Corp." <noreply@firebase.com>',
      to: data.email,
    };
  
    const subscribed = data.subscribedToMailingList;
  
    // Building Email message.
    mailOptions.subject = subscribed ? 'Thanks and Welcome!' : 'Sad to see you go :`(';
    mailOptions.text = subscribed ?
        'Thanks you for subscribing to our newsletter. You will receive our next weekly newsletter.' :
        'I hereby confirm that I will stop sending you the newsletter.';
    
    try {
      mailTransport.sendMail(mailOptions);
      resolve(`New ${subscribed ? '' : 'un'}subscription confirmation email sent to: ${data.email ? '' : 'un'}`)
      console.log(`New ${subscribed ? '' : 'un'}subscription confirmation email sent to:`, data.email);
    } catch(error) {
      reject(`'There was an error while sending the email:' ${error}`)
      console.error('There was an error while sending the email:', error);
    }
  });
});