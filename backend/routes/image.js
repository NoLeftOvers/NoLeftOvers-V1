const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const uuid = require('uuid4');
const express = require('express');
const { analyzeImage } = require('../services/analyzeImage');
const { authenticateToken } = require('../services/jwt');
const router = express.Router();

// S3 클라이언트 생성
const s3 = new S3Client({
    region: process.env.SSS_REGION,
    credentials: {
        accessKeyId: process.env.SSS_ACCESS_KEY,
        secretAccessKey: process.env.SSS_SECRET_KEY,
    },
});
/**
 * @swagger
 * /user:
 *   get:
 *     summary: 모든 유저 데이터를 조회합니다.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 성공적으로 유저 데이터를 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "홍길동"
 *                   nickName:
 *                     type: string
 *                     example: "gildong123"
 *                   school_number:
 *                     type: string
 *                     example: "20231234"
 *                   password:
 *                     type: string
 *                     example: "$2b$10$..."
 *                   points:
 *                     type: number
 *                     example: 150
 *       500:
 *         description: 서버 오류로 인해 데이터를 가져오지 못했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error fetching users'
 */

/**
 * @swagger
 * /user/rank:
 *   get:
 *     summary: 포인트 순으로 유저 랭킹을 조회합니다.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: 성공적으로 유저 포인트 랭킹을 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "홍길동"
 *                   nickName:
 *                     type: string
 *                     example: "gildong123"
 *                   school_number:
 *                     type: string
 *                     example: "20231234"
 *                   points:
 *                     type: number
 *                     example: 150
 *       500:
 *         description: 서버 오류로 인해 데이터를 가져오지 못했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error fetching user points ranking'
 */

/**
 * @swagger
 * /user/point:
 *   get:
 *     summary: 특정 유저의 포인트 내역을 조회합니다.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 조회할 유저의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 유저의 포인트 내역을 가져왔습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nickName:
 *                   type: string
 *                   example: "gildong123"
 *                 totalPoints:
 *                   type: number
 *                   example: 150
 *                 pointHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       point:
 *                         type: number
 *                         example: 100
 *                       description:
 *                         type: string
 *                         example: "프로모션 참여 보상"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-23T18:25:43.511Z"
 *       400:
 *         description: 필수 파라미터가 누락되었습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Missing userId parameter'
 *       404:
 *         description: 유저를 찾을 수 없습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'User not found'
 *       500:
 *         description: 서버 오류로 인해 데이터를 가져오지 못했습니다.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Error fetching user points'
 */

router.post('/upload', authenticateToken, async (req, res) => {
    const upload = multer({ storage: multer.memoryStorage() }).single('file');

    upload(req, res, async (err) => {
        if (err) {
            console.error('File upload failed:', err);
            return res.status(500).send({ error: 'File upload failed.' });
        }

        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded.' });
        }

        const fileName = `${Date.now().toString()}_${uuid()}_${req.file.originalname}`;

        const params = {
            Bucket: process.env.SSS_BUCKET,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: 'public-read', // 필요에 따라 접근 권한 설정
        };

        try {
            // S3에 파일 업로드
            const command = new PutObjectCommand(params);
            await s3.send(command);
            const imageUrl = `https://${process.env.SSS_BUCKET}.s3.${process.env.SSS_REGION}.amazonaws.com/${fileName}`;

            console.log('Before analyzing image ' + imageUrl); // 업로드 후 분석 전 로그

            // analyzeImage 호출 및 결과값 할당
            const analysisResult = await analyzeImage(imageUrl);

            console.log('After analyzing image'); // 분석 완료 후 로그
            console.log(analysisResult);
            // 분석 결과를 클라이언트에게 응답으로 전송
            res.status(200).send({
                message: 'File uploaded and OCR processed successfully.',
                ocrResult: analysisResult, // 분석 결과 포함
            });
        } catch (error) {
            console.error('Upload to S3 or image analysis failed:', error.message);
            res.status(500).send({ error: 'Failed to upload to S3 or analyze image.' });
        }
    });
});

module.exports = router;
