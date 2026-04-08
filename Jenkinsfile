pipeline {
    agent any

    stages {
        stage('Stop and Clean') {
            steps {
                // 1. Stop the container first to release the folder lock
                sh 'docker-compose -f docker-compose-ci.yml down || true'
                
                // 2. Now clean the workspace safely
                cleanWs()
            }
        }

        stage('Clone Code') {
            steps {
                // 3. Fetch the fresh code from GitHub
                git branch: 'main', url: 'https://github.com/noorbatool111/Focusflow2-part2.git'
            }
        }

        stage('Run CI Container') {
            steps {
                // 4. Start the container back up
                sh 'docker-compose -f docker-compose-ci.yml up -d --build'
            }
        }

        stage('Verify Running') {
            steps {
                // 5. Confirm it's running for the logs
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: Website is live at http://13.63.56.112:4000'
        }
    }
}
