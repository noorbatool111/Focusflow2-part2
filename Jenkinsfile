pipeline {
    agent any

    triggers {
        githubPush()
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    stages {

        stage('Stop and Clean') {
            steps {
                sh 'docker-compose -p focusflow2-part2 -f docker-compose-ci.yml down || true'
                sh 'docker system prune -f'
                cleanWs()
            }
        }

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/noorbatool111/Focusflow2-part2.git'
                script {
                    // Dynamically capture the email of the person who pushed
                    env.COMMITTER_EMAIL = sh(script: "git log -1 --pretty=format:'%ae'", returnStdout: true).trim()
                }
            }
        }

        stage('Start Application') {
            steps {
                sh 'docker-compose -p focusflow2-part2 -f docker-compose-ci.yml up -d --build'
                sh '''
                echo "Waiting for Next.js to finish compiling..."
                docker run --rm --network focusflow2-part2_default markhobson/node-chrome:latest sh -c "
                  ATTEMPTS=0; MAX=36;
                  while ! curl -s http://focusflow-app:3000/signup > /dev/null; do
                    ATTEMPTS=\$((ATTEMPTS+1));
                    if [ \$ATTEMPTS -ge \$MAX ]; then
                      echo 'ERROR: App did not start after 3 minutes. Aborting.';
                      exit 1;
                    fi;
                    echo \"Still compiling Next.js... (\$ATTEMPTS/\$MAX)\";
                    sleep 5;
                  done;
                  echo 'Next.js is fully compiled and ready!'
                "
                '''
            }
        }

        stage('Run Selenium Tests (Containerized)') {
            steps {
                sh '''
                docker run --rm \
                --network focusflow2-part2_default \
                -v $PWD:/app \
                -v focusflow-ci-node-cache:/app/node_modules \
                -w /app \
                -e BASE_URL=http://focusflow-app:3000 \
                markhobson/node-chrome:latest \
                bash -c "npm install --prefer-offline && npx mocha tests/selenium_tests.js"
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
            echo 'SUCCESS: All tests passed!'

            mail to: "${env.COMMITTER_EMAIL}",
                 subject: "Jenkins SUCCESS: FocusFlow Tests Passed",
                 body: "Pipeline executed successfully for your push. All Selenium test cases passed and the app is running."
        }

        failure {
            echo 'FAILURE: Pipeline failed.'

            mail to: "${env.COMMITTER_EMAIL}",
                 subject: "Jenkins FAILURE: FocusFlow Pipeline",
                 body: "Pipeline failed for your recent push. Check Jenkins console output for details."
        }
    }
}
