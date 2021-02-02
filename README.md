# GCP Cloud Function Send Email

紀錄如何在 Cloud Function 上免費發送信件

## Cloud Function Type

- ### Google Cloud Function

  which allow you to run snippets of code in Google's infrastructure in response to events.

- ### Cloud Functions for Firebase

  which triggers Google Cloud Functions based on events in Firebase (such as database or file writes, user creation, etc)

- ### Firebase SDK for Cloud Functions

  which includes a library (confusingly called firebase-functions) that you use in your Functions code to access Firebase data (such as the snapshot of the data that was written to the database)

這次要分享的是 `Google Cloud Function` 如何發信的做法，於 `Firebase` 完全無關．

## Backgroud and restriction

由於 GCP 安全政策，不允許 TCP Port `25` 發送，一律改用安全性更高的 SMTP Port `587` or `465`. 但此一做法卻在 Gmail 改版後無法使用，所以以往類似以下這篇的作法將失效．
[Google Cloud Functions: Sending emails using Gmail SMTP and Nodemailer](https://dev.to/i_maka/google-cloud-functions-sending-emails-using-gmail-smtp-and-nodemailer-1lij)．

但如果是自己架設 SMTP 主機或是有用 GSuite 的還是可以考慮將程式碼修改為以下即可：

```js
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.xxxx.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
```

但本範例採用 [SendGrid](https://sendgrid.com/) 這樣的第三方 Email 代理的方式發信．該服務有 100 emails/day 的免費額度，實作上較為簡潔方便．參考 [https://sendgrid.com/pricing/](https://sendgrid.com/pricing/)

![free_plan.png](images/free_plan.png)

## Pre-requisite

1. 註冊 GCP 帳號
2. 註冊 SendGrid 帳號，並建立第一個 sender instance 後產生 API token 於 Cloud Function 內的 環境變數 - `SENDGRID_API_KEY` 進行更換

## SourceCode

原始碼實作參考 [src](/src/README.md)

## References

- [Sending email from an instance](https://cloud.google.com/compute/docs/tutorials/sending-mail)