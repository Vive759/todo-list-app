pipeline {
    agent any
    
    triggers {
        pollSCM('* * * * *')
    }
    
    stages {
        stage('Checkout Code') {
            steps {
                echo '🚀 Jenkins Pipeline Started'
                echo '📅 Time: ' + new Date()
                
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Vive759/todo-list-app.git'
                    ]]
                ])
                
                script {
                    def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    
                    echo '📝 Latest Commit: ' + commitHash
                    echo '💬 Commit Message: ' + commitMsg
                    echo '👤 Author: ' + sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                }
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Build Stage'
                sh '''
                    echo "Build process would run here"
                    echo "Listing files:"
                    ls -la
                '''
            }
        }
        
        stage('Complete') {
            steps {
                echo '✅ Pipeline Completed Successfully'
                echo '🎉 Jenkins is working correctly!'
            }
        }
    }
    
    post {
        always {
            echo '🏁 Build finished: ' + currentBuild.currentResult
        }
    }
}
