pipeline {
    agent any

    stages {
        stage('Clean Workspace') {
            steps {
                // Using cleanWs instead of deleteDir to avoid file locking issues
                cleanWs(deleteDirs: true)
            }
        }

        stage('Clone Code') {
            steps {
                // Ensure branch name matches your GitHub default (usually 'main')
                git branch: 'main', url: 'https://github.com/noorbatool111/Focusflow2-part2.git'
            }
        }

        stage('Run CI Container') {
            steps {
                sh '''
                # Stops and removes existing containers and orphans
                docker-compose -f docker-compose-ci.yml down --remove-orphans || true
                
                # Builds fresh images and starts containers in detached mode
                docker-compose -f docker-compose-ci.yml up -d --build
                '''
            }
        }

        stage('Verify Running') {
            steps {
                // Checks if the containers are actually up
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful! FocusFlow is running.'
        }
        failure {
            echo 'Pipeline failed. Check the logs above for file permission or Docker errors.'
        }
    }
}
