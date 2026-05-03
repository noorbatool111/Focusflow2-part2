pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        PUSHER_EMAIL   = ''
        INSTRUCTOR_EMAIL = 'qasimalik@gmail.com'
    }

    stages {

        // ── 1. Stop any previous run ────────────────────────────────────────
        stage('Stop and Clean') {
            steps {
                sh 'docker rm -f focusflow2-ci || true'
                sh 'docker-compose -p focusflow-ci -f docker-compose-ci.yml down --remove-orphans || true'
                cleanWs()
            }
        }

        // ── 2. Clone the repository ─────────────────────────────────────────
        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/noorbatool111/Focusflow2-part2.git'

                // Resolve the pusher's email from git history
                script {
                    def authorEmail = sh(
                        script: "git log -1 --format='%ae'",
                        returnStdout: true
                    ).trim()

                    // Use git email if valid, otherwise fall back to your own email
                    env.PUSHER_EMAIL = (authorEmail?.contains('@'))
                        ? authorEmail
                        : 'nhbatool111@gmail.com'

                    echo "📧  Push detected from: ${env.PUSHER_EMAIL}"

                    // Only notify the instructor when HE is the one who pushed
                    if (env.PUSHER_EMAIL == env.INSTRUCTOR_EMAIL) {
                        echo "ℹ️   Instructor push — email will go to ${env.INSTRUCTOR_EMAIL}"
                    } else {
                        echo "ℹ️   Student push — email will go to ${env.PUSHER_EMAIL} only"
                    }
                }
            }
        }

        // ── 3. Build & start the app ────────────────────────────────────────
        stage('Start Application') {
            steps {
                sh 'docker-compose -p focusflow-ci -f docker-compose-ci.yml up -d --build'
                // Poll until the app responds (max ~60 s)
                sh '''
                    echo "Waiting for application to be ready..."
                    for i in $(seq 1 12); do
                        if curl -sf http://localhost:3000 > /dev/null 2>&1; then
                            echo "✅  Application is up (attempt $i)"
                            exit 0
                        fi
                        echo "⏳  Attempt $i/12 – sleeping 5 s..."
                        sleep 5
                    done
                    echo "❌  Application did not start in time"
                    docker-compose -p focusflow-ci -f docker-compose-ci.yml logs
                    exit 1
                '''
            }
        }

        // ── 4. Run the Selenium test suite ──────────────────────────────────
        stage('Run Selenium Tests') {
            steps {
                sh '''
                    docker run --rm \
                        --network focusflow-ci_default \
                        -v "$PWD":/app \
                        -v /app/node_modules \
                        -w /app \
                        -e BASE_URL=http://focusflow-app:3000 \
                        markhobson/node-chrome:latest \
                        sh -c "npm install && npm run test:selenium 2>&1 | tee /app/test-results.txt; exit \${PIPESTATUS[0]}"
                '''
            }
        }

        // ── 5. Confirm containers still up ─────────────────────────────────
        stage('Verify Running') {
            steps {
                sh 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
            }
        }
    }

    // ── Post-build notifications ────────────────────────────────────────────
    post {

        success {
            script {
                def report = ''
                try {
                    report = readFile('test-results.txt')
                } catch (e) {
                    report = '(test output not available)'
                }

                // Send ONLY to the pusher.
                // If the pusher IS the instructor, that already covers him —
                // no extra CC needed for anyone else's pushes.
                def mailTo = env.PUSHER_EMAIL

                mail(
                    to:      mailTo,
                    subject: "✅ [FocusFlow] Jenkins Pipeline PASSED — ${env.BUILD_TAG}",
                    body: """\
Hello,

The Jenkins CI pipeline for FocusFlow2 completed SUCCESSFULLY.

Triggered by : ${env.PUSHER_EMAIL}
Branch       : ${env.GIT_BRANCH}
Commit       : ${env.GIT_COMMIT?.take(8)}
Build #      : ${env.BUILD_NUMBER}
Build URL    : ${env.BUILD_URL}

─── Test Results ─────────────────────────────────
${report}
──────────────────────────────────────────────────

Regards,
Jenkins CI — FocusFlow2
"""
                )
            }
        }

        failure {
            script {
                def report = ''
                try {
                    report = readFile('test-results.txt')
                } catch (e) {
                    report = '(test output not available – pipeline may have failed before tests ran)'
                }

                // Same rule: email goes only to whoever pushed.
                // If that person IS the instructor, he gets it automatically.
                def mailTo = env.PUSHER_EMAIL

                mail(
                    to:      mailTo,
                    subject: "❌ [FocusFlow] Jenkins Pipeline FAILED — ${env.BUILD_TAG}",
                    body: """\
Hello,

The Jenkins CI pipeline for FocusFlow2 has FAILED.

Triggered by : ${env.PUSHER_EMAIL}
Branch       : ${env.GIT_BRANCH}
Commit       : ${env.GIT_COMMIT?.take(8)}
Build #      : ${env.BUILD_NUMBER}
Build URL    : ${env.BUILD_URL}

Please check the console output at the URL above for details.

─── Test Results / Last Output ───────────────────
${report}
──────────────────────────────────────────────────

Regards,
Jenkins CI — FocusFlow2
"""
                )
            }
        }

        // Always tear down so the server stays "down" between pushes
        always {
            sh 'docker-compose -p focusflow-ci -f docker-compose-ci.yml down --remove-orphans || true'
        }
    }
}