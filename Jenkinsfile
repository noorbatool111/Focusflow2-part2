pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {

        stage('Stop and Clean') {
            steps {
                sh 'docker-compose -f docker-compose-ci.yml down || true'
                cleanWs()
            }
        }

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/noorbatool111/Focusflow2-part2.git'
            }
        }

        stage('Start Application') {
            steps {
                sh 'docker-compose -f docker-compose-ci.yml up -d --build'
                sh 'sleep 15'
            }
        }

       stage('Run Selenium Tests (Containerized)') {
    steps {
        sh '''
        docker run --rm \
        --network focusflow2-pipeline_default \
        -v $PWD:/app \
        -w /app \
        -e BASE_URL=http://focusflow-app:3000 \
        markhobson/node-chrome:latest \
        sh -c "npm install && node tests/selenium_tests.js"
        '''
    }
}
        }

        stage('Verify Running') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: All tests passed!'

            mail to: 'nhbatool111@gmail.com, qasimalik@gmail.com',
                 subject: 'Jenkins SUCCESS: FocusFlow Tests Passed',
                 body: 'Pipeline executed successfully. All Selenium test cases passed and app is running.'
        }

        failure {
            echo 'FAILURE: Pipeline failed.'

            mail to: 'nhbatool111@gmail.com, qasimalik@gmail.com',
                 subject: 'Jenkins FAILURE: FocusFlow Pipeline',
                 body: 'Pipeline failed. Check Jenkins console output.'
        }
    }
}