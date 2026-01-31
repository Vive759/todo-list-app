pipeline {
    agent any
    
    triggers {
        githubPush()  // Trigger on GitHub webhook
    }
    
    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
    
    environment {
        LOCAL_MACHINE = 'user@your-local-ip'
        LOCAL_PATH = '/path/to/local/repo'
        SYNC_SCRIPT = 'post-sync-script.sh'
    }
    
    stages {
        stage('Checkout & Prepare') {
            steps {
                // Clean workspace
                cleanWs()
                
                // Checkout from GitHub
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/${BRANCH_NAME}']],
                    extensions: [
                        [$class: 'CloneOption', depth: 0, noTags: false, shallow: false],
                        [$class: 'CleanBeforeCheckout']
                    ],
                    userRemoteConfigs: [[
                        url: 'https://github.com/YOUR_USERNAME/YOUR_REPO.git',
                        credentialsId: 'github-credentials'
                    ]]
                ])
                
                // Get commit info
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    env.GIT_MESSAGE = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    env.GIT_AUTHOR = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
                    
                    echo "Building commit: ${env.GIT_COMMIT}"
                    echo "Author: ${env.GIT_AUTHOR}"
                    echo "Message: ${env.GIT_MESSAGE}"
                }
            }
        }
        
        stage('Build/Test in Jenkins') {
            steps {
                script {
                    echo "Building in Jenkins workspace..."
                    
                    // Example: For Node.js project
                    // sh 'npm install'
                    // sh 'npm run build'
                    // sh 'npm test'
                    
                    // Example: For Java/Maven
                    // sh 'mvn clean compile'
                    // sh 'mvn test'
                    
                    // Example: For Python
                    // sh 'python -m pip install -r requirements.txt'
                    // sh 'python -m pytest'
                    
                    // Your build steps here
                    echo "Build completed in Jenkins workspace at: ${WORKSPACE}"
                    
                    // Save build artifacts (optional)
                    archiveArtifacts artifacts: '**/target/*.jar, **/dist/*, **/build/*', fingerprint: true
                }
            }
        }
        
        stage('Sync to Local Machine') {
            steps {
                script {
                    echo "Syncing changes to local machine..."
                    
                    // Method 1: Direct rsync over SSH (most reliable)
                    sh """
                        # Create SSH key configuration
                        mkdir -p ~/.ssh
                        cp \${JENKINS_SSH_KEY} ~/.ssh/id_rsa
                        chmod 600 ~/.ssh/id_rsa
                        
                        # Sync files to local machine
                        rsync -avz --progress --delete \
                            -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" \
                            ${WORKSPACE}/ \
                            ${env.LOCAL_MACHINE}:${env.LOCAL_PATH}/
                        
                        echo "Files synced successfully!"
                    """
                    
                    // Method 2: Using SCP (alternative)
                    /*
                    sh """
                        scp -r -i \${JENKINS_SSH_KEY} \
                            ${WORKSPACE}/* \
                            ${env.LOCAL_MACHINE}:${env.LOCAL_PATH}/
                    """
                    */
                }
            }
        }
        
        stage('Execute on Local Machine') {
            steps {
                script {
                    echo "Running post-sync operations on local machine..."
                    
                    // SSH into local machine and execute commands
                    sh """
                        ssh -i \${JENKINS_SSH_KEY} \
                            -o StrictHostKeyChecking=no \
                            ${env.LOCAL_MACHINE} << 'ENDSSH'
                        
                        cd ${env.LOCAL_PATH}
                        
                        # Verify sync
                        echo "=== Sync Verification ==="
                        echo "Local directory: \$(pwd)"
                        echo "Files count: \$(find . -type f | wc -l)"
                        echo "Last commit synced: ${env.GIT_COMMIT}"
                        
                        # Run any local build/update commands
                        # Example 1: If it's a git repo locally
                        # git status
                        # git pull origin main
                        
                        # Example 2: Node.js project
                        # npm install
                        # npm run build
                        # pm2 restart all
                        
                        # Example 3: Docker setup
                        # docker-compose down
                        # docker-compose up -d --build
                        
                        # Example 4: Simple verification
                        echo "=== File Changes ==="
                        git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "Fresh sync"
                        
                        # Custom post-sync script if exists
                        if [ -f "${env.SYNC_SCRIPT}" ]; then
                            chmod +x ${env.SYNC_SCRIPT}
                            ./${env.SYNC_SCRIPT}
                        fi
                        
                        echo "Sync completed at: \$(date)"
                        ENDSSH
                    """
                }
            }
        }
        
        stage('Verify & Report') {
            steps {
                script {
                    echo "=== Sync Report ==="
                    echo "GitHub Commit: ${env.GIT_COMMIT}"
                    echo "Synced to: ${env.LOCAL_MACHINE}:${env.LOCAL_PATH}"
                    echo "Build Number: ${BUILD_NUMBER}"
                    echo "Status: SUCCESS"
                    
                    // Send notification (optional)
                    // emailext (
                    //     subject: "SUCCESS: GitHub Changes Synced to Local - Build #${BUILD_NUMBER}",
                    //     body: "Commit: ${env.GIT_COMMIT}\\nAuthor: ${env.GIT_AUTHOR}\\nMessage: ${env.GIT_MESSAGE}\\nLocal Machine: ${env.LOCAL_MACHINE}",
                    //     to: 'your-email@example.com'
                    // )
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup
            sh 'rm -f ~/.ssh/id_rsa'
            echo "Build ${BUILD_NUMBER} completed!"
        }
        success {
            // Update build status
            currentBuild.description = "Synced ${env.GIT_COMMIT} to ${env.LOCAL_MACHINE}"
            
            // Optional: Update GitHub status
            // step([$class: 'GitHubCommitStatusSetter',
            //     statusSource: [$class: 'ManuallyEnteredShaSource', sha: env.GIT_COMMIT],
            //     contextSource: [$class: 'ManuallyEnteredCommitContextSource', context: 'jenkins/sync'],
            //     reposSource: [$class: 'ManuallyEnteredRepositorySource', url: 'https://github.com/YOUR_USERNAME/YOUR_REPO'],
            //     errorHandlers: [[$class: 'ChangingBuildStatusErrorHandler', result: 'UNSTABLE']]
            // ])
        }
        failure {
            echo "Build failed! Check logs for details."
            // emailext (
            //     subject: "FAILED: GitHub Sync Failed - Build #${BUILD_NUMBER}",
            //     body: "Check Jenkins build: ${BUILD_URL}",
            //     to: 'your-email@example.com'
            // )
        }
    }
}
