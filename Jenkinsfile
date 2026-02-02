pipeline {
    agent any
    
    environment {
        // ⬇️ Your ngrok URL
        LOCAL_WEBHOOK_URL = 'https://informal-beryl-kindlier.ngrok-free.dev/webhook'
        
        // ⬇️ Your GitHub username
        GITHUB_USERNAME = 'Vive759'
        
        // Webhook secret from Jenkins credentials
        WEBHOOK_SECRET = credentials('github-webhook-secret')
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out code..."
                
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Vive759/todo-list-app.git'
                    ]]
                ])
                
                script {
                    // FIXED: Use def keyword
                    def COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def COMMIT_MSG = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    echo "✅ Checked out: ${COMMIT_HASH} - ${COMMIT_MSG}"
                }
            }
        }
        
        stage('Trigger Local Update') {
            steps {
                echo "🚀 Triggering local repository update..."
                
                script {
                    // Get commit info
                    def COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    
                    // Create payload
                    def payload = '{"ref":"refs/heads/main"}'
                    
                    // FIXED: Use single quotes and escape properly
                    sh """
                        # Generate signature
                        SIGNATURE=\$(echo -n '${payload}' | openssl dgst -sha256 -hmac "\${WEBHOOK_SECRET}" | awk '{print \$2}')
                        
                        # Send webhook
                        curl -X POST '${env.LOCAL_WEBHOOK_URL}' \
                             -H "Content-Type: application/json" \
                             -H "X-GitHub-Event: push" \
                             -H "X-Hub-Signature-256: sha256=\${SIGNATURE}" \
                             -d '${payload}' \
                             -s -o /tmp/curl_output.txt \
                             -w "%{http_code}"
                    """
                    
                    // Check result
                    def http_code = sh(script: "cat /tmp/curl_output.txt | tail -1", returnStdout: true).trim()
                    
                    if (http_code == "200") {
                        echo "✅ Local update triggered successfully!"
                    } else {
                        echo "❌ Failed to trigger update. HTTP Code: ${http_code}"
                        sh "cat /tmp/curl_output.txt"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "🎉 Pipeline completed! Your local repository was updated."
        }
        failure {
            echo "❌ Pipeline failed. Check logs above."
        }
    }
}
