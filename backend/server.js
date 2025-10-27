const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { ethers } = require('ethers');
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// 🔧 MIDDLEWARE SETUP
// =============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(UPLOAD_DIR));

// =============================================
// 📁 FILE UPLOAD CONFIGURATION (Local Storage - NO IPFS!)
// =============================================
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await fs.mkdir(UPLOAD_DIR, { recursive: true });
            cb(null, UPLOAD_DIR);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs allowed!'));
        }
    }
});

// =============================================
// 🔗 BLOCKCHAIN CONNECTION (Hardhat Local - NO Alchemy!)
// =============================================
let provider, contract, wallet;

const initBlockchain = async () => {
    try {
        // Connect to Hardhat local node
        const rpcUrl = process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC || 'http://localhost:8545';
        provider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Use Hardhat test account (10,000 ETH pre-funded!)
        const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
        wallet = new ethers.Wallet(privateKey, provider);
        
        // Load contract
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const contractABI = require('./contract_abi.json'); // You'll need to add this
        
        contract = new ethers.Contract(contractAddress, contractABI, wallet);
        
        const network = await provider.getNetwork();
        console.log('✅ Connected to blockchain:', {
            network: network.name,
            chainId: network.chainId.toString(),
            contractAddress,
            walletAddress: wallet.address
        });
    } catch (error) {
        console.error('❌ Blockchain connection failed:', error.message);
    }
};

// =============================================
// 🗄️ MONGODB CONNECTION (Local - NO Atlas!)
// =============================================
let db;

const initDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/impactecho';
        const client = new MongoClient(mongoUri);
        await client.connect();
        db = client.db();
        
        // Create indexes
        await db.collection('donations').createIndex({ donationId: 1 }, { unique: true });
        await db.collection('donations').createIndex({ donor: 1 });
        await db.collection('donations').createIndex({ createdAt: -1 });
        
        console.log('✅ Connected to MongoDB:', mongoUri);
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
    }
};

// =============================================
// 🤖 AI VERIFICATION (Flask Mock - NO OpenAI/Google!)
// =============================================
const verifyWithAI = async (donationData, evidenceFiles) => {
    try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        
        const payload = {
            donation_id: donationData.donationId,
            description: donationData.description,
            campaign: donationData.campaign,
            amount: donationData.amount,
            geo_lat: donationData.geoLocation?.lat,
            geo_lng: donationData.geoLocation?.lng,
            evidence_files: evidenceFiles.map(f => ({
                filename: f.filename,
                path: f.path,
                url: `http://localhost:5000/uploads/${f.filename}`
            }))
        };
        
        const response = await axios.post(`${aiServiceUrl}/verify`, payload, {
            timeout: 30000 // 30 second timeout
        });
        
        return response.data;
    } catch (error) {
        console.error('❌ AI verification failed:', error.message);
        throw new Error('AI verification service unavailable');
    }
};

// =============================================
// 📝 API ROUTES
// =============================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'ImpactEcho Backend',
        version: '1.0.0',
        mode: 'FREE (Localhost)',
        blockchain: provider ? 'connected' : 'disconnected',
        database: db ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// 📤 POST /api/donate - Submit new donation
app.post('/api/donate', upload.array('evidence', 5), async (req, res) => {
    try {
        const { donor, recipient, amount, description, campaign, geo_lat, geo_lng } = req.body;
        
        // Validate required fields
        if (!donor || !recipient || !amount || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Generate unique donation ID
        const donationId = `DON-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        
        // Store files locally
        const evidenceFiles = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            url: `http://localhost:5000/uploads/${file.filename}`
        })) : [];
        
        // Create donation object
        const donation = {
            donationId,
            donor,
            recipient,
            amount: parseFloat(amount),
            description,
            campaign: campaign || 'General',
            evidenceFiles,
            geoLocation: geo_lat && geo_lng ? {
                lat: parseFloat(geo_lat),
                lng: parseFloat(geo_lng)
            } : null,
            status: 'pending',
            verificationScore: null,
            aiAnalysis: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Save to MongoDB
        await db.collection('donations').insertOne(donation);
        
        console.log(`✅ Donation created: ${donationId}`);
        
        res.status(201).json({
            success: true,
            message: 'Donation submitted successfully',
            donationId,
            donation
        });
    } catch (error) {
        console.error('❌ Error creating donation:', error);
        res.status(500).json({ error: error.message });
    }
});

