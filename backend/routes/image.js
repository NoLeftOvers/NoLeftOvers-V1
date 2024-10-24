const { S3Client } = require('@aws-sdk/client-s3'); // v3 모듈 가져오기
const multer = require('multer');
const uuid = require('uuid4');
const express = require('express');
const { analyzeImage } = require('../services/analyzeImage');
const { authenticateToken } = require('../services/jwt');
const router = express.Router();

const s3Client = new S3Client({
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

// 업로드 요청 전에 토큰 검증 미들웨어를 추가
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

        try {
            const imageUrl = `https://${process.env.SSS_BUCKET}.s3.${process.env.SSS_REGION}.amazonaws.com/${fileName}`;

            console.log('Before analyzing image'); // 여기에 로그 추가

            // analyzeImage 호출
            const ocrResponse = await analyzeImage(imageUrl);

            console.log('After analyzing image'); // 여기에 로그 추가

            res.status(200).send({
                message: 'File uploaded and OCR processed successfully.',
                ocrResult: ocrResponse.data,
            });
        } catch (error) {
            console.error('S3 upload failed:', error);
            res.status(500).send({ error: 'Failed to upload to S3.' });
        }
    });
});

module.exports = router;
