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

        stage('Run Selenium Tests') {
            steps {
                sh '''
                docker run --rm \
                --network focusflow2-pipeline_default \
                -v $PWD:/app \
                -v /app/node_modules \
                -w /app \
                -e BASE_URL=http://focusflow-app:3000 \
                markhobson/node-chrome:latest \
                sh -c "npm install && npm run test:selenium"
                '''
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
            mail to: 'nhbatool111@gmail.com',
                 subject: 'Jenkins SUCCESS',
                 body: 'Pipeline executed successfully. All tests passed.'
        }

        failure {
            mail to: 'nhbatool111@gmail.com',
                 subject: 'Jenkins FAILURE',
                 body: 'Pipeline failed. Check Jenkins console.'
        }