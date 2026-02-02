pipeline {
    agent any
    
    triggers {
        // Poll GitHub every minute for changes
        pollSCM('* * * * *')
    }
    
    stages {
        stage('Checkout & Show Changes') {
            steps {
                echo "🚀 Jenkins triggered by Git push!"
                
                // Checkout code
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/Vive759/todo-list-app.git'
                    ]],
                    extensions: [
                        // Show what changed
                        [$class: 'ChangeLogExtension']
                    ]
                ])
                
                script {
                    // Get commit info
                    def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    def commitAuthor = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                    def commitDate = sh(script: 'git log -1 --pretty=%ad --date=format:"%Y-%m-%d %H:%M:%S"', returnStdout: true).trim()
                    
                    // Show what files changed
                    def changedFiles = sh(script: 'git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "First commit or no parent"', returnStdout: true).trim()
                    
                    echo "📊 COMMIT INFORMATION:"
                    echo "========================"
                    echo "📝 Commit Hash: ${commitHash}"
                    echo "👤 Author: ${commitAuthor}"
                    echo "📅 Date: ${commitDate}"
                    echo "💬 Message: ${commitMsg}"
                    
                    if (changedFiles && changedFiles != "First commit or no parent") {
                        echo ""
                        echo "📁 CHANGED FILES:"
                        echo "=================="
                        changedFiles.split('\n').each { file ->
                            echo "• ${file}"
                        }
                        
                        // Show diff for each file
                        echo ""
                        echo "📋 FILE CHANGES:"
                        echo "================"
                        changedFiles.split('\n').each { file ->
                            if (file.trim()) {
                                echo "\n📄 ${file}:"
                                def diff = sh(script: "git diff HEAD~1 HEAD -- '${file}' 2>/dev/null || echo 'No previous version'", returnStdout: true).trim()
                                echo diff.take(500) // Show first 500 chars
                            }
                        }
                    } else {
                        echo "📁 No files changed or first commit"
                    }
                    
                    // Set build display name
                    currentBuild.displayName = "Build #${BUILD_NUMBER} - ${commitHash}"
                    currentBuild.description = "${commitMsg} (by ${commitAuthor})"
                }
            }
        }
        
        stage('Build Process') {
            steps {
                echo "🔨 Building your application..."
                
                script {
                    // DETECT PROJECT TYPE AND BUILD
                    echo "🔍 Detecting project type..."
                    
                    if (fileExists('package.json')) {
                        echo "📦 Node.js project detected"
                        sh 'npm install'
                        sh 'npm run build --if-present'
                        sh 'npm test --if-present'
                    }
                    else if (fileExists('pom.xml')) {
                        echo "☕ Java Maven project detected"
                        sh 'mvn clean compile'
                        sh 'mvn test'
                    }
                    else if (fileExists('requirements.txt')) {
                        echo "🐍 Python project detected"
                        sh 'pip install -r requirements.txt'
                    }
                    else if (fileExists('build.gradle')) {
                        echo "📱 Android/Gradle project detected"
                        sh './gradlew build'
                    }
                    else {
                        echo "📁 Generic project - listing files:"
                        sh 'ls -la'
                        echo "ℹ️  Add your build commands above based on your project type"
                    }
                }
            }
        }
        
        stage('Notifications') {
            steps {
                echo "📢 Build completed successfully!"
                echo "✅ Jenkins will automatically run on every git push"
                
                script {
                    // Summary
                    def commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def totalFiles = sh(script: 'find . -type f -not -path "./.git/*" | wc -l', returnStdout: true).trim()
                    
                    echo ""
                    echo "📈 BUILD SUMMARY:"
                    echo "================="
                    echo "✅ Build: ${BUILD_NUMBER}"
                    echo "✅ Commit: ${commitHash}"
                    echo "✅ Files in project: ${totalFiles}"
                    echo "✅ Trigger: Automatic on git push"
                    echo "✅ Next: Push changes to GitHub and watch Jenkins run!"
                }
            }
        }
    }
    
    post {
        always {
            echo "🏁 Build ${currentBuild.result ?: 'SUCCESS'} - ${env.BUILD_URL}"
        }
        success {
            echo "🎉 SUCCESS! Code is built and ready."
            echo "📤 Push more changes to GitHub to trigger again!"
        }
        failure {
            echo "❌ BUILD FAILED - Check errors above"
        }
    }
}
