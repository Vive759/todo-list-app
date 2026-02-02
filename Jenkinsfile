stage('Show Changes') {
    steps {
        echo '🔍 Displaying Git Changes'
        sh '''
            echo "=== GIT CHANGES ==="
            echo "📊 Statistics:"
            git show --stat HEAD
            
            echo ""
            echo "📄 Changed files:"
            git show --name-only --pretty="" HEAD
            
            echo ""
            echo "📝 Actual changes:"
            git show HEAD
        '''
    }
}