// 🔍 POST /api/verify - Verify donation with AI
app.post('/api/verify', async (req, res) => {
    try {
        const { donationId } = req.body;
        
        if (!donationId) {
            return res.status(400).json({ error: 'donationId required' });
        }
        
        // Get donation from database
        const donation = await db.collection('donations').findOne({ donationId });
        
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        
        if (donation.status === 'verified') {
            return res.status(400).json({ error: 'Donation already verified' });
        }
        
        // Call AI service
        const aiResult = await verifyWithAI(donation, donation.evidenceFiles || []);
        
        // Update donation with AI results
        const updateData = {
            status: aiResult.status,
            verificationScore: aiResult.score,
            aiAnalysis: aiResult,
            verifiedAt: new Date(),
            updatedAt: new Date()
        };
        
        await db.collection('donations').updateOne(
            { donationId },
            { $set: updateData }
        );
        
        // If verified, record on blockchain
        if (aiResult.status === 'verified' && contract) {
            try {
                const tx = await contract.recordDonation(
                    donationId,
                    donation.donor,
                    donation.recipient,
                    ethers.parseEther(donation.amount.toString()),
                    aiResult.score,
                    JSON.stringify(donation.evidenceFiles.map(f => f.url))
                );
                
                const receipt = await tx.wait();
                
                await db.collection('donations').updateOne(
                    { donationId },
                    { $set: { blockchainTxHash: receipt.hash } }
                );
                
                console.log(`⛓️ Blockchain record: ${receipt.hash}`);
            } catch (blockchainError) {
                console.error('⚠️ Blockchain recording failed:', blockchainError.message);
                // Continue anyway - verification succeeded
            }
        }
        
        console.log(`✅ Verification completed: ${donationId} - Score: ${aiResult.score}`);
        
        res.json({
            success: true,
            message: 'Verification completed',
            donationId,
            result: aiResult
        });
    } catch (error) {
        console.error('❌ Verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 📊 GET /api/donations - Get all donations
app.get('/api/donations', async (req, res) => {
    try {
        const { status, donor, limit = 50, skip = 0 } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (donor) query.donor = donor;
        
        const donations = await db.collection('donations')
            .find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .toArray();
        
        const total = await db.collection('donations').countDocuments(query);
        
        res.json({
            success: true,
            donations,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        console.error('❌ Error fetching donations:', error);
        res.status(500).json({ error: error.message });
    }
});

// 📈 GET /api/analytics - Get analytics data
app.get('/api/analytics', async (req, res) => {
    try {
        const totalDonations = await db.collection('donations').countDocuments();
        const verifiedCount = await db.collection('donations').countDocuments({ status: 'verified' });
        const pendingCount = await db.collection('donations').countDocuments({ status: 'pending' });
        const rejectedCount = await db.collection('donations').countDocuments({ status: 'rejected' });
        
        const donations = await db.collection('donations').find().toArray();
        const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
        const avgScore = donations
            .filter(d => d.verificationScore)
            .reduce((sum, d, _, arr) => sum + d.verificationScore / arr.length, 0);
        
        // Campaign distribution
        const campaignStats = await db.collection('donations').aggregate([
            { $group: { _id: '$campaign', count: { $sum: 1 }, total: { $sum: '$amount' } } },
            { $sort: { count: -1 } }
        ]).toArray();
        
        // Monthly trends
        const monthlyTrends = await db.collection('donations').aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                    amount: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();
        
        res.json({
            success: true,
            analytics: {
                overview: {
                    totalDonations,
                    verifiedCount,
                    pendingCount,
                    rejectedCount,
                    totalAmount: totalAmount.toFixed(2),
                    avgScore: avgScore.toFixed(2),
                    verificationRate: ((verifiedCount / totalDonations) * 100).toFixed(1)
                },
                campaigns: campaignStats,
                trends: monthlyTrends
            }
        });
    } catch (error) {
        console.error('❌ Error fetching analytics:', error);
        res.status(500).json({ error: error.message });
    }
});

// 🔎 GET /api/donations/:id - Get single donation
app.get('/api/donations/:id', async (req, res) => {
    try {
        const donation = await db.collection('donations').findOne({ donationId: req.params.id });
        
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        
        res.json({
            success: true,
            donation
        });
    } catch (error) {
        console.error('❌ Error fetching donation:', error);
        res.status(500).json({ error: error.message });
    }
});

// =============================================
// 🚀 START SERVER
// =============================================
const startServer = async () => {
    try {
        console.log('\n' + '='.repeat(60));
        console.log('🚀 ImpactEcho Backend - Starting...');
        console.log('='.repeat(60));
        
        // Initialize connections
        await initDatabase();
        await initBlockchain();
        
        // Ensure upload directory exists
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        console.log(`✅ Upload directory ready: ${UPLOAD_DIR}`);
        
        // Start Express server
        app.listen(PORT, () => {
            console.log('\n' + '='.repeat(60));
            console.log(`✅ Backend running on http://localhost:${PORT}`);
            console.log('='.repeat(60));
            console.log('\n📡 Available endpoints:');
            console.log(`   GET  /health               - Health check`);
            console.log(`   POST /api/donate           - Submit donation`);
            console.log(`   POST /api/verify           - Verify donation`);
            console.log(`   GET  /api/donations        - Get all donations`);
            console.log(`   GET  /api/donations/:id    - Get single donation`);
            console.log(`   GET  /api/analytics        - Get analytics`);
            console.log(`   GET  /uploads/*            - Serve evidence files`);
            console.log('\n' + '='.repeat(60));
            console.log('✅ 100% FREE - No Alchemy, No Pinata, No OpenAI!');
            console.log('='.repeat(60) + '\n');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});
