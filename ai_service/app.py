"""
🤖 ImpactEcho - FREE Mock AI Verification Service
No OpenAI, no Google Cloud, no cost!
Simulates intelligent verification with realistic confidence scores.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time
from datetime import datetime
import os
import hashlib

app = Flask(__name__)
CORS(app)  # Enable CORS for localhost:3000

# Mock confidence score ranges for different evidence quality
SCORE_RANGES = {
    'excellent': (85, 95),
    'good': (75, 85),
    'fair': (65, 75),
    'poor': (40, 65),
    'very_poor': (20, 40)
}

# Keywords that boost confidence
POSITIVE_KEYWORDS = [
    'receipt', 'invoice', 'donation', 'thank you', 'confirmed',
    'school', 'hospital', 'charity', 'ngo', 'organization',
    'verified', 'official', 'stamp', 'signature', 'date'
]

NEGATIVE_KEYWORDS = [
    'scam', 'fake', 'fraud', 'suspicious', 'unclear', 'blurry'
]

def analyze_text(text):
    """Simulate NLP analysis of donation description"""
    if not text:
        return 50
    
    text_lower = text.lower()
    score = 60  # Base score
    
    # Boost for positive keywords
    for keyword in POSITIVE_KEYWORDS:
        if keyword in text_lower:
            score += 5
    
    # Penalty for negative keywords
    for keyword in NEGATIVE_KEYWORDS:
        if keyword in text_lower:
            score -= 10
    
    # Boost for length (more detailed = better)
    if len(text) > 100:
        score += 10
    elif len(text) > 50:
        score += 5
    
    # Cap at 95
    return min(score, 95)

def analyze_image(filename):
    """Simulate image analysis"""
    if not filename:
        return 50
    
    filename_lower = filename.lower()
    score = 65  # Base score
    
    # Check file extension
    if any(ext in filename_lower for ext in ['.jpg', '.jpeg', '.png', '.pdf']):
        score += 10
    
    # Check for meaningful filename
    if any(word in filename_lower for word in ['receipt', 'invoice', 'proof', 'evidence']):
        score += 10
    
    # Simulate file hash-based "quality" check
    file_hash = hashlib.md5(filename.encode()).hexdigest()
    hash_score = int(file_hash[:2], 16) % 20  # 0-20 range
    score += hash_score
    
    return min(score, 95)

def calculate_metadata_score(data):
    """Simulate metadata validation"""
    score = 60  # Base score
    
    # Check for geo-location
    if data.get('geo_lat') and data.get('geo_lng'):
        score += 15
    
    # Check for campaign
    if data.get('campaign'):
        score += 10
    
    # Check for amount
    if data.get('amount'):
        try:
            amount = float(data.get('amount', 0))
            if amount > 0:
                score += 10
        except:
            pass
    
    return min(score, 95)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'ImpactEcho AI Verification',
        'version': '1.0.0',
        'mode': 'FREE (Mock AI)',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/verify', methods=['POST'])
def verify_donation():
    """
    Main verification endpoint
    Simulates multi-modal AI analysis
    """
    try:
        data = request.get_json() if request.is_json else request.form.to_dict()
        
        # Simulate processing time (realistic AI inference delay)
        time.sleep(random.uniform(1.5, 3.5))
        
        # Get evidence data
        description = data.get('description', '')
        evidence_files = data.get('evidence_files', [])
        campaign = data.get('campaign', '')
        geo_lat = data.get('geo_lat')
        geo_lng = data.get('geo_lng')
        
        # Simulate multi-modal analysis
        # 1. Text/NLP Analysis (20% weight)
        nlp_score = analyze_text(description)
        
        # 2. Image Analysis (50% weight)
        if evidence_files and len(evidence_files) > 0:
            image_scores = [analyze_image(f.get('filename', '')) for f in evidence_files]
            vision_score = sum(image_scores) / len(image_scores)
        else:
            vision_score = 50  # No evidence provided
        
        # 3. Metadata Validation (30% weight)
        metadata_score = calculate_metadata_score(data)
        
        # Calculate weighted final score
        final_score = int(
            (vision_score * 0.5) + 
            (metadata_score * 0.3) + 
            (nlp_score * 0.2)
        )
        
        # Add small random variance for realism
        final_score = min(95, max(40, final_score + random.randint(-5, 5)))
        
        # Determine status based on score
        if final_score >= 70:
            status = 'verified'
            recommendation = 'APPROVE'
            reason = 'Strong evidence and authentic documentation detected.'
        elif final_score >= 40:
            status = 'manual_review'
            recommendation = 'REVIEW'
            reason = 'Evidence requires manual verification by team.'
        else:
            status = 'rejected'
            recommendation = 'REJECT'
            reason = 'Insufficient or unclear evidence provided.'
        
        # Build detailed response
        response = {
            'donationId': data.get('donation_id'),
            'score': final_score,
            'status': status,
            'recommendation': recommendation,
            'reason': reason,
            'details': {
                'vision_analysis': {
                    'score': round(vision_score, 2),
                    'weight': '50%',
                    'detected_features': [
                        'receipt', 'document', 'text', 'logo'
                    ] if vision_score > 70 else ['unclear image'],
                    'image_count': len(evidence_files) if evidence_files else 0
                },
                'nlp_analysis': {
                    'score': round(nlp_score, 2),
                    'weight': '20%',
                    'authenticity': 'high' if nlp_score > 75 else 'medium' if nlp_score > 60 else 'low',
                    'specificity': 'detailed' if len(description) > 100 else 'basic'
                },
                'metadata_analysis': {
                    'score': round(metadata_score, 2),
                    'weight': '30%',
                    'has_location': bool(geo_lat and geo_lng),
                    'has_campaign': bool(campaign),
                    'validation': 'passed' if metadata_score > 70 else 'partial'
                }
            },
            'confidence': f"{final_score}%",
            'verified_at': datetime.now().isoformat(),
            'ai_model': 'ImpactEcho Mock AI v1.0 (FREE)',
            'processing_time': f"{random.uniform(2.0, 4.0):.2f}s"
        }
        
        # Log verification
        print(f"\n{'='*60}")
        print(f"🤖 AI VERIFICATION COMPLETED")
        print(f"{'='*60}")
        print(f"Donation ID: {data.get('donation_id')}")
        print(f"Final Score: {final_score}/100")
        print(f"Status: {status.upper()}")
        print(f"Vision: {vision_score:.1f} | Metadata: {metadata_score:.1f} | NLP: {nlp_score:.1f}")
        print(f"{'='*60}\n")
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"❌ ERROR in verification: {str(e)}")
        return jsonify({
            'error': 'Verification failed',
            'message': str(e),
            'status': 'error'
        }), 500

@app.route('/verify/image', methods=['POST'])
def verify_image():
    """Quick image-only verification"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        filename = file.filename
        
        # Simulate image analysis
        time.sleep(random.uniform(1.0, 2.0))
        
        score = analyze_image(filename)
        
        return jsonify({
            'filename': filename,
            'score': score,
            'confidence': f"{score}%",
            'detected_objects': ['receipt', 'document', 'text'] if score > 70 else ['unclear'],
            'quality': 'good' if score > 70 else 'poor',
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/verify/text', methods=['POST'])
def verify_text():
    """Quick text-only verification"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        # Simulate NLP analysis
        time.sleep(random.uniform(0.5, 1.5))
        
        score = analyze_text(text)
        
        return jsonify({
            'text_length': len(text),
            'score': score,
            'confidence': f"{score}%",
            'authenticity': 'high' if score > 75 else 'medium' if score > 60 else 'low',
            'contains_keywords': any(kw in text.lower() for kw in POSITIVE_KEYWORDS),
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get AI service statistics"""
    return jsonify({
        'total_verifications': random.randint(100, 500),
        'average_score': random.randint(75, 85),
        'verification_rate': f"{random.randint(85, 95)}%",
        'average_processing_time': f"{random.uniform(2.0, 4.0):.2f}s",
        'model_version': '1.0.0',
        'last_updated': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🤖 ImpactEcho FREE Mock AI Verification Service")
    print("="*60)
    print("✅ No OpenAI API key needed!")
    print("✅ No Google Cloud credentials needed!")
    print("✅ 100% FREE - Simulated AI analysis")
    print("="*60)
    print("\n🚀 Starting service on http://localhost:8000")
    print("\n📡 Available endpoints:")
    print("   GET  /health          - Health check")
    print("   POST /verify          - Full verification")
    print("   POST /verify/image    - Image only")
    print("   POST /verify/text     - Text only")
    print("   GET  /stats           - Service statistics")
    print("\n" + "="*60 + "\n")
    
    # Run Flask app
    app.run(host='0.0.0.0', port=8000, debug=True)
