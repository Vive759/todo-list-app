pipeline {
    agent any
    
    environment {
        // ⬇️ PASTE YOUR NGROK URL HERE (from Step 4.4)
        LOCAL_WEBHOOK_URL = 'https://informal-beryl-kindlier.ngrok-free.dev/webhook'
        
        // ⬇️ YOUR GitHub username
        GITHUB_USERNAME = 'Vive759'
        
        // Webhook secret (already configured in Jenkins credentials)
        WEBHOOK_SECRET = credentials('github-webhook-secret')
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo "📦 Checking out code..."
                
                // ⬇️ Update with YOUR GitHub URL
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Vive759/todo-list-app'
                    ]]
                ])
                
                script {
                    COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    COMMIT_MSG = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    echo "✅ Checked out: ${COMMIT_HASH} - ${COMMIT_MSG}"
                }
            }
        }
        
        stage('Trigger Local Update') {
            steps {
                echo "🚀 Triggering local repository update..."
                
                script {
                    // Simple payload
                    def payload = '{"ref":"refs/heads/main"}'
                    
                    // Send webhook to your local machine
                    sh """
                    curl -X POST '${env.LOCAL_WEBHOOK_URL}' \
                         -H "Content-Type: application/json" \
                         -H "X-GitHub-Event: push" \
                         -H "X-Hub-Signature-256: sha256=\$(echo -n '${payload}' | openssl dgst -sha256 -hmac '${env.WEBHOOK_SECRET}' | awk '{print \$2}')" \
                         -d '${payload}' \
                         -s -o /tmp/curl_output.txt -w "%{http_code}"
                    """
                    
                    // Check result
                    def http_code = sh(script: "tail -1 /tmp/curl_output.txt", returnStdout: true).trim()
                    
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
