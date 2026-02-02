pipeline {
    agent any
    
    triggers {
        pollSCM('* * * * *')  // Poll every minute - GUARANTEED TO WORK
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "🚀 JENKINS JOB STARTED!"
                echo "📅 Started at: ${new Date()}"
                
                // Simple checkout
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Vive759/todo-list-app.git'
                    ]]
                ])
                
                // Show basic info
                sh '''
                    echo "✅ Checkout successful"
                    echo "📁 Current directory: $(pwd)"
                    echo "📝 Latest commit: $(git log -1 --pretty=format:"%h - %s")"
                    echo "👤 Author: $(git log -1 --pretty=format:"%an")"
                    ls -la
                '''
            }
        }
        
        stage('Build') {
            steps {
                echo "🔨 Build stage"
                sh '''
                    echo "Build would run here"
                    echo "Files in workspace:"
                    find . -type f -name "*.md" -o -name "*.txt" -o -name "*.py" -o -name "*.js" | head -10
                '''
            }
        }
        
        stage('Complete') {
            steps {
                echo "✅ PIPELINE COMPLETED SUCCESSFULLY!"
                echo "🎉 Jenkins is working!"
            }
        }
    }
    
    post {
        always {
            echo "🏁 Build ${currentBuild.currentResult} - #${BUILD_NUMBER}"
        }
        success {
            echo "🎊 SUCCESS! Everything works!"
        }
        failure {
            echo "❌ Build failed - check errors above"
        }
    }
}
