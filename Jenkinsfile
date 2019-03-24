

pipeline {
    agent none

    //triggers {
    //    upstream(upstreamProjects: 'kurlytail/gen-lib/master', threshold: hudson.model.Result.SUCCESS)
    //}

    parameters {
        string(defaultValue: "1.2", description: 'Build version prefix', name: 'BUILD_VERSION_PREFIX')
        string(defaultValue: "", description: 'Build number offset', name: 'BUILDS_OFFSET')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '4'))
    }

    stages {
        stage('Prepare env') {
            agent {
                label 'master'
            }

            steps {
                script {
                    loadLibrary()
                    env['NPM_VERSION_NUMBER'] = getNpmVersion 'kurlytail/gen-spring/master', params.BUILD_VERSION_PREFIX, params.BUILDS_OFFSET
                    currentBuild.displayName = env['NPM_VERSION_NUMBER']
                }
            }
        }

        stage ('NPM Build') {
            agent {
                label 'node-build'
            }

            steps {
                sh 'rm -rf *'

                checkout scm

                nodejs(nodeJSInstallationName: 'Node') {
                    sh 'npm install --no-save'
                    sh 'npm version $NPM_VERSION_NUMBER'
                    sh 'npm run lint'
                    sh 'npm run test'
                    junit 'test-report.xml'
                    publishHTML target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ]
                    sh 'npm run build'
                    sh 'npm publish'
                    sh 'mkdir __npm_versions'
                    sh 'npm outdated > __npm_versions/index.html || true'
                    publishHTML target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportDir: '__npm_versions',
                        reportFiles: 'index.html',
                        reportName: 'NPM versions'
                    ]
                }
            }
        }
    }

    post {
        always {
            slackSend message: "gen-spring build ${env.NPM_VERSION_NUMBER} - Status ${currentBuild.result} - ${env.BUILD_URL}"
        }
    }
}
