pipeline {
    agent any
    
    triggers {
        // Will be triggered by GitHub webhook
    }
    
    stages {
        stage('GitHub Webhook Triggered') {
            steps {
                echo "🚀 AUTOMATICALLY TRIGGERED BY GIT PUSH!"
                echo "⏰ Time: ${new Date()}"
                
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Vive759/todo-list-app.git'
                    ]]
                ])
                
                script {
                    // Get commit info
                    def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    def commitAuthor = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                    def commitDate = sh(script: 'git log -1 --pretty=%ad --date=format:"%Y-%m-%d %H:%M:%S"', returnStdout: true).trim()
                    
                    // Get changed files
                    def changedFiles = sh(script: 'git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "First commit or no changes"', returnStdout: true).trim()
                    
                    echo ""
                    echo "📊 COMMIT INFORMATION:"
                    echo "========================"
                    echo "📝 Hash: ${commitHash}"
                    echo "👤 Author: ${commitAuthor}"
                    echo "📅 Date: ${commitDate}"
                    echo "💬 Message: ${commitMsg}"
                    
                    if (changedFiles && changedFiles != "First commit or no changes") {
                        echo ""
                        echo "📁 CHANGED FILES:"
                        echo "=================="
                        changedFiles.split('\n').each { file ->
                            echo "• ${file}"
                        }
                    }
                    
                    currentBuild.displayName = "Build #${BUILD_NUMBER} - ${commitHash}"
                    currentBuild.description = "${commitMsg}"
                }
            }
        }
        
        stage('Build Process') {
            steps {
                echo "🔨 Building application..."
                sh 'echo "Build would run here"'
                sh 'ls -la'
            }
        }
        
        stage('Complete') {
            steps {
                echo "✅ CI/CD Pipeline Completed!"
                echo "📤 Push more changes to trigger again"
            }
        }
    }
    
    post {
        success {
            echo "🎉 SUCCESS! Jenkins automatically triggered by git push!"
        }
        failure {
            echo "❌ Build failed"
        }
    }
}
