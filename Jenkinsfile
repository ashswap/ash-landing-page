pipeline {
  environment {
    GITLAB_CREDENTIAL_ID = 'gitlab-registry-id'
    PROJECT_PATH = 'trancport/blockchain/ashswap/ash-landing-page'
    ENV = 'mainnet'
    DOCKER_CONTEXT = '.'
    DOCKERFILE = 'Dockerfile'
    IMAGE_LATEST_TAG = 'latest'
  }
  agent {
    node {
      label 'base'
    }

  }
  stages {
    stage ('Checkout SCM') {
      steps {
        checkout(scm)
        sh 'git tag --points-at HEAD --sort -version:refname | head -1 > GIT_TAG'
        script {
          gitTag = readFile('GIT_TAG').trim()
        }
      }
    }

    stage('Build & push') {
      when {
        expression {
          sh([returnStdout: true, script: "echo ${gitTag} | tr -d '\n'"])
        }
      }
      steps {
        container('base') {
          sh 'printenv'
          sh "docker build -t registry.gitlab.com/${PROJECT_PATH}:${gitTag} -t registry.gitlab.com/${PROJECT_PATH}:${IMAGE_LATEST_TAG} ${DOCKER_CONTEXT} --build-arg ENV=${ENV} -f ${DOCKERFILE}"
          withCredentials([usernamePassword(credentialsId : "$GITLAB_CREDENTIAL_ID" ,passwordVariable : 'REGISTRY_PASSWORD' ,usernameVariable : 'REGISTRY_USERNAME' ,)]) {
            sh 'echo "$REGISTRY_PASSWORD" | docker login registry.gitlab.com -u "$REGISTRY_USERNAME" --password-stdin'
            sh "docker push registry.gitlab.com/${PROJECT_PATH}:${gitTag} && docker push registry.gitlab.com/${PROJECT_PATH}:${IMAGE_LATEST_TAG}"
          }

        }

      }
    }

  }
}
