const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const multer = require('multer');

const app = express();
const port = 3000;

// ejs
app.set('view engine', 'ejs');
// 루트 설정
app.use('/assets', express.static('assets'));
app.use(bodyParser.json());
require('dotenv').config()
const cors = require('cors');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.get('/:id', (req, res) => {
    const contactId = req.params.id;
    res.render(`${contactId}.ejs`)
})
app.get('/en/:id', (req, res) => {
    const contactId2 = req.params.id;
    res.render(`en/${contactId2}.ejs`)
})



// app.post('/submit', async (req, res) => {
//     console.log('데이터:', req.body);
//     await sendEmail(req.body.name, req.body.email, req.body.tel, req.body.title, req.body.content, req.body.uploadFile)
//     res.send('이메일이 전송되었습니다.');
// });
app.post('/submit', upload.array('file'), async (req, res) => {
    console.log('데이터:', req.body);


    // if (!req.files || req.files.length === 0) {
    //     return res.status(400).end('파일이 전송되지 않음')
    // }

    const name = req.body.name;
    const email = req.body.email;
    const tel = req.body.tel;
    const title = req.body.title;
    const content = req.body.content;
    const files = req.files;
    if (!files) {
        res.status(500).json({ errorType: '파일첨부가 안됨' })
    }
    try {
        await sendEmail(name, email, tel, title, content, files);
        // res.end()
        res.status(200).json({ success: '전송에 성공했습니다.' })
    } catch (error) {
        // res.status(500).end();
        if (error.responseCode === 552) {
            res.status(500).json({ errorType: '보낼 수 있는 용량이 초과되었습니다.' })
        } else {
            console.log(error)
            res.status(500).json({ errorType: '전송에 실패했습니다.' })
        }
    }
})

async function sendEmail(name, email, tel, title, content, files) {
    const transporter = nodemailer.createTransport({
        service: 'naver',
        host: 'smtp.naver.com',
        port: 587,
        auth: { user: process.env.KEY_ID, pass: process.env.KEY_PASSWORD },
    })

    
    let htmlContent = 
        `
        <table style="       font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif;    width:100%;    max-width: 800px;                padding: 32px;        font-size: 16px;        border-spacing: 0;        background-color: #f2f5f8;      ">
        <tbody><tr><td>
            <table style="              display: table;              margin: 0 auto;              text-align: center;              border-spacing: 0;              width: 100%;              table-layout: fixed;            ">
              <tbody><tr><td>
                  <a href="https://www.yjinno.co.kr/" style="display:block; margin-bottom:24px; target="_blank"> 
                  <img src="https://handeul-kim.github.io/yj/assets/img/logo.png" width="25%" style=" padding:10px 8px; background-color:#000;" alt="yj logo" loading="lazy">
                  </a>
                </td></tr>
            </tbody></table>
            <div style="              background-color: white;              padding: 32px;              text-align: center;              font-size: 16px;              font-weight: 400;              line-height: 28px;              letter-spacing: -0.54px;            ">
              <img src="https://file.okky.kr/images/1706857660319.png" style="width: 164px" alt="hero" loading="lazy">
              <h2 style="margin: 32px 0; font-size: 24px; font-weight: 600; word-break: break-word;">
                문의 내역<b style="display:block; border-bottom: 2px solid #008bf5; padding:20px 0;"></b>
              </h2>

              <ul style="list-style:none; padding-left:0;">
                <li style="margin-top:60px; border-bottom: 1px solid #ddd; padding-bottom: 40px; word-break: break-word;">
                    <div style="font-weight: 600; text-align: left;">
                        제목
                    </div>
                    <p style="text-align:left; padding:0; margin:0;">
                        ${title}
                    </p>
                </li>
                <li style="margin-top:60px; border-bottom: 1px solid #ddd; padding-bottom: 40px; word-break: break-word;">
                    <div style="font-weight: 600; text-align: left;">
                        고객명
                    </div>
                    <p style="text-align:left; padding:0; margin:0;">
                        ${name}
                    </p>
                </li>
                <li style="margin-top:60px; border-bottom: 1px solid #ddd; padding-bottom: 40px; word-break: break-word;">
                    <div style="font-weight: 600; text-align: left;">
                        이메일
                    </div>
                    <p style="text-align:left; padding:0; margin:0;">
                        ${email}
                    </p>
                </li>
                <li style="margin-top:60px; border-bottom: 1px solid #ddd; padding-bottom: 40px; word-break: break-word;">
                    <div style="font-weight: 600; text-align: left;">
                        연락처
                    </div>
                    <p style="text-align:left; padding:0; margin:0; word-break: break-word;">
                        ${tel}
                    </p>
                </li>
                <li style="margin-top:60px; word-break: break-word;">
                    <div style="font-weight: 600; text-align: left; word-break: break-word;">
                        문의내용
                    </div>
                    <div style="text-align:left; padding:0; margin:0; white-space:pre-line;">
                        ${content}
                    </div>
                </li>
              </ul>
            </div>
          </td></tr>
      </tbody></table>
    `;

    
    const mailOptions = {
        from: `tjdtnyj@naver.com`,
        to: 'tjdtnyj@naver.com',
        subject: `${title}`,
        // html: `
        //     <div class="container">
        //     <p style="background:red; color:blue;">이메일 내용</p>
        //     <p>${name}</p><p>${email}</p><p>${tel}</p><p>${title}</p><p>${content}</p>
        //     </div>
        // `,
        html: htmlContent,
        attachments: files.map(file => ({
            filename: file.originalname,
            path: file.path
        }))
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log('이메일 전송 성공')
    } catch (error) {
        throw error;
    }
}
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});


