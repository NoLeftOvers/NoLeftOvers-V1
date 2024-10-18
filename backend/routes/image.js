
const { S3Client, DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3'); // v3 모듈 가져오기
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid4');
const express = require('express');
const axios = require('axios');
const router = express.Router(); // Express Router 추가

const s3Client = new S3Client({
    region: process.env.SSS_REGION,
    credentials: {
        accessKeyId: process.env.SSS_ACCESS_KEY,
        secretAccessKey: process.env.SSS_SECRET_KEY,
    },
});

router.post('/upload', (req, res) => {
    const upload = multer({ storage: multer.memoryStorage() }).single('file');
    const { userId } = req.body;

    upload(req, res, async (err) => {
        if (err) {
            console.error('File upload failed:', err);
            return res.status(500).send({ error: 'File upload failed.' });
        }

        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded.' });
        }

        const fileName = `${Date.now().toString()}_${uuid()}_${req.file.originalname}`;

        const uploadParams = {
            Bucket: process.env.SSS_BUCKET,
            Key: fileName,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: req.file.mimetype,
        };

        try {
            const data = await s3Client.send(new PutObjectCommand(uploadParams));
            const imageUrl = `https://${process.env.SSS_BUCKET}.s3.${process.env.SSS_REGION}.amazonaws.com/${fileName}`;
            // 서버 내부의 /ocr로 이미지 URL과 함께 POST 요청 전송
            const ocrResponse = await axios.post(`${process.env.SERVER_INTERNAL_URL}/api/ocr`, { imageUrl });

            // 클라이언트에게 OCR 결과 전달
            res.status(200).send({
                message: 'File uploaded and OCR processed successfully.',
                ocrResult: ocrResponse.data, // OCR 결과 반환
            });
        } catch (error) {
            console.error('S3 upload failed:', error);
            res.status(500).send({ error: 'Failed to upload to S3.' });
        }
    });
});

// 이미지 삭제 처리
router.post('/delete', async (req, res) => {
    const { fileKey } = req.body; // 삭제할 파일의 키를 요청 본문에서 받아옴

    if (!fileKey) {
        return res.status(400).send({ error: 'File key is required.' }); // 파일 키가 없을 경우 에러 반환
    }

    try {
        // S3에서 이미지 삭제
        const data = await s3Client.send(
            new DeleteObjectCommand({
                Bucket: process.env.SSS_BUCKET, // S3 Bucket의 이름
                Key: fileKey, // 삭제할 파일의 키 (경로 및 파일 이름)
            }),
        );

        console.log('Image Deleted:', fileKey); // 삭제 성공 시 로그 출력
        return res.status(200).send({ message: 'Image deleted successfully.' });
    } catch (err) {
        console.error('Image deletion failed:', err); // 삭제 실패 시 에러 로그 출력
        return res.status(500).send({ error: 'Failed to delete image.' });
    }
});

module.exports = router;


