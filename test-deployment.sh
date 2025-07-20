#!/bin/bash

echo "🧪 VIT SmartBot - Deployment Testing"
echo "===================================="

# Check if URL is provided or use localhost
URL=${1:-"http://localhost:3000"}
echo "Testing deployment at: $URL"
echo ""

# Test 1: Health Check
echo "1. 🏥 Testing Health Check..."
health_response=$(curl -s "$URL/api/health")
if [[ $? -eq 0 ]]; then
    echo "✅ Health check passed"
    echo "   Response: $(echo $health_response | cut -c1-50)..."
else
    echo "❌ Health check failed"
fi
echo ""

# Test 2: Main Page
echo "2. 🏠 Testing Main Page..."
main_response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/")
if [[ $main_response -eq 200 ]]; then
    echo "✅ Main page accessible (HTTP $main_response)"
else
    echo "❌ Main page failed (HTTP $main_response)"
fi
echo ""

# Test 3: Chatbot Page
echo "3. 🤖 Testing Chatbot Page..."
chatbot_response=$(curl -s -o /dev/null -w "%{http_code}" "$URL/chatbot")
if [[ $chatbot_response -eq 200 ]]; then
    echo "✅ Chatbot page accessible (HTTP $chatbot_response)"
else
    echo "❌ Chatbot page failed (HTTP $chatbot_response)"
fi
echo ""

# Test 4: Demo API
echo "4. 🎯 Testing Demo API..."
demo_api_response=$(curl -s -X POST "$URL/api/chatbot-demo" \
    -H "Content-Type: application/json" \
    -d '{"message": "hello", "category": "general"}')

if [[ $? -eq 0 ]] && [[ $demo_api_response == *"response"* ]]; then
    echo "✅ Demo API working"
    echo "   Response contains: $(echo $demo_api_response | grep -o '"response":"[^"]*"' | cut -c12-50)..."
else
    echo "❌ Demo API failed"
    echo "   Response: $demo_api_response"
fi
echo ""

# Test 5: Main API (with fallback)
echo "5. 🔄 Testing Main API (with fallback)..."
main_api_response=$(curl -s -X POST "$URL/api/chatbot" \
    -H "Content-Type: application/json" \
    -d '{"message": "what are hostel facilities", "category": "hostel"}')

if [[ $? -eq 0 ]]; then
    echo "✅ Main API accessible"
    if [[ $main_api_response == *"demo"* ]]; then
        echo "   Running in demo mode (expected without MongoDB)"
    else
        echo "   Running with database connection"
    fi
else
    echo "❌ Main API failed"
    echo "   Response: $main_api_response"
fi
echo ""

# Test 6: Database Initialization
echo "6. 🗄️ Testing Database Initialization..."
init_response=$(curl -s -X POST "$URL/api/init-db")
if [[ $? -eq 0 ]]; then
    echo "✅ Database init endpoint accessible"
    if [[ $init_response == *"success"* ]]; then
        echo "   Database initialized successfully"
    elif [[ $init_response == *"Failed to initialize"* ]]; then
        echo "   Database init failed (expected without MongoDB)"
    fi
else
    echo "❌ Database init endpoint failed"
fi
echo ""

# Test 7: Specific Intent Recognition
echo "7. 🧠 Testing NLP Intent Recognition..."
intent_tests=(
    '{"message": "tell me about placements", "expected": "placements"}'
    '{"message": "hostel facilities", "expected": "hostel"}'
    '{"message": "course information", "expected": "courses"}'
    '{"message": "faculty contact", "expected": "faculty"}'
)

for test in "${intent_tests[@]}"; do
    message=$(echo $test | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    expected=$(echo $test | grep -o '"expected":"[^"]*"' | cut -d'"' -f4)
    
    nlp_response=$(curl -s -X POST "$URL/api/chatbot-demo" \
        -H "Content-Type: application/json" \
        -d "{\"message\": \"$message\"}")
    
    if [[ $nlp_response == *"$expected"* ]]; then
        echo "   ✅ Intent '$expected' recognized for: '$message'"
    else
        echo "   ❌ Intent '$expected' not recognized for: '$message'"
    fi
done
echo ""

# Test 8: Performance Check
echo "8. ⚡ Performance Test..."
start_time=$(date +%s%N)
perf_response=$(curl -s "$URL/api/chatbot-demo" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"message": "quick test"}')
end_time=$(date +%s%N)

duration=$(( (end_time - start_time) / 1000000 ))
if [[ $duration -lt 1000 ]]; then
    echo "✅ Response time: ${duration}ms (excellent)"
elif [[ $duration -lt 3000 ]]; then
    echo "✅ Response time: ${duration}ms (good)"
else
    echo "⚠️  Response time: ${duration}ms (could be improved)"
fi
echo ""

# Summary
echo "📊 Deployment Test Summary"
echo "=========================="
echo "URL: $URL"
echo "Timestamp: $(date)"
echo ""
echo "🎉 VIT SmartBot deployment test completed!"
echo ""
echo "Next steps:"
echo "- If all tests pass, your deployment is ready!"
echo "- If database tests fail, connect MongoDB and run init-db"
echo "- For production, ensure environment variables are set"
echo "- Monitor the health endpoint: $URL/api/health"
echo ""
echo "🌐 Access your VIT SmartBot at: $URL/chatbot"